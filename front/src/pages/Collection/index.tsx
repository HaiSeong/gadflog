import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {CollectionResponse, DiscussionResponse, DiscussionTitleResponse} from "@/types";
import {Button} from '@/components/ui/button';
import CollectionDetailMenu from '@/components/collection/CollectionDetailMenu';
import {ArrowLeft} from "lucide-react";
import Flow from "@/components/collection/Flow.tsx";
import { fetchCollectionDiscussions, createDiscussion, fetchDiscussionDetail, deleteDiscussion } from "@/api/collection";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import EditDiscussionDialog from '@/components/collection/EditDiscussionDialog';

export default function CollectionDetail() {
    const {id} = useParams();
    const collectionId = Number(id);
    const [searchParams, setSearchParams] = useSearchParams();
    const [collection, setCollection] = useState<CollectionResponse | null>(null);
    const [currentDiscussion, setCurrentDiscussion] = useState<DiscussionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!collectionId) return;
            
            try {
                setIsLoading(true);
                const data = await fetchCollectionDiscussions(Number(collectionId));
                setCollection(data);
                
                // discussions가 비어있지 않은 경우에만 디스커션 상세 정보를 가져옴
                if (data.discussions.length > 0) {
                    const currentNodeId = searchParams.get('current');
                    const initialDiscussionId = currentNodeId 
                        ? currentNodeId
                        : data.rootDiscussionId?.toString();
                    
                    if (initialDiscussionId) {
                        const discussionDetail = await fetchDiscussionDetail(Number(initialDiscussionId));
                        setCurrentDiscussion(discussionDetail);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [collectionId]);

    // 로딩 상태 처리
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    // 에러 상태 처리
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // 데이터가 없는 경우 처리
    if (!collection) {
        return <div>컬렉션을 찾을 수 없습니다.</div>;
    }

    if (collection.discussions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="pb-4 flex justify-between items-center mb-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{collection.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <CollectionDetailMenu
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                </div>

                <div className="max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">첫 질문 만들기</h2>
                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        if (!collectionId) return;
                        
                        try {
                            const newDiscussion = await createDiscussion({
                                title,
                                content,
                                type: 'QUESTION',
                                collectionId: Number(collectionId),
                                parentId: null
                            });
                            
                            // 새로운 디스커션의 ID로 URL 파라미터 설정 후 페이지 새로고침
                            window.location.href = `/collections/${collectionId}?current=${newDiscussion.id}`;
                        } catch (error) {
                            console.error('디스커션 생성 실패:', error);
                        }
                    }}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">제목</label>
                            <Input 
                                placeholder="제목을 입력하세요"
                                className="w-full p-2 border rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={50}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">내용</label>
                            <Textarea
                                placeholder="내용을 입력하세요" 
                                className="w-full p-2 border rounded min-h-[100px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={2000}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">타입</label>
                            <select
                                className="w-full p-2 border rounded"
                                value="QUESTION"
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
            </div>
        );
    }

    if (!currentDiscussion) {
        return <div>현재 선택된 디스커션을 찾을 수 없습니다.</div>;
    }

    const handleNodeClick = async (nodeId: number) => {
        if (collection) {
            try {
                const discussionDetail = await fetchDiscussionDetail(nodeId);
                setCurrentDiscussion(discussionDetail);
                // URL 파라미터 업데이트
                setSearchParams({ current: nodeId.toString() });
            } catch (err) {
                console.error('상세 정보를 가져오는데 실패했습니다:', err);
            }
        }
    };

    // 새 노드가 추가된 후 컬렉션 데이터를 다시 불러오기
    const refreshCollection = async () => {
        if (!collectionId) return;
        
        try {
            const data = await fetchCollectionDiscussions(collectionId);
            setCollection(data);
        } catch (err) {
            console.error('컬렉션 데이터 새로고침 실패:', err);
        }
    };

    const handleDiscussionAdded = async (newDiscussion: DiscussionResponse) => {
        try {
            // 컬렉션 데이터 새로 불러오기
            const updatedCollection = await fetchCollectionDiscussions(collectionId);
            setCollection(updatedCollection);
            
            // 약간의 지연 후 새로운 노드를 현재 노드로 설정
            setTimeout(() => {
                setCurrentDiscussion(newDiscussion);
                setSearchParams({ current: newDiscussion.id.toString() });
            }, 100);
        } catch (err) {
            console.error('컬렉션 데이터 새로고침 실패:', err);
        }
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!currentDiscussion || !window.confirm('정말로 이 디스커션을 삭제하시겠습니까?')) return;

        try {
            await deleteDiscussion(currentDiscussion.id);
            // 컬렉션 데이터 새로고침
            const updatedCollection = await fetchCollectionDiscussions(collectionId);
            setCollection(updatedCollection);
            
            // 루트 디스커션이나 첫 번째 디스커션으로 이동
            const nextDiscussionId = updatedCollection.rootDiscussionId || 
                (updatedCollection.discussions[0]?.id);
            
            if (nextDiscussionId) {
                const discussionDetail = await fetchDiscussionDetail(nextDiscussionId);
                setCurrentDiscussion(discussionDetail);
                setSearchParams({ current: nextDiscussionId.toString() });
            }
        } catch (error) {
            console.error('디스커션 삭제 실패:', error);
        }
    };

    const handleEditSuccess = async (updatedDiscussion: DiscussionResponse) => {
        setCurrentDiscussion(updatedDiscussion);
        // 컬렉션 데이터도 새로고침
        const updatedCollection = await fetchCollectionDiscussions(collectionId);
        setCollection(updatedCollection);
    };

    return (
        <>
            <div className={`max-w-4xl mx-auto p-4`}>
                <div className="pb-4 flex justify-between items-center mb-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{collection.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentDiscussion.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <CollectionDetailMenu
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <div className="rounded-lg">
                    <div className="mb-8">
                        <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">@haiseong</span>
                            <span className="mx-2">•</span>
                            <span>
                                {currentDiscussion.updatedAt !== currentDiscussion.createdAt 
                                    ? `${new Date(currentDiscussion.updatedAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })} 수정됨`
                                    : new Date(currentDiscussion.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })
                                }
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {currentDiscussion.title}
                        </h1>
                    </div>

                    <p className="text-lg text-gray-800 whitespace-pre-wrap mb-8">
                        {currentDiscussion.content}
                    </p>

                    <div className="mt-12">
                        <Flow 
                            collectionId={collection.id}
                            discussions={collection.discussions}
                            relations={collection.relations.map(relation => ({
                                source: relation.sourceId,
                                target: relation.targetId
                            }))}
                            rootDiscussionId={collection.rootDiscussionId}
                            onNodeClick={handleNodeClick}
                            currentNodeId={currentDiscussion.id}
                            onDiscussionAdded={handleDiscussionAdded}
                        />
                    </div>
                </div>
            </div>

            {currentDiscussion && (
                <EditDiscussionDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    discussion={currentDiscussion}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}
