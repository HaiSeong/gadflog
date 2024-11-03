import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {ContentTextarea} from "@/components/discussions/form/ContentTextarea";
import {TitleInput} from "@/components/discussions/form/TitleInput";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RelationType} from "@/types";

interface AddRelationDialogProps {
    isOpen: boolean;
    title: string;
    content: string;
    type: RelationType;
    isLoading: boolean;
    onClose: () => void;
    onChangeTitle: (value: string) => void;
    onChangeContent: (value: string) => void;
    onChangeType: (value: RelationType) => void;
    onSubmit: () => void;
}

export function AddRelationDialog({
                                      isOpen,
                                      title,
                                      content,
                                      type,
                                      isLoading,
                                      onClose,
                                      onChangeTitle,
                                      onChangeContent,
                                      onChangeType,
                                      onSubmit
                                  }: AddRelationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>새로운 디스커션 추가</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">관계 유형</label>
                        <Select
                            value={type}
                            onValueChange={(value) => onChangeType(value as RelationType)}
                        >
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="QUESTION">질문</SelectItem>
                                <SelectItem value="OPINION">의견</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                        추가
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
