from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio, re

class WebScraper:
    SEARCH_ENGINES = [
        "https://duckduckgo.com/?q={query}+concurso",
    ]

    async def search_and_scrape(self, topic: str, max_results: int = 5) -> list[dict]:
        results = []
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )

            # Busca no DuckDuckGo
            for engine_url in self.SEARCH_ENGINES:
                url = engine_url.format(query=topic.replace(' ', '+'))
                await page.goto(url, wait_until='networkidle', timeout=30000)
                
                # Extrai links de busca (simplificado para MVP 1)
                links = await page.evaluate(
                    "Array.from(document.querySelectorAll('a[data-testid=\"result-title-a\"]')).map(a => a.href)"
                )

                for link in links[:max_results]:
                    try:
                        content = await self._scrape_page(page, link)
                        if content and len(content['text']) > 200:
                            results.append(content)
                    except Exception as e:
                        print(f"Erro ao capturar {link}: {e}")
                        continue
                        
            await browser.close()
        return results

    async def _scrape_page(self, page, url: str) -> dict | None:
        await page.goto(url, wait_until='networkidle', timeout=20000)
        html = await page.content()
        soup = BeautifulSoup(html, 'html.parser')

        # Remove elementos desnecessários
        for tag in soup(['script', 'style', 'nav', 'footer', 'aside', 'iframe', 'header']):
            tag.decompose()

        title = soup.find('h1')
        title_text = title.get_text(strip=True) if title else url

        # Tenta achar a tag main/article ou pega o body
        main = soup.find('article') or soup.find('main')
        text_element = main or soup.find('body')
        text = text_element.get_text(separator='\n', strip=True) if text_element else ''

        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)

        return {
            'type': 'webpage',
            'url': url,
            'title': title_text,
            'text': text[:50000] # Limite para não explodir LLM
        }
