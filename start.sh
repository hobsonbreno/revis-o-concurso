#!/bin/bash

echo "🚀 Iniciando os serviços do Sistema Inteligente de Estudos..."

# Verifica se o arquivo .env existe, senão cria um a partir do exemplo
if [ ! -f .env ]; then
  echo "⚠️ Arquivo .env não encontrado. Criando um a partir do .env.example..."
  cp .env.example .env
  echo "⚠️ Importante: Lembre-se de configurar suas chaves de API (Anthropic, ElevenLabs) no arquivo .env posteriormente."
fi

# Verifica qual comando docker compose está disponível
if docker compose version > /dev/null 2>&1; then
    DOCKER_CMD="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
    DOCKER_CMD="docker-compose"
else
    echo "❌ Erro: Comando docker compose não encontrado na sua máquina. Por favor, instale o Docker."
    exit 1
fi

echo "🐳 Usando o comando: $DOCKER_CMD"

# Constrói e sobe os serviços em background (modo detached)
$DOCKER_CMD up --build -d

if [ $? -ne 0 ]; then
    echo "❌ Ocorreu um erro ao tentar subir os contêineres."
    exit 1
fi

echo ""
echo "✅ Todos os serviços foram iniciados com sucesso!"
echo "----------------------------------------------------"
echo "📍 Frontend PWA (React):     http://localhost:3800"
echo "📍 Backend API (NestJS):     http://localhost:4800"
echo "📍 Python Workers (FastAPI): http://localhost:8800"
echo "📍 Admin Mongo Express:      http://localhost:8888"
echo "----------------------------------------------------"
echo "Dica: Para acompanhar os logs em tempo real, use '$DOCKER_CMD logs -f'"
