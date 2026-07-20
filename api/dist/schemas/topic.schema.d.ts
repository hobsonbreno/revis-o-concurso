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
export declare class Topic {
    title: string;
    userId: string;
    status: string;
    progress: number;
    tags: string[];
    mindmap: MindMapData;
    versions: TopicVersion[];
    diff: DiffResult;
    audioUrls: Record<string, string>;
}
export declare const TopicSchema: import("mongoose").Schema<Topic, import("mongoose").Model<Topic, any, any, any, any, any, Topic>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Topic, Document<unknown, {}, Topic, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<string, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    progress?: import("mongoose").SchemaDefinitionProperty<number, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mindmap?: import("mongoose").SchemaDefinitionProperty<MindMapData, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    versions?: import("mongoose").SchemaDefinitionProperty<TopicVersion[], Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    diff?: import("mongoose").SchemaDefinitionProperty<DiffResult, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    audioUrls?: import("mongoose").SchemaDefinitionProperty<Record<string, string>, Topic, Document<unknown, {}, Topic, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Topic & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Topic>;
