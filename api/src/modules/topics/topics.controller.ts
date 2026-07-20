import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  async createTopic(@Body('title') title: string) {
    // Para simplificar o MVP 1, mockamos o userId temporariamente.
    const userId = 'user-mocked-123';
    return this.topicsService.createTopic(userId, title);
  }

  @Get(':id/quiz')
  async getQuiz(@Param('id') id: string) {
    return this.topicsService.getQuizByTopicId(id);
  }

  @Get(':id')
  async getTopic(@Param('id') id: string) {
    return this.topicsService.getTopicById(id);
  }
}
