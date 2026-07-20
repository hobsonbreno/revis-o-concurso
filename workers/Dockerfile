FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Comando padrão
CMD ["celery", "-A", "celery_app", "worker", "--loglevel=info", "--concurrency=1"]
