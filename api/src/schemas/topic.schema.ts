import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'branch' | 'leaf';
  detail: string;
  priority: 'fire' | 'high' | 'medium' | 'low' | 'new';
  audioUrl?: string;
  sources: string[];
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface TopicVersion {
  timestamp: Date;
  summary: string;
  contentHash: string;
}

export interface DiffChange {
  type: 'added' | 'removed' | 'modified';
  section: string;
  before: string;
  after: string;
}

export interface DiffResult {
  hasChanges: boolean;
  changes: DiffChange[];
  detectedAt: Date;
}

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ enum: ['pending', 'scraping', 'processing', 'done', 'error'], default: 'pending' })
  status: string;

  @Prop({ default: 0 })
  progress: number;

  @Prop([String])
  tags: string[];

  @Prop({ type: Object })
  mindmap: MindMapData;

  @Prop([Object])
  versions: TopicVersion[];

  @Prop({ type: Object })
  diff: DiffResult;

  @Prop({ type: Object })
  audioUrls: Record<string, string>;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
