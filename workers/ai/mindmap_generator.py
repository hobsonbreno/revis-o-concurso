import json
import re

MINDMAP_PROMPT = """
Você é um professor especialista multidisciplinar, capaz de criar materiais de alto desempenho para concursos públicos, vestibulares (ENEM), programação, exatas ou qualquer área acadêmica.
O aluno pediu um mapa mental sobre o tema: {topic}.

Crie um mapa mental focado e organizado, no mesmo estilo visual profissional das melhores plataformas educacionais do mercado.
Regras:
1. Crie apenas UM nó 'root' e de 5 a 8 nós 'branch' (ramos principais). NÃO crie nós do tipo 'leaf'.
2. Em CADA 'branch', inclua uma lista chamada `subTopics` com os subtópicos diretos (ex: ["Conceito", "Fórmulas", "Regras", "Exceções"]).
3. Prioridades permitidas: "fire" (mais importante), "high" (alto), "medium" (médio), "new" (novidade).
4. O campo `detail` DEVE ser EXTREMAMENTE rico, longo e organizado. Explique CADA UM dos itens listados em `subTopics`. Adapte sua didática ao tema:
   - Se for **Direito/Legislação**: Cite a lei seca pelo site do Planalto e jurisprudências (STF/STJ).
   - Se for **Exatas/Programação**: Traga lógicas, fórmulas estruturadas ou melhores práticas de código.
   - Se for **Linguagens/Humanas**: Traga regras gramaticais claras, contexto histórico e aplicações práticas.
   Seja sempre acadêmico, direto e focado no aprendizado real.
5. No campo `sources`, inclua pelo menos um link de busca do YouTube no formato: "https://youtube.com/results?search_query=sua+pesquisa+aqui"

Retorne APENAS o JSON válido no seguinte formato:
{{
  "nodes": [
    {{
      "id": "root", "label": "Título Principal", "type": "root", "detail": "Visão geral...", "priority": "fire", "sources": [], "subTopics": []
    }},
    {{
      "id": "branch-1", "label": "Jurisprudência (STF)", "type": "branch", "detail": "Texto longo explicando...", "priority": "high", "sources": ["https://youtube.com/..."], "subTopics": ["Súmula Vinculante 14", "Informativo 999", "Repercussão Geral Tema X"]
    }}
  ],
  "edges": [
    {{ "id": "e-root-1", "source": "root", "target": "branch-1" }}
  ]
}}

Conteúdo base da internet (use para embasar os dados):
{content}
"""

class MindMapGenerator:
    def __init__(self, claude_client):
        self.claude = claude_client

    def generate(self, topic: str, summary: str) -> dict:
        prompt = MINDMAP_PROMPT.format(topic=topic, content=summary[:30000])
        response = self.claude.complete(prompt, max_tokens=4000)

        try:
            # Tenta limpar markdown residual antes de fazer o parse
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(response)
        except Exception:
            return {
                "nodes": [{"id": "root", "label": topic, "type": "root", "detail": "Erro de IA (sem JSON)", "priority": "fire", "sources": []}],
                "edges": []
            }
