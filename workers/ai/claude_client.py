import os
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
try:
    from groq import Groq
except ImportError:
    Groq = None

class ClaudeClient:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.groq_api_key = os.environ.get("GROQ_API_KEY")
        self.nvidia_api_key = os.environ.get("NVIDIA_API_KEY")
        
        # Setup Gemini
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None
            
        # Setup Groq Fallback
        self.groq_client = Groq(api_key=self.groq_api_key) if self.groq_api_key and Groq else None

    def _fallback_nvidia(self, prompt: str) -> str:
        if not self.nvidia_api_key:
            raise Exception("Gemini e Groq falharam, e a NVIDIA_API_KEY não está configurada para o Fallback Final.")
        
        print("🚨 [Fallback C] Usando NVIDIA NIM (Llama 3.1 70B) devido a falha nos motores principais...")
        import httpx
        url = "https://integrate.api.nvidia.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.nvidia_api_key}"
        }
        data = {
            "model": "meta/llama-3.1-70b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 4000
        }
        response = httpx.post(url, headers=headers, json=data, timeout=120.0)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def _fallback_groq(self, prompt: str) -> str:
        if not self.groq_client:
            print("Groq não configurado, pulando para NVIDIA...")
            return self._fallback_nvidia(prompt)
        
        print("⚠️ [Fallback B] Usando Groq (Llama 3) devido a falha/bloqueio no Gemini...")
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=8000
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Erro no Groq: {e}. Tentando Fallback C (NVIDIA)...")
            return self._fallback_nvidia(prompt)

    def summarize(self, topic: str, content: str) -> str:
        if not self.model:
            return f"[Modo de Demonstração] Resumo gerado para: {topic}. Adicione a GEMINI_API_KEY no .env."
            
        prompt = f"Resuma o conteúdo a seguir focado em concursos sobre o tema '{topic}':\n\n{content[:50000]}"
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except ResourceExhausted:
            return self._fallback_groq(prompt)
        except Exception as e:
            print(f"Erro no Gemini: {e}")
            return self._fallback_groq(prompt)
        
    def complete(self, prompt: str, max_tokens: int = 4000) -> str:
        if not self.model:
            return '{"nodes": [{"id": "root", "label": "Modo Demo", "type": "root", "detail": "Adicione sua GEMINI_API_KEY no arquivo .env para ver o mapa mental real gerado pela IA.", "priority": "fire", "sources": []}], "edges": []}'
            
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except ResourceExhausted:
            return self._fallback_groq(prompt)
        except Exception as e:
            print(f"Erro no Gemini: {e}")
            return self._fallback_groq(prompt)
