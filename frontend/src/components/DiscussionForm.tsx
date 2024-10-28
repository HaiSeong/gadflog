import {useState} from 'react';
import {submitDiscussion} from '@/api/discussions';
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import LoadingSpinner from './LoadingSpinner';
import {DiscussionRequest} from "@/types";

interface DiscussionFormProps {
    onSubmitSuccess: () => void;
}

export const DiscussionForm: React.FC<DiscussionFormProps> = ({onSubmitSuccess}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast({
                title: "입력 오류",
                description: "내용을 입력해주세요.",
            });
            return;
        }

        setIsLoading(true);

        const requset: DiscussionRequest = {
            content: content,
        }
        try {
            const data = await submitDiscussion(requset);
            toast({
                title: "질문 등록 완료",
                description: "질문이 성공적으로 등록되었습니다.",
            });
            setContent("");
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

    return (
        <div className="relative grid w-full gap-1.5">
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <Label htmlFor="message" className="text-base">
                    새로운 질문이 있나요?
                </Label>
                <Textarea
                    placeholder="궁금한 내용을 적어보아요."
                    id="message"
                    value={content}
                    className={`transition-all duration-300 ${isExpanded ? 'h-32' : 'h-12'}`}
                    onClick={() => setIsExpanded(true)}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="h-1"/>
                {isExpanded && (
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsExpanded(false);
                                setContent("");
                            }}
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button
                            className="bg-black text-white border border-black"
                            onClick={handleSubmit}
                            disabled={isLoading || !content.trim()}
                        >
                            작성
                        </Button>
                    </div>
                )}
            </div>
            {isLoading && <LoadingSpinner/>}
        </div>
    );
};
