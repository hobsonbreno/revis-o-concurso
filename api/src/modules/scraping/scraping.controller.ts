import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ScrapingGateway } from '../../gateways/scraping/scraping.gateway';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingGateway: ScrapingGateway) {}

  @Post('callback')
  @HttpCode(200)
  async handleCallback(@Body() body: any) {
    const { topicId, status, userId, message } = body;
    
    if (userId) {
      if (status === 'done') {
        this.scrapingGateway.emitProgress(userId, 'scraping:done', { topicId, message: 'Scraping concluído com sucesso!' });
      } else if (status === 'progress') {
        this.scrapingGateway.emitProgress(userId, 'scraping:progress', { topicId, progress: body.progress || 50, message: message });
      }
    }
    
    return { success: true };
  }
}
