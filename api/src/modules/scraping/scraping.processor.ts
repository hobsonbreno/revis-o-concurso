import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { HttpService } from '@nestjs/axios';
import { ScrapingGateway } from '../../gateways/scraping/scraping.gateway';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Processor('scraping')
export class ScrapingProcessor extends WorkerHost {
  constructor(
    private readonly scrapingGateway: ScrapingGateway,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'scrape-topic') {
      const { topicId, title, userId } = job.data;
      
      this.scrapingGateway.emitProgress(userId, 'scraping:start', { topicId, title });

      const pythonWorkerUrl = this.configService.get<string>('PYTHON_WORKER_URL') || 'http://workers:8800';

      try {
        const response = await firstValueFrom<any>(
          this.httpService.post(`${pythonWorkerUrl}/scrape`, { topicId, title, userId })
        );
        return response.data;
      } catch (error) {
        this.scrapingGateway.emitProgress(userId, 'scraping:error', { topicId, title, message: error.message });
        throw error;
      }
    }
  }
}
