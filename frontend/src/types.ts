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
