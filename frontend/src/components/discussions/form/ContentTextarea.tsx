import {useEffect, useRef} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";

interface DiscussionContentTextareaProps {
    value: string;
    onChange: (value: string) => void;
    showCount?: boolean;
    minHeight?: number;
    maxHeight?: number;
    className?: string;
}

export function ContentTextarea({
                                    value,
                                    onChange,
                                    showCount = true,
                                    minHeight = 120,
                                    maxHeight = 400,
                                    className = ""
                                }: DiscussionContentTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const currentLines = textarea.value.split('\n').length;
        const contentLines = Math.ceil(textarea.value.length / 35);
        const estimatedLines = Math.max(currentLines, contentLines);
        const desiredHeight = Math.min(
            Math.max(
                minHeight,
                (estimatedLines * 24 + 24) * 1.2
            ),
            maxHeight
        );

        textarea.style.height = `${desiredHeight}px`;
        textarea.style.overflowY = desiredHeight >= maxHeight ? 'auto' : 'hidden';
    };

    useEffect(() => {
        adjustHeight();
    }, [value, minHeight, maxHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 2000) {
            onChange(newValue);
        }
    };

    return (
        <div className="grid gap-1.5 p-1">
            <div className="flex justify-between items-center">
                <Label htmlFor="content">내용</Label>
                {showCount && (
                    <span className="text-xs text-gray-500">
                        {value.length}/2000
                    </span>
                )}
            </div>
            <Textarea
                ref={textareaRef}
                id="content"
                value={value}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                className={`transition-all duration-200 ${className}`}
                style={{
                    minHeight: `${minHeight}px`,
                    resize: 'none',
                    overflow: 'hidden',
                }}
            />
        </div>
    );
}
