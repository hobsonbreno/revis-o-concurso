import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topic, TopicSchema } from '../../schemas/topic.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Quiz.name, schema: QuizSchema }
    ]),
    BullModule.registerQueue({
      name: 'scraping',
    }),
  ],
  providers: [TopicsService],
  controllers: [TopicsController]
})
export class TopicsModule {}
