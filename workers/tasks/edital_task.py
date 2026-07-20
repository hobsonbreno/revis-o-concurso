from celery_app import app
from pymongo import MongoClient
import os
import httpx
from datetime import datetime
import pdfplumber

from ai.claude_client import ClaudeClient
from ai.edital_analyzer import EditalAnalyzer

@app.task(bind=True, max_retries=3)
def process_edital(self, edital_id: str, file_path: str, cargo: str):
    try:
        print(f"[{edital_id}] Iniciando processamento do Edital para o cargo: {cargo}")
        
        mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
        db = mongo['study-system']
        
        # 1. Atualizar status inicial
        db['editais'].insert_one({
            'editalId': edital_id,
            'cargo': cargo,
            'status': 'processing',
            'progress': 10,
            'createdAt': datetime.utcnow()
        })
        
        # 2. Extrair texto do PDF
        print(f"[{edital_id}] Extraindo texto do PDF...")
        full_text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
        except Exception as e:
            print(f"Erro ao extrair PDF: {e}")
            raise Exception("Falha ao ler o PDF do edital.")
            
        db['editais'].update_one({'editalId': edital_id}, {'$set': {'progress': 40}})
            
        # 3. Analisar com a IA Polímata
        print(f"[{edital_id}] Passando texto para a IA para verticalização...")
        claude = ClaudeClient()
        analyzer = EditalAnalyzer(claude)
        checklist_data = analyzer.analyze(full_text, cargo)
        
        db['editais'].update_one({'editalId': edital_id}, {'$set': {'progress': 90}})
        
        # 4. Finalizar e salvar no MongoDB
        db['editais'].update_one(
            {'editalId': edital_id},
            {'$set': {
                'status': 'done',
                'progress': 100,
                'checklist': checklist_data,
                'updatedAt': datetime.utcnow()
            }}
        )
        print(f"[{edital_id}] Edital Verticalizado com sucesso!")
        
    except Exception as exc:
        print(f"Erro no processamento do edital: {exc}")
        
        # Se for erro de cota, agenda retry. Se for erro de arquivo inválido, falha imediatamente.
        if "PDF" in str(exc):
            try:
                mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
                mongo['study-system']['editais'].update_one(
                    {'editalId': edital_id},
                    {'$set': {'status': 'error', 'progress': 0, 'checklist': [{'disciplina': 'Erro', 'topicos': [{'assunto': 'O link fornecido não é um arquivo PDF válido. Por favor, faça o download do arquivo e anexe-o.', 'prioridade': 'Erro', 'peso': 0}]}]}}
                )
            except:
                pass
            return
            
        retry_delay = 45 if "429" in str(exc) or "Quota" in str(exc) else 15
        print(f"[{edital_id}] Agendando nova tentativa em {retry_delay} segundos...")
        
        try:
            mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
            mongo['study-system']['editais'].update_one(
                {'editalId': edital_id},
                {'$set': {'status': 'pending', 'progress': 15}}
            )
        except:
            pass
            
        raise self.retry(exc=exc, countdown=retry_delay)
