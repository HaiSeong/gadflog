'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ConnectionMode, Edge, Node, ReactFlow, useReactFlow} from '@xyflow/react';
import {useRouter} from 'next/navigation';
import {AddRelationDialog} from "@/components/discussions/dialog/AddRelationDialog";
import {Relation, RelationType} from "@/types";
import {RelatedDiscussionsFlowProps} from './types';
import {debounce, getEdgeStyle} from './utils';
import {nodeTypes} from './CustomNode';
import {createDiscussion, getDiscussionById, getDiscussionRelations} from "@/api/discussions";

const Flow = ({currentDiscussion}: RelatedDiscussionsFlowProps) => {
    const router = useRouter();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const {fitView} = useReactFlow();
    const containerRef = useRef<HTMLDivElement>(null);

    // Dialog related states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogType, setDialogType] = useState<RelationType>('QUESTION');
    const [selectedParentId, setSelectedParentId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleAddRelation = (parentId: string) => {
        setSelectedParentId(parentId);
        setDialogType('QUESTION');
        setDialogTitle('');
        setDialogContent('');
        setIsDialogOpen(true);
    };

    const handleSubmitNewRelation = async () => {
        try {
            setIsLoading(true);
            const newDiscussion = await createDiscussion({
                title: dialogTitle,
                content: dialogContent,
                parentId: selectedParentId,
                type: dialogType,
            });

            // Close dialog and reset states
            setIsDialogOpen(false);
            setDialogTitle('');
            setDialogContent('');
            setSelectedParentId('');

            // Reload the graph
            await calculateLayout();

            // Navigate to the new discussion
            router.push(`/discussions/${newDiscussion.id}`);

        } catch (error) {
            console.error('Error creating discussion:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateLayout = useCallback(async () => {
        try {
            const relationships = await getDiscussionRelations(currentDiscussion.id);
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
                        id: currentDiscussion.id.toString(),
                        onAddRelation: handleAddRelation,
                    },
                    type: 'custom',
                }
            ];

            // Process parents (above current node)
            const parentIds = relationships.parents.map(r => r.sourceId);
            const parentDiscussions = await Promise.all(
                parentIds.map(id => getDiscussionById(id))
            );

            if (parentDiscussions.length > 0) {
                const startX = -(HORIZONTAL_SPACING * (parentDiscussions.length - 1)) / 2;
                parentDiscussions.forEach((discussion, index) => {
                    if (!discussion) return; // Skip if discussion is null
                    const relation = relationships.parents[index];
                    newNodes.push({
                        id: discussion.id.toString(),
                        position: {
                            x: startX + (index * HORIZONTAL_SPACING),
                            y: -VERTICAL_SPACING
                        },
                        data: {
                            title: discussion.title,
                            content: discussion.content,
                            isCurrent: false,
                            id: discussion.id.toString(),
                            relation,
                            onAddRelation: handleAddRelation,
                        },
                        type: 'custom',
                    });
                });
            }

            // Process children (below current node)
            const childIds = relationships.children.map(r => r.targetId);
            const childDiscussions = await Promise.all(
                childIds.map(id => getDiscussionById(id))
            );

            if (childDiscussions.length > 0) {
                const startX = -(HORIZONTAL_SPACING * (childDiscussions.length - 1)) / 2;
                childDiscussions.forEach((discussion, index) => {
                    if (!discussion) return; // Skip if discussion is null
                    const relation = relationships.children[index];
                    newNodes.push({
                        id: discussion.id.toString(),
                        position: {
                            x: startX + (index * HORIZONTAL_SPACING),
                            y: VERTICAL_SPACING
                        },
                        data: {
                            title: discussion.title,
                            content: discussion.content,
                            isCurrent: false,
                            id: discussion.id.toString(),
                            relation,
                            onAddRelation: handleAddRelation,
                        },
                        type: 'custom',
                    });
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
                    sourceHandle: 'bottom',
                    targetHandle: 'top',
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
                    data: {
                        curvature: 1.3
                    }
                };
            };

            const newEdges: Edge[Relation] = [
                ...relationships.parents.map(createEdge),
                ...relationships.children.map(createEdge)
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
    }, [currentDiscussion.id, currentDiscussion.title, currentDiscussion.content, fitView]);

    useEffect(() => {
        calculateLayout();
    }, [calculateLayout]);

    useEffect(() => {
        const debouncedResize = debounce(() => {
            calculateLayout();
        }, 250);

        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    }, [calculateLayout]);

    return (
        <>
            <div ref={containerRef} className="h-[500px] border border-gray-200 rounded-lg bg-gray-50">
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
            <AddRelationDialog
                isOpen={isDialogOpen}
                title={dialogTitle}
                content={dialogContent}
                type={dialogType}
                isLoading={isLoading}
                onClose={() => {
                    setIsDialogOpen(false);
                    setDialogTitle('');
                    setDialogContent('');
                    setSelectedParentId('');
                }}
                onChangeTitle={setDialogTitle}
                onChangeContent={setDialogContent}
                onChangeType={setDialogType}
                onSubmit={handleSubmitNewRelation}
            />
        </>
    );
};

export default Flow;
