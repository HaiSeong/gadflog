'use client'

import {Discussion} from '@/types';
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";

interface DiscussionListItemProps {
    discussion: Discussion;
    isLoading: boolean;
    isOpen: boolean;
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
}

export const DiscussionListItem: React.FC<DiscussionListItemProps> = (
    {discussion, isLoading, isOpen, onEdit, onDelete}) => {
    return (
        <AccordionItem
            key={discussion.id}
            value={String(discussion.id)}
            className="border rounded-lg bg-white px-4"
        >
            <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start text-left">
                    <p className={`line-clamp-1 transition-colors duration-100 ${
                        isOpen ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        {discussion.content}
                    </p>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="pt-1 pb-1">
                    <p className="text-3xl text-gray-800 whitespace-pre-wrap mb-20">
                        {discussion.content}
                    </p>
                    <div className="flex space-x-2 text-sm">
                        <Button
                            variant="link"
                            className="h-auto p-0 text-blue-500 hover:text-blue-700"
                            onClick={() => onEdit(discussion.id, discussion.content)}
                            disabled={isLoading}
                        >
                            수정
                        </Button>
                        <span className="text-gray-300">|</span>
                        <Button
                            variant="link"
                            className="h-auto p-0 text-red-500 hover:text-red-700"
                            onClick={() => onDelete(discussion.id)}
                            disabled={isLoading}
                        >
                            삭제
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
