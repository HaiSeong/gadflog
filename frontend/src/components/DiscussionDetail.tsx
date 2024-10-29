'use client'

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Discussion} from '@/types';
import {Button} from '@/components/ui/button';
import {deleteDiscussion, getDiscussionById, updateDiscussion} from '@/api/discussions';
import {toast} from "@/hooks/use-toast";
import {DiscussionEditDialog} from '@/components/DiscussionEditDialog';
import {DiscussionDeleteAlert} from '@/components/DiscussionDeleteAlert';
import DiscussionDetailMenu from './DiscussionDetailMenu';
import {Separator} from "@/components/ui/separator";
import {UserHoverCard} from './UserHoverCard';
import {DateInfo} from './DateInfo';
import {ArrowLeft} from "lucide-react";

export default function DiscussionDetail() {
    const params = useParams();
    const router = useRouter();
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editDialog, setEditDialog] = useState({
        isOpen: false,
        title: '',
        content: ''
    });
    const [deleteAlert, setDeleteAlert] = useState({isOpen: false});

    useEffect(() => {
        const fetchDiscussion = async () => {
            if (params.id) {
                const data = await getDiscussionById(Number(params.id));
                setDiscussion(data);
            }
        };
        fetchDiscussion();
    }, [params.id]);

    const handleBack = () => {
        setIsLeaving(true);
        setTimeout(() => {
            router.back();
        }, 300);
    };

    const handleEdit = async () => {
        if (!editDialog.title.trim() || !editDialog.content.trim() || !discussion) return;

        try {
            setIsLoading(true);
            await updateDiscussion(discussion.id, {
                title: editDialog.title,
                content: editDialog.content
            });
            toast({
                title: "수정 완료",
                description: "질문이 수정되었습니다.",
            });
            setEditDialog({isOpen: false, title: '', content: ''});
            setDiscussion(prev => prev ? {
                ...prev,
                title: editDialog.title,
                content: editDialog.content
            } : null);
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

    const handleDelete = async () => {
        if (!discussion) return;

        try {
            setIsLoading(true);
            await deleteDiscussion(discussion.id);
            toast({
                title: "삭제 완료",
                description: "질문이 삭제되었습니다.",
            });
            handleBack();
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

    if (!discussion) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`max-w-4xl mx-auto ${isLeaving ? 'slide-out-transition' : 'slide-in-transition'}`}>
            <div className="pb-4 flex justify-between">

                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size="icon"/>
                    <span>이전</span>
                </Button>

                <DiscussionDetailMenu
                    onEdit={() => setEditDialog({
                        isOpen: true,
                        title: discussion.title,
                        content: discussion.content
                    })}
                    onDelete={() => setDeleteAlert({isOpen: true})}
                    disabled={isLoading}
                />
            </div>
            <div className="rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-500 pb-4">
                    <UserHoverCard
                        username="haiseong"
                        role="Backend Developer"
                        joinDate="2024-10-29"
                    />
                    <Separator orientation="vertical" className="h-4 flex items-center"/>
                    <DateInfo
                        createdAt={discussion.createdAt}
                        updatedAt={discussion.updatedAt}
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {discussion.title}
                </h1>
                <p className="text-lg text-gray-800 whitespace-pre-wrap">
                    {discussion.content}
                </p>
            </div>

            <DiscussionEditDialog
                isOpen={editDialog.isOpen}
                title={editDialog.title}
                content={editDialog.content}
                isLoading={isLoading}
                onClose={() => setEditDialog({isOpen: false, title: '', content: ''})}
                onChangeTitle={(title) => setEditDialog(prev => ({...prev, title}))}
                onChangeContent={(content) => setEditDialog(prev => ({...prev, content}))}
                onSubmit={handleEdit}
            />

            <DiscussionDeleteAlert
                isOpen={deleteAlert.isOpen}
                isLoading={isLoading}
                onClose={() => setDeleteAlert({isOpen: false})}
                onConfirm={handleDelete}
            />
        </div>
    );
}
