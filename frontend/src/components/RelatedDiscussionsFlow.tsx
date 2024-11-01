'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ConnectionMode, Edge, Handle, Node, ReactFlow, ReactFlowProvider, useReactFlow,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Discussion, Relation} from '@/types';
import {useRouter} from 'next/navigation';

interface RelatedDiscussionsFlowProps {
    currentDiscussion: Discussion;
}

const CustomNode = ({data}: { data: { title: string; isCurrent: boolean; content?: string; id: string } }) => {
    const router = useRouter();
    const nodeRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(200);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (nodeRef.current) {
            const textWidth = nodeRef.current.querySelector('p')?.scrollWidth || 0;
            const newWidth = Math.max(200, textWidth + 32);
            setWidth(newWidth);
        }
    }, [data.title]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/discussions/${data.id}`);
    };

    const containerWidth = width;
    const expandedWidth = width * 1.1;
    const offset = (expandedWidth - containerWidth) / 2;

    return (
        <div className="relative" style={{width: containerWidth}}>
            <Handle
                type="target"
                position="top"
                style={{
                    background: '#555',
                    width: 8,
                    height: 8,
                }}
            />
            <div
                ref={nodeRef}
                onClick={handleClick}
                style={{
                    width: isHovered ? expandedWidth : containerWidth,
                    marginLeft: isHovered ? -offset : 0,
                    transition: 'all 0.3s ease',
                    pointerEvents: 'all',
                    transform: isHovered ? 'scaleY(1.1)' : 'none',
                    transformOrigin: 'top',
                    position: 'relative',
                }}
                className={`px-4 py-3 bg-white rounded-lg shadow-sm 
                    ${data.isCurrent ? 'border-2 border-black shadow-md' : 'border border-gray-200'}
                    ${isHovered ? 'shadow-lg' : ''}
                    cursor-pointer
                    hover:bg-gray-50
                    origin-top`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <p className="text-m font-medium text-gray-900">
                    {data.title}
                </p>
                {isHovered && data.content && (
                    <div className="mt-2 text-sm text-gray-600 max-w-xs transition-all duration-300">
                        {data.content}
                    </div>
                )}
            </div>
            <Handle
                type="source"
                position="bottom"
                style={{
                    background: '#555',
                    width: 8,
                    height: 8,
                }}
            />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const getEdgeStyle = (type: string) => {
    const baseStyle = {
        strokeWidth: 3,
    };

    switch (type) {
        case 'SOLUTION':
            return {
                ...baseStyle,
                stroke: '#10B981',
            };
        case 'DUPLICATE':
            return {
                ...baseStyle,
                stroke: '#EF4444',
            };
        default:
            return {
                ...baseStyle,
                stroke: '#6B7280',
            };
    }
};

const Flow = ({currentDiscussion}: RelatedDiscussionsFlowProps) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const {fitView} = useReactFlow();
    const containerRef = useRef<HTMLDivElement>(null);

    // Add custom styles to ReactFlow container
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .react-flow__pane {
                pointer-events: none !important;
            }
            .react-flow__node {
                pointer-events: all !important;
            }
            .react-flow__handle {
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const calculateLayout = useCallback(async () => {
        try {
            const [sourceResponse, targetResponse] = await Promise.all([
                fetch(`${process.env.API_BASE_URL}/discussions/${currentDiscussion.id}/relations/source`),
                fetch(`${process.env.API_BASE_URL}/discussions/${currentDiscussion.id}/relations/target`)
            ]);

            if (!sourceResponse.ok || !targetResponse.ok) {
                throw new Error('Failed to fetch relations');
            }

            const sourceRelations = await sourceResponse.json();
            const targetRelations = await targetResponse.json();

            const HORIZONTAL_SPACING = 220;
            const VERTICAL_SPACING = 150;

            let newNodes: Node[] = [
                {
                    id: currentDiscussion.id.toString(),
                    position: {x: 0, y: 0},
                    data: {
                        title: currentDiscussion.title,
                        content: currentDiscussion.content,
                        isCurrent: true,
                        id: currentDiscussion.id.toString()
                    },
                    type: 'custom',
                }
            ];

            if (targetRelations.length > 0) {
                const startX = -(HORIZONTAL_SPACING * (targetRelations.length - 1)) / 2;

                const targetDiscussions = await Promise.all(
                    targetRelations.map(relation =>
                        fetch(`${process.env.API_BASE_URL}/discussions/${relation.sourceId}`).then(res => res.json())
                    )
                );

                targetRelations.forEach((relation: Relation, index: number) => {
                    const discussion = targetDiscussions[index];
                    if (discussion) {
                        newNodes.push({
                            id: relation.sourceId.toString(),
                            position: {
                                x: startX + (index * HORIZONTAL_SPACING),
                                y: -VERTICAL_SPACING
                            },
                            data: {
                                title: discussion.title,
                                content: discussion.content,
                                isCurrent: false,
                                id: relation.sourceId.toString()
                            },
                            type: 'custom',
                        });
                    }
                });
            }

            if (sourceRelations.length > 0) {
                const startX = -(HORIZONTAL_SPACING * (sourceRelations.length - 1)) / 2;

                const sourceDiscussions = await Promise.all(
                    sourceRelations.map(relation =>
                        fetch(`${process.env.API_BASE_URL}/discussions/${relation.targetId}`).then(res => res.json())
                    )
                );

                sourceRelations.forEach((relation: Relation, index: number) => {
                    const discussion = sourceDiscussions[index];
                    if (discussion) {
                        newNodes.push({
                            id: relation.targetId.toString(),
                            position: {
                                x: startX + (index * HORIZONTAL_SPACING),
                                y: VERTICAL_SPACING
                            },
                            data: {
                                title: discussion.title,
                                content: discussion.content,
                                isCurrent: false,
                                id: relation.targetId.toString()
                            },
                            type: 'custom',
                        });
                    }
                });
            }

            const createEdge = (relation: Relation) => {
                const edgeStyle = getEdgeStyle(relation.type);

                return {
                    id: `e${relation.id}`,
                    source: relation.sourceId.toString(),
                    target: relation.targetId.toString(),
                    type: 'default',
                    animated: true,
                    style: edgeStyle,
                    labelBgStyle: {
                        fill: 'white',
                        fillOpacity: 0.8
                    },
                    markerEnd: {
                        type: 'arrowclosed',
                        color: edgeStyle.stroke,
                        width: 30,
                        height: 30,
                        strokeWidth: 2,
                        markerUnits: 'userSpaceOnUse',
                        orient: 'auto-start-reverse',
                    },
                    sourceHandle: null,
                    targetHandle: null,
                    data: {
                        curvature: 1.3
                    }
                };
            };

            const newEdges: Edge[] = [
                ...sourceRelations.map(relation => createEdge(relation)),
                ...targetRelations.map(relation => createEdge(relation))
            ];

            setNodes(newNodes);
            setEdges(newEdges);

            setTimeout(() => {
                fitView({
                    padding: 0.1,
                    duration: 1000
                });
            }, 100);
        } catch (error) {
            console.error('Error calculating layout:', error);
        }
    }, [currentDiscussion.id, fitView]);

    useEffect(() => {
        calculateLayout();
    }, [calculateLayout]);

    useEffect(() => {
        const debouncedResize = debounce(() => {
            calculateLayout();
        }, 250);

        window.addEventListener('resize', debouncedResize);

        return () => {
            window.addEventListener('resize', debouncedResize);
        };
    }, [calculateLayout]);

    return (
        <div ref={containerRef} className="h-[400px] border border-gray-200 rounded-lg bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                preventScrolling
                zoomOnScroll={false}
                panOnScroll={false}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                draggable={false}
                panOnDrag={false}
                selectNodesOnDrag={false}
                proOptions={{hideAttribution: true}}
                defaultViewport={{
                    x: 0,
                    y: 0,
                    zoom: 0.9
                }}
                minZoom={0.9}
                maxZoom={0.9}
                connectionMode={ConnectionMode.Strict}
                fitViewOptions={{
                    padding: 0.1,
                    includeHiddenNodes: false,
                    minZoom: 0.9,
                    maxZoom: 0.9,
                }}
            />
        </div>
    );
};

const RelatedDiscussionsFlow = (props: RelatedDiscussionsFlowProps) => {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    );
};

export default RelatedDiscussionsFlow;
