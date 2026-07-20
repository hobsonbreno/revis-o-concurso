import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true, ref: 'Topic' })
  topicId: string;

  @Prop({ enum: ['article', 'pdf', 'video', 'webpage'], required: true })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  rawText: string;

  @Prop({ required: true })
  summary: string;

  @Prop([String])
  keyPoints: string[];

  @Prop({ required: true })
  contentHash: string;

  @Prop({ default: 0, min: 0, max: 1 })
  relevanceScore: number;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
