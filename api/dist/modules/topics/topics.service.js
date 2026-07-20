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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const topic_schema_1 = require("../../schemas/topic.schema");
const quiz_schema_1 = require("./schemas/quiz.schema");
let TopicsService = class TopicsService {
    topicModel;
    quizModel;
    scrapingQueue;
    constructor(topicModel, quizModel, scrapingQueue) {
        this.topicModel = topicModel;
        this.quizModel = quizModel;
        this.scrapingQueue = scrapingQueue;
    }
    async createTopic(userId, title) {
        const topic = await this.topicModel.create({
            title,
            userId,
            status: 'pending',
            progress: 0,
        });
        await this.scrapingQueue.add('scrape-topic', {
            topicId: topic._id.toString(),
            title,
            userId,
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
        });
        return topic;
    }
    async getQuizByTopicId(topicId) {
        return this.quizModel.findOne({ topicId }).exec();
    }
    async getTopicById(id) {
        return this.topicModel.findById(id).exec();
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(topic_schema_1.Topic.name)),
    __param(1, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __param(2, (0, bullmq_1.InjectQueue)('scraping')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        bullmq_2.Queue])
], TopicsService);
//# sourceMappingURL=topics.service.js.map