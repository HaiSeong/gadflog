import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { updateDiscussion } from '@/api/collection';
import { useForm } from 'react-hook-form';
import { DiscussionType, DiscussionResponse } from '@/types';

interface EditDiscussionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    discussion: DiscussionResponse;
    onSuccess: (discussion: DiscussionResponse) => void;
}

interface FormValues {
    title: string;
    content: string;
    type: DiscussionType;
}

const EditDiscussionDialog: React.FC<EditDiscussionDialogProps> = ({
    isOpen,
    onOpenChange,
    discussion,
    onSuccess,
}) => {
    const { register, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            title: discussion.title,
            content: discussion.content,
            type: discussion.type,
        }
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const updatedDiscussion = await updateDiscussion(discussion.id, {
                title: data.title,
                content: data.content,
                type: data.type,
            });
            
            onOpenChange(false);
            onSuccess(updatedDiscussion);
        } catch (error) {
            console.error('디스커션 수정 실패:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>디스커션 수정</DialogTitle>
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
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                취소
                            </Button>
                            <Button type="submit">
                                저장
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditDiscussionDialog; 