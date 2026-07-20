#!/bin/bash

echo "🛑 Parando os serviços do Sistema Inteligente de Estudos..."

# Verifica qual comando docker compose está disponível
if docker compose version > /dev/null 2>&1; then
    DOCKER_CMD="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
    DOCKER_CMD="docker-compose"
else
    echo "❌ Erro: Comando docker compose não encontrado na sua máquina."
    exit 1
fi

# Para e remove os contêineres e redes (os dados dos volumes são preservados)
$DOCKER_CMD down

echo "✅ Serviços parados com sucesso."
