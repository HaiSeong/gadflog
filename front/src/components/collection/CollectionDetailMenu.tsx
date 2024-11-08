import {Button} from '@/components/ui/button';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import {MoreHorizontal} from 'lucide-react';

interface CollectionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    disabled?: boolean;
}

export default function CollectionDetailMenu({
                                                 onEdit,
                                                 onDelete,
                                                 disabled
                                             }: CollectionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="bg-white hover:bg-gray-100"
                >
                    <MoreHorizontal className="h-4 w-4 text-black"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white">
                <DropdownMenuItem
                    onClick={onEdit}
                    className="cursor-pointer hover:bg-gray-100 text-black"
                >
                    수정
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="cursor-pointer hover:bg-gray-100 text-black"
                >
                    삭제
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
