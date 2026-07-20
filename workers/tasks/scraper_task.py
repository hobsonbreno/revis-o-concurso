from celery_app import app
from pymongo import MongoClient
import os
import httpx
from datetime import datetime

# Importações dos módulos de IA
from ai.claude_client import ClaudeClient
from ai.mindmap_generator import MindMapGenerator
from ai.quiz_generator import QuizGenerator

@app.task(bind=True, max_retries=3)
def scrape_and_process(self, topic_id: str, title: str):
    try:
        print(f"[{topic_id}] Iniciando processamento de IA para: {title}")
        
        mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
        db = mongo['study-system']
        
        # 1. Scraping real (DuckDuckGo Lite)
        print(f"[{topic_id}] Buscando '{title}' na internet...")
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        try:
            search_url = f"https://html.duckduckgo.com/html/?q={title.replace(' ', '+')}"
            # Timeout reduzido de 15s para 5s para falhar rápido e não travar o processo
            response = httpx.get(search_url, headers=headers, timeout=5.0)
            
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            snippets = soup.find_all('a', class_='result__snippet')
            
            scraped_text = "\\n".join([s.text for s in snippets])
            if not scraped_text:
                scraped_text = f"Conteúdo sobre {title}"
                
            summary = f"Resultados da busca na internet para '{title}':\\n{scraped_text}\\n\\nBaseie-se nesses dados oficiais atualizados e no seu conhecimento prévio."
        except Exception as e:
            print(f"Erro no web scraping (falhou rápido): {e}")
            summary = f"Conteúdo sobre {title} (falha ao buscar na internet, use seu banco de dados interno)."
        
        # 2. IA Processing OTIMIZADO (Rodando em Paralelo)
        claude = ClaudeClient()
        mindmap_gen = MindMapGenerator(claude)
        quiz_gen = QuizGenerator(claude)
        
        print(f"[{topic_id}] Iniciando processamento paralelo (Mapa Mental + Quiz)...")
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_mindmap = executor.submit(mindmap_gen.generate, title, summary)
            future_quiz = executor.submit(quiz_gen.generate, title, summary)
            
            mindmap_data = future_mindmap.result()
            quiz_data = future_quiz.result()
            
        print(f"[{topic_id}] Processamento paralelo concluído!")

        from bson.objectid import ObjectId
        # 3. Atualizar Tópico no MongoDB
        db['topics'].update_one(
            {'_id': ObjectId(topic_id)},
            {'$set': {
                'status': 'done',
                'progress': 100,
                'mindmap': mindmap_data
            }}
        )
        
        # 4. Salvar Quiz no MongoDB
        db['quizzes'].insert_one({
            'topicId': ObjectId(topic_id),
            'questions': quiz_data,
            'createdAt': datetime.utcnow()
        })

        # 5. Notificar a API NestJS
        callback_url = os.environ.get('API_CALLBACK_URL', 'http://api:4800')
        httpx.post(f"{callback_url}/scraping/callback", json={
            'topicId': topic_id,
            'status': 'done',
            'userId': 'user-mocked-123'
        })
        
        print(f"[{topic_id}] Processamento de IA finalizado com sucesso!")
        
    except Exception as exc:
        print(f"Erro no scraper_task: {exc}")
        
        # Se for erro de quota (429) do Gemini, precisamos esperar mais tempo (o limite free tier reseta em ~30s)
        retry_delay = 45 if "429" in str(exc) or "Quota" in str(exc) else 15
        print(f"[{topic_id}] Agendando nova tentativa em {retry_delay} segundos...")
        
        # Atualiza o status no banco apenas para fins de tracking
        from bson.objectid import ObjectId
        mongo = MongoClient(os.environ.get('MONGODB_URI', 'mongodb://mongo:28018/study-system'))
        mongo['study-system']['topics'].update_one(
            {'_id': ObjectId(topic_id)},
            {'$set': {'status': 'pending', 'progress': 15}} # 15% indica que está aguardando retry
        )
        raise self.retry(exc=exc, countdown=retry_delay)
