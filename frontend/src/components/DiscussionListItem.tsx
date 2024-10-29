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
                <div className="flex flex-col items-start text-left w-full gap-1">
                    <h3 className={`font-medium transition-colors duration-100 ${
                        isOpen ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                        {discussion.title}
                    </h3>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="pt-4 pb-2 space-y-4">
                    <div className="space-y-2 flex justify-start pt-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {discussion.title}
                        </h2>
                    </div>
                    <div className="flex justify-between pt-2">
                        <p className="text-gray-800 whitespace-pre-wrap pr-1">
                            {discussion.content.length > 50
                                ? `${discussion.content.slice(0, 50)}...`
                                : discussion.content}
                        </p>
                        <Button
                            onClick={() => router.push(`/discussions/${discussion.id}`)}
                            variant="ghost"
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                        >
                            <span>자세히</span>
                            <ArrowRight className="w-4 h-4 ml-1"/>
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
