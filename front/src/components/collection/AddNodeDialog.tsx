import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { createDiscussion } from '@/api/collection';
import { useForm } from 'react-hook-form';
import { DiscussionType } from '@/types';

interface AddNodeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    collectionId: number;
    parentId: number;
    onSuccess: (discussion: DiscussionResponse) => void;
}

interface FormValues {
    title: string;
    content: string;
    type: DiscussionType;
}

const AddNodeDialog: React.FC<AddNodeDialogProps> = ({
    isOpen,
    onOpenChange,
    collectionId,
    parentId,
    onSuccess,
}) => {
    const { register, handleSubmit, reset } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const newDiscussion = await createDiscussion({
                parentId,
                title: data.title,
                content: data.content,
                type: data.type,
                collectionId: collectionId,
            });
            
            onOpenChange(false);
            reset();
            onSuccess(newDiscussion);
        } catch (error) {
            console.error('노드 생성 실패:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>새로운 노드 추가</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">제목</label>
                            <input 
                                {...register('title', { required: true })}
                                type="text"
                                className="w-full p-2 border rounded"
                                maxLength={50}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">내용</label>
                            <textarea
                                {...register('content', { required: true })}
                                className="w-full p-2 border rounded min-h-[100px]"
                                maxLength={2000}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">타입</label>
                            <select 
                                {...register('type')}
                                className="w-full p-2 border rounded"
                            >
                                <option value="QUESTION">질문</option>
                                <option value="OPINION">의견</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">
                            추가하기
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNodeDialog; 