import json

class EditalAnalyzer:
    def __init__(self, claude_client):
        self.claude = claude_client

    def analyze(self, edital_text: str, cargo: str) -> list:
        prompt = f"""
Você é um especialista em concursos públicos e vestibulares de altíssima performance.
Sua missão é criar um 'Edital Verticalizado' (um checklist de estudos priorizado) extraído de um edital em formato PDF.

**INSTRUÇÕES ESTRITAS:**
1. Abaixo você receberá o texto bruto extraído de um Edital em PDF.
2. Seu foco é APENAS as disciplinas e o conteúdo programático exigido para o seguinte cargo/função: '{cargo}'. Ignore regras de isenção, vagas de outros cargos, e textos inúteis.
3. Com base na sua base de conhecimento profunda sobre bancas organizadoras (ex: Cebraspe, FCC, FGV, etc.), você deve classificar a **Incidência Histórica** de cada assunto (o que cai mais em prova) para definir a prioridade do estudo.
4. Você DEVE retornar EXATAMENTE um array de objetos JSON válidos, e NADA MAIS. Nenhuma formatação markdown, apenas o array JSON puro.

**FORMATO DO JSON ESPERADO:**
[
  {{
    "disciplina": "Nome da Disciplina (ex: Engenharia de Software)",
    "topicos": [
      {{
        "assunto": "UML 2.x — diagramas de classes e casos de uso",
        "prioridade": "🔥🔥🔥 Prioridade máxima",
        "peso": 5
      }},
      {{
        "assunto": "Scrum — papéis, 5 eventos, 3 artefatos",
        "prioridade": "🔥 Em alta",
        "peso": 4
      }},
      {{
        "assunto": "Conceitos básicos de gerência de projetos",
        "prioridade": "Médio",
        "peso": 2
      }}
    ]
  }}
]

TEXTO DO EDITAL:
{edital_text[:80000]}
"""

        try:
            # Pede para a IA (Gemini -> Groq -> NVIDIA)
            response_text = self.claude.complete(prompt, max_tokens=4000)
            
            # Limpa possível markdown da resposta
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            # Valida JSON
            checklist = json.loads(response_text)
            if not isinstance(checklist, list):
                checklist = [checklist]
            return checklist
        except Exception as e:
            print(f"Erro ao analisar o edital via IA: {e}")
            print("Resposta bruta que causou falha:", response_text if 'response_text' in locals() else "Nenhuma")
            # Fallback seguro estrutural
            return [
                {
                    "disciplina": "Erro na IA ao Verticalizar",
                    "topicos": [
                        {
                            "assunto": "O modelo não conseguiu formatar os dados corretamente ou ocorreu um erro na rede. Tente reenviar.",
                            "prioridade": "Erro",
                            "peso": 0
                        }
                    ]
                }
            ]
