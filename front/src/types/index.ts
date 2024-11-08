
export type DiscussionType = 'QUESTION' | 'OPINION';

export interface Discussion {
    id: number;
    title: string;
    content: string;
    type: DiscussionType;
    createdAt: string;
    updatedAt: string;
}

export interface Relation {
    id: number;
    sourceId: number;
    targetId: number;
    createdAt: string;
}

export interface Collection {
    id: number;
    title: string;
    rootDiscussionId: number;
    discussions: Discussion[];
    relations: Relation[];
    createdAt: string;
    updatedAt: string;
}

export interface CustomNodeData {
    id: number;
    title: string;
    content: string;
    isCurrent: boolean;
    type: DiscussionType;
}