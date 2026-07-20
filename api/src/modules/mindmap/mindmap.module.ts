import { Module } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { MindmapController } from './mindmap.controller';

@Module({
  providers: [MindmapService],
  controllers: [MindmapController]
})
export class MindmapModule {}
