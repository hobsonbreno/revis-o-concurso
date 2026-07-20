import { TopicsService } from './topics.service';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    createTopic(title: string): Promise<import("../../schemas/topic.schema").Topic>;
    getQuiz(id: string): Promise<import("./schemas/quiz.schema").Quiz | null>;
    getTopic(id: string): Promise<import("../../schemas/topic.schema").Topic | null>;
}
