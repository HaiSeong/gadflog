import {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {addEdge, Background, Connection, Edge, MarkerType, Node, ReactFlowInstance, Viewport,} from 'reactflow';
import {useEdgesState, useNodesState} from '@reactflow/core';
import {CustomNodeData, DiscussionResponse} from '@/types';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

// 상수 설정
const VERTICAL_SPACING = 160;
const HORIZONTAL_SPACING = 160;
const SIBLING_SPACING = 200;
const FAR_DISTANCE = 1000;

// 노드 타입 정의
const nodeTypes = {
    custom: CustomNode
};

// 엣지 생성 헬퍼 함수
const createEdge = (source: number, target: number): Edge => ({
    id: `e${source}-${target}`,
    source: source.toString(),
    target: target.toString(),
    type: 'default',
    animated: true,
    style: {
        stroke: '#78716c',
        strokeWidth: 2,
        transition: 'all 0.5s ease-in-out'
    },
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#78716c'
    },
});

// 노드 스타일
const nodeStyle = {
    transition: 'all 0.5s ease-in-out',
};

interface FlowProps {
    collectionId: number;
    discussions?: DiscussionResponse[];
    relations?: Array<{source: number; target: number}>; 
    rootDiscussionId: number;
    currentNodeId: number;
    onNodeClick: (nodeId: number) => void;
    readonly?: boolean;
    onDiscussionAdded?: (discussion: DiscussionResponse) => void;
}

const Flow = ({
    collectionId,
    discussions,
    relations = [],  // 기본값 빈 배열로 설정
    rootDiscussionId,
    currentNodeId,
    onNodeClick,
    readonly = false,
    onDiscussionAdded,
}: FlowProps) => {

    // nodes 초기화 시 rootDiscussionId를 기준으로 트리 구조 생성
    const initialNodes: Node<CustomNodeData>[] = discussions?.map((discussion) => {
        return {
            id: discussion.id.toString(),
            type: 'custom', 
            position: { x: 0, y: 0 },
            data: {
                id: discussion.id,
                title: discussion.title,
                content: discussion.content,
                isCurrent: discussion.id === currentNodeId,
                type: discussion.type,
                collectionId: collectionId
            },
            style: nodeStyle,
        };
    }) ?? [];

    // relations이 없는 경우 rootDiscussionId를 기준으로 기본 edge 생성
    const initialEdges: Edge[] = relations.length > 0 
        ? relations.map((relation) => createEdge(relation.source, relation.target))
        : [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [viewport, setViewport] = useState<Viewport>({x: 0, y: 0, zoom: 1});
    const flowRef = useRef<HTMLDivElement>(null);
    const flowInstance = useRef<ReactFlowInstance | null>(null);

    // 엣지 스타일 설정
    const defaultEdgeOptions = {
        type: 'smoothstep',
        animated: true,
        style: {
            stroke: '#78716c',
            strokeWidth: 2,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#78716c'
        },
    };

    console.log(nodes);
    // 화면 중앙 계산 함수
    const getCenter = useCallback(() => {
        if (!flowRef.current) return {x: 0, y: 0};
        const width = flowRef.current.offsetWidth;
        const height = flowRef.current.offsetHeight;
        return {
            x: width / 2,
            y: height / 2
        };
    }, []);
    
    const findDescendants = (startNodeId: Array<string>, edges: Edge[]): string[] => {
        const descendants: string[] = [];
        const visited = new Set<string>();
        const queue: string[] = [];
        queue.push(...startNodeId);

        while (queue.length > 0) {
            const currentId = queue.shift()!;

            if (visited.has(currentId)) continue;

            visited.add(currentId);
            descendants.push(currentId);

            // 자식 노드들 찾아서 큐에 추가
            const children: string[] = edges
                .filter(e => e.source === currentId)
                .map(e => e.target);

            queue.push(...children);
        }

        return descendants;
    };

    // 노드 클릭 핸들러
    const handleNodeClick = useCallback((event: React.MouseEvent, clickedNode: Node) => {
        onNodeClick(parseInt(clickedNode.id));
        const center = getCenter();

        // 모든 노드의 current 상태를 업데이트하고 위치 계산
        const updatedNodes = nodes.map(node => {
    const isCurrent = node.id === clickedNode.id;
    return {
        ...node,
        data: {
            ...node.data,
            isCurrent,
            onAddNode: (newDiscussion: DiscussionResponse) => {
                const newNode: Node<CustomNodeData> = {
                    id: newDiscussion.id.toString(),
                    type: 'custom',
                    position: { x: center.x - 75, y: center.y + VERTICAL_SPACING },
                    data: {
                        id: newDiscussion.id,
                        title: newDiscussion.title,
                        content: newDiscussion.content,
                        isCurrent: false,
                        type: newDiscussion.type,
                        collectionId: collectionId
                    },
                    style: nodeStyle,
                };

                setNodes(prev => [...prev, newNode]);
                setEdges(prev => [...prev, createEdge(parseInt(clickedNode.id), newDiscussion.id)]);

                if (onDiscussionAdded) {
                    onDiscussionAdded(newDiscussion);
                }

                // 레이아웃 재조정을 위해 현재 노드 다시 클릭
                setTimeout(() => {
                    handleNodeClick({} as React.MouseEvent, clickedNode);
                }, 100);
            }
        },
        style: {
            ...nodeStyle,
            zIndex: isCurrent ? 1000 : 1,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }
            };
        });

        // 한 번에 모든 노드 위치 업데이트
        setNodes(nodes => {
            const edges = flowInstance.current?.getEdges() || [];

            // 직접 연결된 노드들 찾기
            const outgoers = edges.filter(e => e.source === clickedNode.id).map(e => e.target);
            const incomers = edges.filter(e => e.target === clickedNode.id).map(e => e.source);

            // 부모의 부모 찾기 (할아버지)
            const grandParents = edges
                .filter(e => incomers.includes(e.target))
                .map(e => e.source);

            // 할아버지의 다른 자식들 찾기 (삼촌)
            const parentSiblings = edges
                .filter(e => grandParents.includes(e.source) && !incomers.includes(e.target))
                .map(e => e.target);
            const elderParentSiblings = parentSiblings.slice(0, Math.floor(parentSiblings.length / 2));
            const youngerParentSiblings = parentSiblings.slice(Math.floor(parentSiblings.length / 2));

            // 형제 노드들 찾기
            const siblings = edges
                .filter(e => incomers.includes(e.source) && e.target !== clickedNode.id)
                .map(e => e.target);

            // 왼쪽/오른쪽 형제 구분
            const leftSiblings = siblings.slice(0, Math.floor(siblings.length / 2));
            const rightSiblings = siblings.slice(Math.floor(siblings.length / 2));

            // 형제들의 자식과 자손들 찾기
            const leftSiblingsChildren = findDescendants(leftSiblings, edges);
            const rightSiblingsChildren = findDescendants(rightSiblings, edges);

            // 자식의 자식들 찾기
            const grandChildren = edges
                .filter(e => outgoers.includes(e.source))
                .map(e => e.target);

            // 자식의 모든 자손 찾기 (BFS)
            const descendants = findDescendants([clickedNode.id], edges);

            // 큰삼촌/작은삼촌의 자식들 찾기
            const elderParentSiblingsChildren = edges
                .filter(e => elderParentSiblings.includes(e.source))
                .map(e => e.target);
            const youngerParentSiblingsChildren = edges
                .filter(e => youngerParentSiblings.includes(e.source))
                .map(e => e.target);

            return updatedNodes.map(node => {
                let position = {...node.position};

                if (node.id === clickedNode.id) {
                    // 현재 노드는 중앙에
                    position = {
                        x: center.x - 75,
                        y: center.y - 40
                    };
                } else if (outgoers.includes(node.id)) {
                    // 자식 노드들은 아래로
                    const index = outgoers.indexOf(node.id);
                    const offset = (index - (outgoers.length - 1) / 2) * HORIZONTAL_SPACING;
                    position = {
                        x: center.x - 75 + offset,
                        y: center.y + VERTICAL_SPACING
                    };
                } else if (incomers.includes(node.id)) {
                    // 부모 노드들은 위로
                    const index = incomers.indexOf(node.id);
                    const offset = (index - (incomers.length - 1) / 2) * HORIZONTAL_SPACING;
                    position = {
                        x: center.x - 75 + offset,
                        y: center.y - VERTICAL_SPACING - 80
                    };
                } else if (grandParents.includes(node.id)) {
                    // 할아버지 노드들은 더 위로
                    const index = grandParents.indexOf(node.id);
                    position = {
                        x: center.x - 75 + (index - (grandParents.length - 1) / 2) * HORIZONTAL_SPACING,
                        y: center.y - (VERTICAL_SPACING * 2) - 160
                    };
                } else if (leftSiblings.includes(node.id)) {
                    // 왼쪽 형제들
                    const index = leftSiblings.indexOf(node.id);
                    position = {
                        x: center.x - 75 - SIBLING_SPACING - ((index) * HORIZONTAL_SPACING),
                        y: center.y - 80
                    };
                } else if (rightSiblings.includes(node.id)) {
                    // 오른쪽 형제들
                    const index = rightSiblings.indexOf(node.id);
                    position = {
                        x: center.x - 75 + SIBLING_SPACING + ((index) * HORIZONTAL_SPACING),
                        y: center.y - 80
                    };
                } else if (leftSiblingsChildren.includes(node.id)) {
                    // 왼쪽 형제의 자식들은 왼쪽으로
                    const index = leftSiblingsChildren.indexOf(node.id);
                    position = {
                        x: center.x - FAR_DISTANCE - SIBLING_SPACING - (index * HORIZONTAL_SPACING),
                        y: center.y + VERTICAL_SPACING
                    };
                } else if (rightSiblingsChildren.includes(node.id)) {
                    // 오른쪽 형제의 자식들은 오른쪽으로
                    const index = rightSiblingsChildren.indexOf(node.id);
                    position = {
                        x: center.x + FAR_DISTANCE + SIBLING_SPACING + (index * HORIZONTAL_SPACING),
                        y: center.y + VERTICAL_SPACING
                    };
                } else if (descendants.includes(node.id)) {
                    // 자손 노드들은 계층 깊이로 아래로
                    const index = descendants.indexOf(node.id);
                    position = {
                        x: center.x - 75,
                        y: center.y + FAR_DISTANCE,
                    };
                } else if (elderParentSiblings.includes(node.id)) {
                    // 큰삼촌들은 왼쪽 끝으로
                    const index = elderParentSiblings.indexOf(node.id);
                    position = {
                        x: center.x - FAR_DISTANCE - ((index + 1) * HORIZONTAL_SPACING),
                        y: center.y - VERTICAL_SPACING - 80
                    };
                } else if (youngerParentSiblings.includes(node.id)) {
                    // 작은삼촌들은 오른쪽 끝으로
                    const index = youngerParentSiblings.indexOf(node.id);
                    position = {
                        x: center.x + FAR_DISTANCE + ((index + 1) * HORIZONTAL_SPACING),
                        y: center.y - VERTICAL_SPACING - 80
                    };
                } else if (elderParentSiblingsChildren.includes(node.id)) {
                    // 큰삼촌의 자식들은 왼쪽 끝으로
                    const index = elderParentSiblingsChildren.indexOf(node.id);
                    position = {
                        x: center.x - FAR_DISTANCE - ((index + 1) * HORIZONTAL_SPACING),
                        y: center.y // 부모 삼촌보다 아래에 위치
                    };
                } else if (youngerParentSiblingsChildren.includes(node.id)) {
                    // 작은삼촌의 자식들은 오른쪽 끝으로
                    const index = youngerParentSiblingsChildren.indexOf(node.id);
                    position = {
                        x: center.x + FAR_DISTANCE + ((index + 1) * HORIZONTAL_SPACING),
                        y: center.y // 부모 삼촌보다 아래에 위치
                    };
                } else {
                    // 관련 없는 노드들은 오른쪽 맨 위로
                    position = {
                        x: center.x,
                        y: center.y - FAR_DISTANCE
                    };
                }

                return {
                    ...node,
                    position,
                    style: {
                        ...nodeStyle,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                };
            });
        });
    }, [nodes, getCenter, setNodes, setEdges, onNodeClick, onDiscussionAdded]);

    // useEffect로 currentNodeId 변경 감지
    useEffect(() => {
        const updatedNodes = nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                isCurrent: parseInt(node.id) === currentNodeId
            }
        }));
        setNodes(updatedNodes);
    }, [currentNodeId, setNodes]);

    // ReactFlow 초기화 핸들러
    const onInit = useCallback((instance: ReactFlowInstance) => {
        flowInstance.current = instance;

        // 초기 렌더링 시 current 노드 찾아서 중앙에 배치
        const currentNode = nodes.find(node => node.data.isCurrent);
        if (currentNode) {
            handleNodeClick({} as React.MouseEvent, currentNode);
        }
    }, [nodes, handleNodeClick]);

    // 연결 핸들러
    const handleConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target || readonly) return;

            const edge = {
                ...params,
                ...defaultEdgeOptions,
                id: `e${params.source}-${params.target}`,
            };

            setEdges(prev => addEdge(edge, prev));
        },
        [setEdges, readonly]
    );

    useEffect(() => {
        const handleResize = () => {
            const currentNode = nodes.find(node => node.data.isCurrent);
            if (currentNode) {
                handleNodeClick({} as React.MouseEvent, currentNode);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [nodes, handleNodeClick]);

    return (
        <div ref={flowRef} style={{width: '100%', height: '600px'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onNodeClick={handleNodeClick}
                onInit={onInit}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView={false}
                minZoom={1}
                maxZoom={1}
                defaultViewport={viewport}
                attributionPosition="bottom-right"
                nodesDraggable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                panOnDrag={false}
                style={{background: '#ffffff'}}
            >
                <Background/>
            </ReactFlow>
        </div>
    );
};

export default Flow;