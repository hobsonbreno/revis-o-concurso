import { Document } from 'mongoose';
export type ProgressDocument = Progress & Document;
export declare class Progress {
    userId: string;
    topicId: string;
    topicTitle: string;
    studyMinutes: number;
    quizAttempts: number;
    quizCorrect: number;
    lastStudied: Date;
    masteryLevel: number;
    nextReviewDate: Date;
}
export declare const ProgressSchema: import("mongoose").Schema<Progress, import("mongoose").Model<Progress, any, any, any, any, any, Progress>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Progress, Document<unknown, {}, Progress, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    userId?: import("mongoose").SchemaDefinitionProperty<string, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    topicId?: import("mongoose").SchemaDefinitionProperty<string, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    topicTitle?: import("mongoose").SchemaDefinitionProperty<string, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    studyMinutes?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quizAttempts?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quizCorrect?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastStudied?: import("mongoose").SchemaDefinitionProperty<Date, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    masteryLevel?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nextReviewDate?: import("mongoose").SchemaDefinitionProperty<Date, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Progress>;
