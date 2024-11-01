export interface Discussion {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DiscussionRequest {
    title: string;
    content: string;
}

export type RelationType = 'RELATED' | 'DUPLICATE' | 'SOLUTION';

export interface Relation {
    id: number;
    sourceId: number;
    targetId: number;
    type: RelationType;
    createdAt: Date;
}
