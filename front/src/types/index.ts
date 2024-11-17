export type DiscussionType = 'QUESTION' | 'OPINION';

export interface DiscussionResponse {
    id: number;
    collectionId: number;
    title: string;
    content: string;
    type: DiscussionType;
    createdAt: string;
    updatedAt: string;
}

export interface DiscussionTitleResponse {
    id: number;
    title: string;
    type: 'OPINION' | 'QUESTION';
}

export interface RelationResponse {
    id: number;
    sourceId: number;
    targetId: number;
}

export interface CollectionResponse {
    id: number;
    title: string;
    rootDiscussionId: number;
    discussions: DiscussionTitleResponse[];
    relations: RelationResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface CustomNodeData {
    id: number;
    title: string;
    content: string;
    isCurrent: boolean;
    type: DiscussionType;
    collectionId: number;
}

export interface CreateDiscussionResponse extends DiscussionResponse {
    relation?: RelationResponse;
}