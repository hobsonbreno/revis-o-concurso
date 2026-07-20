import { Document } from 'mongoose';
export type ContentDocument = Content & Document;
export declare class Content {
    topicId: string;
    type: string;
    url: string;
    title: string;
    rawText: string;
    summary: string;
    keyPoints: string[];
    contentHash: string;
    relevanceScore: number;
    metadata: Record<string, any>;
}
export declare const ContentSchema: import("mongoose").Schema<Content, import("mongoose").Model<Content, any, any, any, any, any, Content>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Content, Document<unknown, {}, Content, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    topicId?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rawText?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    summary?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    keyPoints?: import("mongoose").SchemaDefinitionProperty<string[], Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    contentHash?: import("mongoose").SchemaDefinitionProperty<string, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    relevanceScore?: import("mongoose").SchemaDefinitionProperty<number, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Content, Document<unknown, {}, Content, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Content & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Content>;
