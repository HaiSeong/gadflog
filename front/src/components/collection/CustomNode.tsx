import React, { useState } from 'react';
import {Handle, Position} from 'reactflow';
import {Card, CardContent} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type {CustomNodeData} from '@/types';
import {Button} from '@/components/ui/button';
import {PlusCircle} from 'lucide-react';

interface NodeProps {
    data: CustomNodeData;
    onAddChild?: () => void;
}

const CustomNode: React.FC<NodeProps> = React.memo(({data, onAddChild}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {title = '', isCurrent = false, type} = data;
    const typeLabel = type === 'QUESTION' ? '질문' : type === 'OPINION' ? '의견' : '';
    
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon"
                            className="absolute -bottom-3 left-[50%] translate-x-[-50%] w-4 h-6 rounded-full bg-purple-50 hover:bg-purple-100 hover:border-purple-600 transition-all duration-200 border-2 border-purple-600"
                        >
                            <span className="text-lg text-purple-500 hover:text-purple-600">+</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>새로운 노드 추가</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {/* 노드 생성 폼 컴포넌트를 넣으세요 */}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
