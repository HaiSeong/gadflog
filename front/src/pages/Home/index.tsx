import {type FC, useEffect, useState} from "react"
import {CollectionCard} from "@/components/collection/CollectionCard"
import {MasonryGrid} from "@/components/layout/MasonryGrid"
import {createCollection, createDiscussion, fetchCollections} from "@/api/collection"
import {CollectionResponse} from "@/types"
import {Plus} from "lucide-react"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const HomePage: FC = () => {
    const [collections, setCollections] = useState<CollectionResponse[]>([])
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [newCollectionId, setNewCollectionId] = useState<number | null>(null);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await fetchCollections()
                setCollections(data)
            } catch (error) {
                console.error('컬렉션을 불러오는데 실패했습니다:', error)
            }
        }

        loadCollections()
    }, [])

    const handleCreateCollection = async () => {
        try {
            const newCollection = await createCollection({ title });
            setShowDialog(false);
            const data = await fetchCollections();
            setCollections(data);
            setNewCollectionId(newCollection.id);
            setTimeout(() => setNewCollectionId(null), 10000); // 10초 후 깜빡임 효과 제거
        } catch (error) {
            console.error('컬렉션 생성 실패:', error);
        }
    };

    return (
        <div className="py-6 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">Collections</h1>
                <p className="text-muted-foreground">
                    Explore and contribute to question collections
                </p>
            </header>

            <MasonryGrid>
                <div className="break-inside-avoid mb-4">
                    <div 
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center min-h-[200px]"
                        onClick={() => setShowDialog(true)}
                    >
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Plus size={24} />
                            <span>새 컬렉션 만들기</span>
                        </div>
                    </div>
                </div>
                {collections
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map(collection => (
                        <div key={collection.id} className="break-inside-avoid mb-4">
                            <div className={`${newCollectionId === collection.id ? 'animate-pulse border-2 border-primary rounded-lg' : ''}`}>
                                <CollectionCard
                                    id={collection.id.toString()}
                                    title={collection.title}
                                    rootDiscussion={collection.discussions.find(d => d.id === collection.rootDiscussionId)?.id ? {
                                        ...collection.discussions.find(d => d.id === collection.rootDiscussionId)!,
                                        id: collection.discussions.find(d => d.id === collection.rootDiscussionId)!.id.toString()
                                    } : undefined}
                                    recentDiscussions={collection.discussions.map(d => ({...d, id: d.id.toString()}))}
                                />
                            </div>
                        </div>
                    ))}
            </MasonryGrid>
            {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>새 컬렉션 만들기</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="컬렉션 제목을 입력하세요"
                        />
                        <DialogFooter>
                            <Button onClick={handleCreateCollection}>생성</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default HomePage
