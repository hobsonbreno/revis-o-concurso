import json
import re

QUIZ_PROMPT = """
Você é um elaborador sênior de questões de concursos públicos.
Sua missão é criar um simulado avançado com **15 questões** de múltipla escolha estritamente sobre o tema: {topic}.

**INSTRUÇÕES ESTRITAS:**
1. Traga o MÁXIMO de questões possíveis (exatamente 15). Você deve misturar questões criadas por você (inéditas) e questões oficiais já aplicadas em concursos anteriores de bancas grandes (Cebraspe, FCC, FGV, Vunesp, etc).
2. Se o tema contiver uma indicação de prioridade (ex: 'Foco de Edital: Prioridade máxima'), ajuste a complexidade da questão para o nível mais alto de cobrança dessa disciplina.
3. Cada questão DEVE ter 5 alternativas (A, B, C, D, E).
4. Você DEVE fornecer uma explicação profunda na chave "explanation". A explicação DEVE justificar detalhadamente por que a alternativa correta é a certa, E TAMBÉM explicar o erro de CADA UMA das alternativas incorretas. Use a palavra [QUEBRA] para separar as linhas, NUNCA use quebras de linha reais no JSON.
5. CUIDADO CRÍTICO: Não inclua vírgulas no final do último item de listas ou objetos (sem trailing commas), pois isso quebra o parser JSON.

Retorne APENAS um array JSON válido (não use formatação markdown, apenas o JSON puro) no formato:
[
  {{
    "id": "q1",
    "statement": "O texto completo da pergunta, baseado em provas oficiais...",
    "options": [
      {{"letter": "A", "text": "Opção A"}},
      {{"letter": "B", "text": "Opção B"}},
      {{"letter": "C", "text": "Opção C"}},
      {{"letter": "D", "text": "Opção D"}},
      {{"letter": "E", "text": "Opção E"}}
    ],
    "correct": "C",
    "explanation": "Correta: C. A alternativa C está correta porque... [QUEBRA] Incorretas: [QUEBRA] A) Errada porque... [QUEBRA] B) Errada porque...",
    "bancaStyle": "FCC/FGV/Cebraspe",
    "difficulty": "hard",
    "topic": "{topic}"
  }}
]

Resumo auxiliar de contexto:
{content}
"""

class QuizGenerator:
    def __init__(self, claude_client):
        self.claude = claude_client

    def generate(self, topic: str, summary: str) -> list:
        prompt = QUIZ_PROMPT.format(topic=topic, content=summary[:20000])
        response = self.claude.complete(prompt, max_tokens=8000)

        try:
            # 1. Tentar extrair de blocos markdown
            md_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', response, re.DOTALL | re.IGNORECASE)
            if md_match:
                json_str = md_match.group(1)
            else:
                json_match = re.search(r'\[.*\]', response, re.DOTALL)
                if json_match:
                    json_str = json_match.group()
                else:
                    json_str = response
            
            # Remove trailing commas
            json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
            
            # Remove quebras de linha reais para evitar "Invalid control character" no json.loads
            json_str = json_str.replace('\n', ' ').replace('\r', '')
            
            parsed_data = json.loads(json_str)
            if not isinstance(parsed_data, list):
                raise ValueError("AI response is not a JSON array/list")
                
            return parsed_data
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            print(f"Raw AI response: {response}")
            return [{
                "id": "q_demo",
                "statement": "[Demo] Qual a principal característica da banca FCC (Fundação Carlos Chagas) tradicionalmente?",
                "options": [
                    {"letter": "A", "text": "Cobrança excessiva de Doutrina"},
                    {"letter": "B", "text": "Literalidade da lei (Lei Seca)"},
                    {"letter": "C", "text": "Modelo Certo e Errado (uma errada anula uma certa)"},
                    {"letter": "D", "text": "Jurisprudência internacional"}
                ],
                "correct": "B",
                "explanation": "Historicamente, a FCC foca bastante na literalidade da lei, embora venha evoluindo para casos práticos recentes.",
                "bancaStyle": "FCC",
                "difficulty": "easy",
                "topic": topic
            }]
