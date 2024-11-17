import React, { useState } from 'react';
import {Handle, Position} from 'reactflow';
import {Card, CardContent} from '@/components/ui/card';
import AddNodeDialog from '@/components/collection/AddNodeDialog';
import { CustomNodeData, DiscussionResponse } from '@/types';
import {Button} from '@/components/ui/button';

interface CustomNodeProps {
    data: CustomNodeData & {
        collectionId: number;
        onAddNode: (discussion: DiscussionResponse) => void;
        refreshCollection?: () => Promise<void>;
    };
    id: string;
}

const CustomNode: React.FC<CustomNodeProps> = React.memo(({ data, id }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {title = '', isCurrent = false, type, collectionId} = data;
    const typeLabel = type === 'QUESTION' ? '질문' : type === 'OPINION' ? '의견' : '';
    const handleSuccess = async (newDiscussion: DiscussionResponse) => {
        setIsDialogOpen(false);
        if (data.onAddNode) {
            data.onAddNode(newDiscussion);
            // 새로운 노드로 이동 TODO: 변경필요
            window.location.href = `/collections/${collectionId}?current=${id}`;
        }
    };

    return (
        <div className="relative">
            <Handle
                type="target"
                position={Position.Top}
                style={{background: '#555'}}
                isConnectable={false}
            />

            <Card className={`w-[150px] ${isCurrent ? 'border-2 border-purple-600 bg-purple-50' : ''}`}>
                <CardContent className="p-3">
                    <div className={`text-xs mb-1 ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>{typeLabel}</div>
                    <div className={`text-sm font-medium line-clamp-2 ${isCurrent ? 'text-purple-900' : ''}`}>{title}</div>
                </CardContent>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                style={{background: '#555'}}
                isConnectable={false}
            />
            {isCurrent && (
                <>
                    <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsDialogOpen(true)}
                        className="absolute -bottom-3 left-[50%] translate-x-[-50%] w-4 h-6 rounded-full bg-purple-50 hover:bg-purple-100 hover:border-purple-600 transition-all duration-200 border-2 border-purple-600"
                    >
                        <span className="text-lg text-purple-500 hover:text-purple-600">+</span>
                    </Button>
                    <AddNodeDialog
                        isOpen={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        collectionId={collectionId}
                        parentId={data.id}
                        onSuccess={(newDiscussion) => handleSuccess(newDiscussion)}
                    />
                </>
            )}
        </div>
    );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
