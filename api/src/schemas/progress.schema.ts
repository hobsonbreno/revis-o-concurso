import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, ref: 'Topic' })
  topicId: string;

  @Prop({ required: true })
  topicTitle: string;

  @Prop({ default: 0 })
  studyMinutes: number;

  @Prop({ default: 0 })
  quizAttempts: number;

  @Prop({ default: 0 })
  quizCorrect: number;

  @Prop({ type: Date })
  lastStudied: Date;

  @Prop({ default: 0, min: 0, max: 1 })
  masteryLevel: number;

  @Prop({ type: Date })
  nextReviewDate: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
