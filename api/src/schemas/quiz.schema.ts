import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

export interface QuizOption {
  letter: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  statement: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  bancaStyle: 'FCC' | 'CEBRASPE';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true, ref: 'Topic' })
  topicId: string;

  @Prop([Object])
  questions: QuizQuestion[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
