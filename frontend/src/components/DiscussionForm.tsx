import {useState} from 'react';
import {submitDiscussion} from '@/api/submitDiscussion';
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import LoadingSpinner from './LoadingSpinner';

export const DiscussionForm: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast({
                title: "입력 오류",
                description: "내용을 입력해주세요.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const data = await submitDiscussion(content);
            toast({
                title: "질문 등록 완료",
                description: "질문이 성공적으로 등록되었습니다.",
            });
            setResultMessage(data.message); // 결과 메시지 저장
            setContent("");
            setIsExpanded(false);
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "질문 등록 실패",
                description: "질문 등록에 실패했습니다.",
            });
            setResultMessage(""); // 실패 시 초기화
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
            {resultMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
                    {resultMessage}
                </div>
            )}
        </div>
    );
};
