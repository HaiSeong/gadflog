import {useEffect, useState} from 'react';
import {Discussion} from '@/types';
import {getDiscussions} from '@/api/discussions';
import {toast} from "@/hooks/use-toast";
import {DiscussionForm} from '@/components/DiscussionForm';
import {DiscussionList} from '@/components/DiscussionList';

export const DiscussionSection: React.FC = () => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);

    const fetchDiscussions = async () => {
        try {
            const data = await getDiscussions();
            setDiscussions(data);
        } catch (error) {
            console.error("Failed to fetch discussions:", error);
            toast({
                title: "로딩 실패",
                description: "질문 목록을 불러오는데 실패했습니다.",
            });
        }
    };

    useEffect(() => {
        fetchDiscussions();
    }, []);

    return (
        <div className="space-y-8">
            <DiscussionForm onSubmitSuccess={fetchDiscussions}/>
            <DiscussionList discussions={discussions}/>
        </div>
    );
};
