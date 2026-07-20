import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

export class QuizOption {
  letter: string;
  text: string;
}

export class QuizQuestion {
  id: string;
  statement: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
  bancaStyle: string;
  difficulty: string;
  topic: string;
}

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true })
  topicId: mongoose.Types.ObjectId | string;

  @Prop({ type: Array, required: true })
  questions: QuizQuestion[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
