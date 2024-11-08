import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {Collection, Discussion} from "@/types";
import {Button} from '@/components/ui/button';
import CollectionDetailMenu from '@/components/collection/CollectionDetailMenu';
import {ArrowLeft} from "lucide-react";
import Flow from "@/components/collection/Flow.tsx";
import { fetchCollectionDiscussions } from "@/api/collection";

export default function CollectionDetail() {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                const data = await fetchCollectionDiscussions(id);
                setCollection(data);
                
                // 최초 로딩시에만 current 파라미터 확인
                const currentNodeId = searchParams.get('current');
                const initialDiscussion = currentNodeId 
                    ? data.discussions.find(d => d.id.toString() === currentNodeId)
                    : data.discussions.find(d => d.id.toString() === data.rootDiscussionId.toString());
                
                if (!initialDiscussion) {
                    setCurrentDiscussion(data.discussions[0] || null);
                } else {
                    setCurrentDiscussion(initialDiscussion);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

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

    if (!collection.discussions || collection.discussions.length === 0) {
        return <div>토론 내용이 없습니다.</div>;
    }

    if (!currentDiscussion) {
        return <div>현재 선택된 토론을 찾을 수 없습니다.</div>;
    }

    const handleNodeClick = (nodeId: number) => {
        if (collection) {
            const discussion = collection.discussions.find(
                (d: Discussion) => d.id === nodeId
            );
            if (discussion) {
                setCurrentDiscussion(discussion);
            }
        }
    };

    return (
        <div className={`max-w-4xl mx-auto p-4`}>
            <div className="pb-4 flex justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center bg-white hover:bg-gray-100 text-black"
                >
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    <span>이전</span>
                </Button>

                <CollectionDetailMenu
                    onEdit={() => {
                    }}
                    onDelete={() => {
                    }}
                />
            </div>

            <div className="rounded-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentDiscussion.title}
                </h1>

                <p className="text-lg text-gray-800 whitespace-pre-wrap mb-8">
                    {currentDiscussion.content}
                </p>

                <div className="mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">관련된 질문들</h2>
                    </div>
                    <Flow 
                        discussions={collection.discussions}
                        relations={collection.relations.map(relation => ({
                            source: relation.sourceId,
                            target: relation.targetId
                        }))}
                        rootDiscussionId={collection.rootDiscussionId}
                        onNodeClick={handleNodeClick}
                        currentNodeId={currentDiscussion.id}
                    />
                </div>
            </div>
        </div>
    );
}
