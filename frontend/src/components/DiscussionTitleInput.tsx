import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface DiscussionTitleInputProps {
    value: string;
    onChange: (value: string) => void;
    onClick?: () => void;
    showCount?: boolean;
    className?: string;
}

export function DiscussionTitleInput({
                                         value,
                                         onChange,
                                         onClick,
                                         showCount = true,
                                         className = ""
                                     }: DiscussionTitleInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 50) {
            onChange(newValue);
        }
    };

    return (
        <div className="grid gap-1.5">
            <div className="flex justify-between items-center">
                <Label htmlFor="title">제목</Label>
                {showCount && (
                    <span className="text-xs text-gray-500">
                        {value.length}/50
                    </span>
                )}
            </div>
            <Input
                id="title"
                value={value}
                onChange={handleChange}
                onClick={onClick}
                placeholder="제목을 입력하세요"
                className={className}
            />
        </div>
    );
}
