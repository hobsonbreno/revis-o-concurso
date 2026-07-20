import { ScrapingGateway } from '../../gateways/scraping/scraping.gateway';
export declare class ScrapingController {
    private readonly scrapingGateway;
    constructor(scrapingGateway: ScrapingGateway);
    handleCallback(body: any): Promise<{
        success: boolean;
    }>;
}
