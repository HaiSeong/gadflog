import {useEffect, useMemo, useState} from 'react';
import {Connection, Edge, MarkerType, Node} from 'reactflow';
import Flow from './Flow';
import type {CustomNodeData, DiscussionResponse, RelationResponse, CollectionResponse} from '@/types';
import { fetchCollectionDiscussions } from '@/api/collection';

interface RelatedDiscussionFlowProps {
    collectionId: number;
    currentDiscussion: DiscussionResponse;
    onAddRelation?: (parentId: number) => void;
    readonly?: boolean;
}

// 노드 스타일
const nodeStyle = {
    transition: 'all 0.5s ease-in-out',
};

const RelatedDiscussionFlow = ({collectionId,currentDiscussion,readonly = false,}: RelatedDiscussionFlowProps) => {
    const [collectionData, setCollectionData] = useState<CollectionResponse | null>(null);

    useEffect(() => {
        fetchCollectionDiscussions(currentDiscussion.collectionId)
            .then(data => setCollectionData(data as CollectionResponse))
            .catch(console.error);
    }, []);

    if (!collectionData) {
        return <div>Loading...</div>;
    }

    return (
        <Flow
            collectionId={collectionId}
            discussions={collectionData.discussions}
            relations={collectionData.relations.map(r => ({
                source: r.sourceId,
                target: r.targetId
            }))}
            rootDiscussionId={currentDiscussion.id}
            currentNodeId={currentDiscussion.id}
            onNodeClick={() => {}}
            readonly={readonly}
        />
    );
};

export default RelatedDiscussionFlow;
