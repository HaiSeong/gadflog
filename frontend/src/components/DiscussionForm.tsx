'use client'

import {useState} from 'react';
import {Button} from "@/components/ui/button";
import LoadingSpinner from '@/components/LoadingSpinner';
import {toast} from "@/hooks/use-toast";
import {submitDiscussion} from "@/api/discussions";
import {DiscussionTitleInput} from "@/components/DiscussionTitleInput";
import {DiscussionContentTextarea} from "@/components/DiscussionContentTextarea";

interface DiscussionFormProps {
    onSubmitSuccess: () => void;
}

export const DiscussionForm: React.FC<DiscussionFormProps> = ({onSubmitSuccess}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast({
                title: "입력 오류",
                description: "제목을 입력해주세요.",
            });
            return;
        }

        if (isExpanded && !formData.content.trim()) {
            toast({
                title: "입력 오류",
                description: "내용을 입력해주세요.",
            });
            return;
        }

        setIsLoading(true);

        const request = {
            title: formData.title.trim(),
            content: formData.content.trim() || formData.title.trim(),
        }

        try {
            await submitDiscussion(request);
            toast({
                title: "질문 등록 완료",
                description: "질문이 성공적으로 등록되었습니다.",
            });
            setFormData({title: "", content: ""});
            setIsExpanded(false);
            onSubmitSuccess();
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "질문 등록 실패",
                description: <span className="text-red-500">질문 등록에 실패했습니다.</span>,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setFormData({title: "", content: ""});
    };

    return (
        <div className="relative grid w-full gap-1.5">
            <h2 className="text-xl font-semibold mb-4">질문하기</h2>
            <div className={`transition-all duration-300 ease-in-out ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <DiscussionTitleInput
                    value={formData.title}
                    onChange={(title) => setFormData(prev => ({...prev, title}))}
                    onClick={() => setIsExpanded(true)}
                    className="mb-2"
                />
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <DiscussionContentTextarea
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({...prev, content}))}
                    />
                    <div className="h-4"/>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button
                            className="bg-black text-white border border-black"
                            onClick={handleSubmit}
                            disabled={isLoading || !formData.title.trim() || (isExpanded && !formData.content.trim())}
                        >
                            작성
                        </Button>
                    </div>
                </div>
            </div>
            {isLoading && <LoadingSpinner/>}
        </div>
    );
};
