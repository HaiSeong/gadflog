'use client'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

interface DiscussionEditDialogProps {
    isOpen: boolean;
    content: string;
    isLoading: boolean;
    onClose: () => void;
    onChange: (content: string) => void;
    onSubmit: () => void;
}

export const DiscussionEditDialog: React.FC<DiscussionEditDialogProps> = (
    {isOpen, content, isLoading, onClose, onChange, onSubmit}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>질문 수정하기</DialogTitle>
                    <DialogDescription>
                        아래 입력창에서 질문 내용을 수정할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder="궁금한 내용을 적어보아요."
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading || !content.trim()}
                    >
                        수정하기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
