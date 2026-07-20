import mongoose, { Document } from 'mongoose';
export type QuizDocument = Quiz & Document;
export declare class QuizOption {
    letter: string;
    text: string;
}
export declare class QuizQuestion {
    id: string;
    statement: string;
    options: QuizOption[];
    correct: string;
    explanation: string;
    bancaStyle: string;
    difficulty: string;
    topic: string;
}
export declare class Quiz {
    topicId: mongoose.Types.ObjectId | string;
    questions: QuizQuestion[];
}
export declare const QuizSchema: mongoose.Schema<Quiz, mongoose.Model<Quiz, any, any, any, any, any, Quiz>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Quiz, mongoose.Document<unknown, {}, Quiz, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Quiz & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    topicId?: mongoose.SchemaDefinitionProperty<string | mongoose.Types.ObjectId, Quiz, mongoose.Document<unknown, {}, Quiz, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Quiz & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    questions?: mongoose.SchemaDefinitionProperty<QuizQuestion[], Quiz, mongoose.Document<unknown, {}, Quiz, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Quiz & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Quiz>;
