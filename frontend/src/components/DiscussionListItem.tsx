'use client'

import {Discussion} from '@/types';
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';
import {ArrowRight} from 'lucide-react';

interface DiscussionListItemProps {
    discussion: Discussion;
    isOpen: boolean;
}

export default function DiscussionListItem({discussion, isOpen}: DiscussionListItemProps) {
    const router = useRouter();

    return (
        <AccordionItem
            value={String(discussion.id)}
            className="border rounded-lg bg-white px-4"
        >
            <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start text-left w-full">
                    <p className={`line-clamp-1 transition-colors duration-100 ${
                        isOpen ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        {discussion.content}
                    </p>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="pt-1 pb-1">
                    <p className="text-2xl text-gray-800 whitespace-pre-wrap mb-6">
                        {discussion.content}
                    </p>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => router.push(`/discussions/${discussion.id}`)}
                            variant="ghost"
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                        >
                            <span>더보기</span>
                            <ArrowRight className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
