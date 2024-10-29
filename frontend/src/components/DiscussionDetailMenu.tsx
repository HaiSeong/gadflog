'use client'

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {HamburgerMenuIcon} from "@radix-ui/react-icons"

interface DiscussionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    disabled?: boolean;
}

export default function DiscussionDetailMenu({onEdit, onDelete, disabled}: DiscussionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                >
                    <HamburgerMenuIcon className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                    onClick={onEdit}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                    수정
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                    삭제
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
