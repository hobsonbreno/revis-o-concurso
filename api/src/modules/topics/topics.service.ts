import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Topic, TopicDocument } from '../../schemas/topic.schema';
import { Quiz, QuizDocument } from './schemas/quiz.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectQueue('scraping') private scrapingQueue: Queue,
  ) {}

  async createTopic(userId: string, title: string): Promise<Topic> {
    const topic = await this.topicModel.create({
      title,
      userId,
      status: 'pending',
      progress: 0,
    });

    // Enfileira o job de scraping no BullMQ
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

  async getQuizByTopicId(topicId: string): Promise<Quiz | null> {
    return this.quizModel.findOne({ topicId }).exec();
  }

  async getTopicById(id: string): Promise<Topic | null> {
    return this.topicModel.findById(id).exec();
  }
}
