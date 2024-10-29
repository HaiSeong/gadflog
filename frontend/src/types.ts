export interface Discussion {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DiscussionRequest {
    content: string;
}
