// components/discussion/DiscussionList.tsx
import {Discussion} from '@/types';
import {Accordion} from "@/components/ui/accordion";
import {useState} from 'react';
import {deleteDiscussion, updateDiscussion} from '@/api/discussions';
import {toast} from "@/hooks/use-toast";
import {DiscussionListItem} from './DiscussionListItem';
import {DiscussionEditDialog} from './DiscussionEditDialog';

interface DiscussionListProps {
    discussions: Discussion[];
    onUpdate: () => void;
}

export const DiscussionList: React.FC<DiscussionListProps> = ({discussions, onUpdate}) => {
    const [openItem, setOpenItem] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [editDialog, setEditDialog] = useState({isOpen: false, id: '', content: ''});

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);
            await deleteDiscussion(id);
            toast({
                title: "삭제 완료",
                description: "질문이 삭제되었습니다.",
            });
            onUpdate();
        } catch (error) {
            console.error("Delete Error:", error);
            toast({
                title: "삭제 실패",
                description: (<span className="text-red-500">질문 삭제에 실패했습니다.</span>)
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editDialog.content.trim()) return;

        try {
            setIsLoading(true);
            await updateDiscussion(editDialog.id, {content: editDialog.content});
            toast({
                title: "수정 완료",
                description: "질문이 수정되었습니다.",
            });
            setEditDialog({isOpen: false, id: '', content: ''});
            onUpdate();
        } catch (error) {
            console.error("Update Error:", error);
            toast({
                title: "수정 실패",
                description: (<span className="text-red-500">질문 수정에 실패했습니다.</span>)
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-semibold mb-4">나의 질문 목록</h2>
                {discussions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">아직 작성된 질문이 없습니다.</p>
                ) : (
                    <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                        onValueChange={setOpenItem}
                    >
                        {discussions.map((discussion) => (
                            <DiscussionListItem
                                key={discussion.id}
                                discussion={discussion}
                                isLoading={isLoading}
                                isOpen={openItem === discussion.id}
                                onEdit={(id, content) => setEditDialog({isOpen: true, id, content})}
                                onDelete={handleDelete}
                            />
                        ))}
                    </Accordion>
                )}
            </div>

            <DiscussionEditDialog
                isOpen={editDialog.isOpen}
                content={editDialog.content}
                isLoading={isLoading}
                onClose={() => setEditDialog({isOpen: false, id: '', content: ''})}
                onChange={(content) => setEditDialog(prev => ({...prev, content}))}
                onSubmit={handleEdit}
            />
        </>
    );
};
