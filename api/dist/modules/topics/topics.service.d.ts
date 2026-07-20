import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { Topic, TopicDocument } from '../../schemas/topic.schema';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
export declare class TopicsService {
    private topicModel;
    private quizModel;
    private scrapingQueue;
    constructor(topicModel: Model<TopicDocument>, quizModel: Model<QuizDocument>, scrapingQueue: Queue);
    createTopic(userId: string, title: string): Promise<Topic>;
    getQuizByTopicId(topicId: string): Promise<Quiz | null>;
    getTopicById(id: string): Promise<Topic | null>;
}
