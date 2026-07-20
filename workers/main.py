from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tasks.scraper_task import scrape_and_process
import uvicorn

app = FastAPI(title="Study System Workers API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    topicId: str
    title: str
    userId: str = "default-user"

@app.post("/scrape")
async def trigger_scraping(req: ScrapeRequest):
    # Envia a tarefa para o Celery (processamento assíncrono em background)
    scrape_and_process.delay(req.topicId, req.title)
    return {"status": "enqueued", "topicId": req.topicId}

from fastapi import UploadFile, File, Form
import shutil
import uuid
from tasks.edital_task import process_edital

@app.post("/api/edital/analyze")
async def analyze_edital(
    cargo: str = Form(...),
    file: UploadFile = File(None),
    url: str = Form(None)
):
    if not file and not url:
        return {"status": "error", "message": "Forneça um arquivo PDF ou a URL do edital."}

    file_id = str(uuid.uuid4())
    file_path = f"/shared/{file_id}.pdf"
    
    if file:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    else:
        # Tenta extrair a URL real caso seja um visualizador de PDF (ex: Rybena da FCC)
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        if 'file' in query_params and query_params['file'][0].endswith('.pdf'):
            url = query_params['file'][0]
            
        # Tenta baixar o PDF da URL fornecida
        import httpx
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/pdf,application/xhtml+xml,text/html,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive'
            }
            async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
                response = await client.get(url, timeout=30.0, headers=headers)
                response.raise_for_status()
                
                # Check if the response is actually a PDF (starts with %PDF)
                if not response.content.startswith(b'%PDF'):
                    return {"status": "error", "message": "O link baixou uma página de bloqueio ou HTML (provavelmente bloqueio antibot da banca), não o PDF real. Por favor, baixe o PDF manualmente e use o primeiro campo."}
                
                with open(file_path, "wb") as buffer:
                    buffer.write(response.content)
        except Exception as e:
            return {"status": "error", "message": f"Falha ao baixar o edital: {str(e)}"}
        
    # Triggers the celery task
    process_edital.delay(file_id, file_path, cargo)
    
    return {"status": "enqueued", "editalId": file_id}

from pymongo import MongoClient
import os

@app.get("/api/edital/{edital_id}")
def get_edital(edital_id: str):
    mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
    edital = mongo['study-system']['editais'].find_one({"editalId": edital_id})
    if not edital:
        return {"status": "not_found"}
    if "_id" in edital:
        edital["_id"] = str(edital["_id"])
    return edital

class ProgressRequest(BaseModel):
    disciplina_idx: int
    topico_idx: int
    field: str
    value: bool

@app.put("/api/edital/{edital_id}/progress")
def update_edital_progress(edital_id: str, req: ProgressRequest):
    mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
    
    # Atualiza o campo específico (estudado ou revisado) dentro do checklist
    # req.field can be "estudado" or "revisado"
    field_path = f"checklist.{req.disciplina_idx}.topicos.{req.topico_idx}.{req.field}"
    
    result = mongo['study-system']['editais'].update_one(
        {"editalId": edital_id},
        {"$set": {field_path: req.value}}
    )
    
    return {"status": "updated", "matched": result.matched_count}

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8800)
