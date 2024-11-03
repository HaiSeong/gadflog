import {Discussion, Relation} from "@/types";

export interface RelatedDiscussionsFlowProps {
    currentDiscussion: Discussion;
    key?: string;
}

export interface DiscussionRelationships {
    parents: Relation[];
    children: Relation[];
}

export interface CustomNodeData {
    title: string;
    isCurrent: boolean;
    content?: string;
    id: string;
    relation?: Relation;
    onAddRelation?: (parentId: string) => void;
}
