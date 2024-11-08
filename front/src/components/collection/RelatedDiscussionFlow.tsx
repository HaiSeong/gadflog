import {useEffect, useMemo, useState} from 'react';
import {Connection, Edge, MarkerType, Node} from 'reactflow';
import Flow from './Flow';
import type {CustomNodeData, Discussion, Relation} from '@/types';
import { fetchCollectionDiscussions } from '@/api/collection';

const CENTER_X = 250;
const CENTER_Y = 50;
const VERTICAL_SPACING = 150;
const HORIZONTAL_SPACING = 200;

interface CollectionResponse {
    discussions: Discussion[];
    relations: Relation[];
    rootId: number;
}

interface RelatedDiscussionFlowProps {
    currentDiscussion: Discussion;
    onAddRelation?: (parentId: string) => void;
    readonly?: boolean;
}

// BFS로 노드의 rank를 계산하는 함수
const calculateRanks = (
    relations: Relation[],
    rootId: number,
): Map<string, number> => {
    const ranks = new Map<string, number>();
    const queue: string[] = [];
    const visited = new Set<string>();
    const rootIdStr = rootId.toString();

    // root 노드의 rank를 0으로 설정
    ranks.set(rootIdStr, 0);
    queue.push(rootIdStr);
    visited.add(rootIdStr);

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const currentRank = ranks.get(currentId)!;

        // 현재 노드의 자식 노드들 찾기
        const childIds = relations
            .filter(relation => relation.sourceId.toString() === currentId)
            .map(relation => relation.targetId.toString());

        // 각 자식 노드의 rank 설정 및 큐에 추가
        for (const childId of childIds) {
            if (!visited.has(childId)) {
                ranks.set(childId, currentRank + 1);
                queue.push(childId);
                visited.add(childId);
            }
        }
    }

    return ranks;
};

// 노드 스타일
const nodeStyle = {
    transition: 'all 0.5s ease-in-out',
};

// 노드 변환 함수
const transformToFlowNodes = (
    discussions: Discussion[],
    relations: Relation[],
    currentId: string,
    ranks: Map<string, number>,
): { nodes: Node<CustomNodeData>[]; edges: Edge[] } => {
    const nodes: Node<CustomNodeData>[] = [];
    const edges: Edge[] = [];

    // 각 노드의 x 좌표를 저장할 맵 (rank별로 몇 번째 노드인지)
    const rankCounts = new Map<number, number>();

    // rank별로 노드 정렬
    const nodesByRank = new Map<number, string[]>();
    ranks.forEach((rank, id) => {
        const existingNodes = nodesByRank.get(rank) || [];
        existingNodes.push(id);
        nodesByRank.set(rank, existingNodes);
        rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1);
    });

    // 노드 생성
    discussions.forEach(discussion => {
        const id = discussion.id.toString();
        const rank = ranks.get(id) || 0;
        const nodesInRank = rankCounts.get(rank) || 1;
        const index = nodesByRank.get(rank)?.indexOf(id) || 0;

        nodes.push({
            id,
            type: 'custom',
            // x 좌표: 같은 rank의 노드들을 균등하게 분포
            position: {
                x: CENTER_X + (index - (nodesInRank - 1) / 2) * HORIZONTAL_SPACING,
                y: CENTER_Y + (rank * VERTICAL_SPACING)
            },
            data: {
                id,
                title: discussion.title,
                content: discussion.content,
                isCurrent: id === currentId,
            },
            style: nodeStyle,
        });
    });

    // 엣지 생성
    relations.forEach(relation => {
        edges.push({
            id: `e${relation.sourceId}-${relation.targetId}`,
            source: relation.sourceId.toString(),
            target: relation.targetId.toString(),
            animated: true,
            style: {stroke: '#78716c', strokeWidth: 3},
            markerEnd: {type: MarkerType.ArrowClosed},
        });
    });

    return {nodes, edges};
};

const RelatedDiscussionFlow = ({
                                   currentDiscussion,
                                   onAddRelation,
                                   readonly = false,
                               }: RelatedDiscussionFlowProps) => {
    const [collectionData, setCollectionData] = useState<CollectionResponse | null>(null);

    const {nodes, edges} = useMemo(() => {
        if (!collectionData) return {nodes: [], edges: []};

        const ranks = calculateRanks(
            collectionData.relations,
            currentDiscussion.id
        );

        return transformToFlowNodes(
            collectionData.discussions,
            collectionData.relations,
            currentDiscussion.id.toString(),
            ranks
        );
    }, [collectionData, currentDiscussion.id]);

    const handleConnect = (connection: Connection) => {
        if (readonly || !onAddRelation || !connection.source) return;
        onAddRelation(connection.source);
    };

    if (!collectionData) {
        return <div>Loading...</div>;
    }

    return (
        <Flow
            initialNodes={nodes}
            initialEdges={edges}
            onConnect={handleConnect}
            readonly={readonly}
        />
    );
};

export default RelatedDiscussionFlow;
