import {Discussion} from '@/types';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {useState} from 'react';

interface DiscussionListProps {
    discussions: Discussion[];
}

export const DiscussionList: React.FC<DiscussionListProps> = ({discussions}) => {
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
                        <AccordionItem
                            key={discussion.id}
                            value={discussion.id}
                            className="border rounded-lg bg-white px-4"
                        >
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex flex-col items-start text-left">
                                    <p className={`line-clamp-1 transition-colors duration-100 ${
                                        openItem === discussion.id ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        {discussion.content}
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pt-2 pb-4">
                                    <div className="h-10"/>
                                    <p className="text-3xl text-gray-800 whitespace-pre-wrap">{discussion.content}</p>
                                    <div className="h-10"/>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
};
