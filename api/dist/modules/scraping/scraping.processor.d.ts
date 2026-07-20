import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { HttpService } from '@nestjs/axios';
import { ScrapingGateway } from '../../gateways/scraping/scraping.gateway';
import { ConfigService } from '@nestjs/config';
export declare class ScrapingProcessor extends WorkerHost {
    private readonly scrapingGateway;
    private readonly httpService;
    private readonly configService;
    constructor(scrapingGateway: ScrapingGateway, httpService: HttpService, configService: ConfigService);
    process(job: Job<any, any, string>): Promise<any>;
}
