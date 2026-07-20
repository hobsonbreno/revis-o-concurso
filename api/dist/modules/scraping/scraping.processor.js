"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const axios_1 = require("@nestjs/axios");
const scraping_gateway_1 = require("../../gateways/scraping/scraping.gateway");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
let ScrapingProcessor = class ScrapingProcessor extends bullmq_1.WorkerHost {
    scrapingGateway;
    httpService;
    configService;
    constructor(scrapingGateway, httpService, configService) {
        super();
        this.scrapingGateway = scrapingGateway;
        this.httpService = httpService;
        this.configService = configService;
    }
    async process(job) {
        if (job.name === 'scrape-topic') {
            const { topicId, title, userId } = job.data;
            this.scrapingGateway.emitProgress(userId, 'scraping:start', { topicId, title });
            const pythonWorkerUrl = this.configService.get('PYTHON_WORKER_URL') || 'http://workers:8800';
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${pythonWorkerUrl}/scrape`, { topicId, title, userId }));
                return response.data;
            }
            catch (error) {
                this.scrapingGateway.emitProgress(userId, 'scraping:error', { topicId, title, message: error.message });
                throw error;
            }
        }
    }
};
exports.ScrapingProcessor = ScrapingProcessor;
exports.ScrapingProcessor = ScrapingProcessor = __decorate([
    (0, bullmq_1.Processor)('scraping'),
    __metadata("design:paramtypes", [scraping_gateway_1.ScrapingGateway,
        axios_1.HttpService,
        config_1.ConfigService])
], ScrapingProcessor);
//# sourceMappingURL=scraping.processor.js.map