import os
import json
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

prompt = """Você é um elaborador sênior de questões de concursos públicos.
Sua missão é criar um simulado avançado com 1 questões de múltipla escolha estritamente sobre o tema: Interpretação de Textos.

**INSTRUÇÕES ESTRITAS:**
1. As questões DEVEM ser baseadas em questões reais de concursos anteriores de bancas grandes.
2. Cada questão DEVE ter 5 alternativas (A, B, C, D, E).
3. Você DEVE fornecer uma explicação profunda na chave "explanation". Use a palavra [QUEBRA] para separar as linhas, NUNCA use quebras de linha reais no JSON.
4. CUIDADO CRÍTICO: Não inclua vírgulas no final do último item de listas ou objetos.

Retorne APENAS um array JSON válido:
[
  {
    "id": "q1",
    "statement": "O texto...",
    "options": [
      {"letter": "A", "text": "Opção A"},
      {"letter": "B", "text": "Opção B"},
      {"letter": "C", "text": "Opção C"},
      {"letter": "D", "text": "Opção D"},
      {"letter": "E", "text": "Opção E"}
    ],
    "correct": "C",
    "explanation": "Correta: C. A alternativa C está correta porque... [QUEBRA] Incorretas: [QUEBRA] A) Errada porque... [QUEBRA] B) Errada porque...",
    "bancaStyle": "FCC",
    "difficulty": "hard",
    "topic": "Interpretação de Textos"
  }
]
"""
try:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=2000
    )
    print("RESPONSE:")
    print(chat_completion.choices[0].message.content)
except Exception as e:
    print(e)
