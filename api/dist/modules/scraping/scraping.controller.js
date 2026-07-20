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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingController = void 0;
const common_1 = require("@nestjs/common");
const scraping_gateway_1 = require("../../gateways/scraping/scraping.gateway");
let ScrapingController = class ScrapingController {
    scrapingGateway;
    constructor(scrapingGateway) {
        this.scrapingGateway = scrapingGateway;
    }
    async handleCallback(body) {
        const { topicId, status, userId, message } = body;
        if (userId) {
            if (status === 'done') {
                this.scrapingGateway.emitProgress(userId, 'scraping:done', { topicId, message: 'Scraping concluído com sucesso!' });
            }
            else if (status === 'progress') {
                this.scrapingGateway.emitProgress(userId, 'scraping:progress', { topicId, progress: body.progress || 50, message: message });
            }
        }
        return { success: true };
    }
};
exports.ScrapingController = ScrapingController;
__decorate([
    (0, common_1.Post)('callback'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScrapingController.prototype, "handleCallback", null);
exports.ScrapingController = ScrapingController = __decorate([
    (0, common_1.Controller)('scraping'),
    __metadata("design:paramtypes", [scraping_gateway_1.ScrapingGateway])
], ScrapingController);
//# sourceMappingURL=scraping.controller.js.map