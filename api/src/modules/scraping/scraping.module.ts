import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ScrapingProcessor } from './scraping.processor';
import { ScrapingGateway } from '../../gateways/scraping/scraping.gateway';

@Module({
  imports: [HttpModule],
  providers: [ScrapingService, ScrapingProcessor, ScrapingGateway],
  controllers: [ScrapingController],
  exports: [ScrapingGateway],
})
export class ScrapingModule {}
