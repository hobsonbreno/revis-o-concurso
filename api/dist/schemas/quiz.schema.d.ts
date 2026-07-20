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
export declare class Quiz {
    topicId: string;
    questions: QuizQuestion[];
}
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, any, any, Quiz>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, Quiz, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    topicId?: import("mongoose").SchemaDefinitionProperty<string, Quiz, Document<unknown, {}, Quiz, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quiz & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    questions?: import("mongoose").SchemaDefinitionProperty<QuizQuestion[], Quiz, Document<unknown, {}, Quiz, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quiz & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Quiz>;
