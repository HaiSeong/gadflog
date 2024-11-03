import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {ContentTextarea} from "@/components/discussions/form/ContentTextarea";
import {TitleInput} from "@/components/discussions/form/TitleInput";

interface DiscussionEditDialogProps {
    isOpen: boolean;
    title: string;
    content: string;
    isLoading: boolean;
    onClose: () => void;
    onChangeTitle: (value: string) => void;
    onChangeContent: (value: string) => void;
    onSubmit: () => void;
}

export function EditDialog({
                               isOpen, title, content, isLoading, onClose, onChangeTitle, onChangeContent, onSubmit
                           }: DiscussionEditDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>질문 수정</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <TitleInput
                        value={title}
                        onChange={onChangeTitle}
                    />
                    <ContentTextarea
                        value={content}
                        onChange={onChangeContent}
                        minHeight={200}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        취소
                    </Button>
                    <Button onClick={onSubmit} disabled={isLoading || !title.trim() || !content.trim()}>
                        수정
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
