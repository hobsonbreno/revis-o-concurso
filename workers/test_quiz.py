import sys
sys.path.append("/app")

from ai.claude_client import ClaudeClient
from ai.quiz_generator import QuizGenerator

claude = ClaudeClient()
quiz_gen = QuizGenerator(claude)

print("Gerando quiz...")
res = quiz_gen.generate("Interpretação e Compreensão de Textos", "Contexto de teste para concurso.")
print(res)
