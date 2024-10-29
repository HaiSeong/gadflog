'use client'

import {Discussion} from '@/types';
import {Accordion} from "@/components/ui/accordion";
import {useState} from 'react';
import DiscussionListItem from '@/components/DiscussionListItem';

interface DiscussionListProps {
    discussions: Discussion[];
}

export default function DiscussionList({discussions}: DiscussionListProps) {
    const [openItem, setOpenItem] = useState<string | undefined>();

    return (
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
                            isOpen={openItem === String(discussion.id)}
                        />
                    ))}
                </Accordion>
            )}
        </div>
    );
}
