'use client'

import {Button} from "@/components/ui/button";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "@/components/ui/hover-card";
import {CalendarIcon} from "@radix-ui/react-icons";
import {formatDate} from "@/lib/utils";

interface UserHoverCardProps {
    username: string;
    role: string;
    joinDate: string;
}

export function UserHoverCard({username, role, joinDate}: UserHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button
                    variant="link"
                    className="text-gray-500 hover:text-gray-900 inline-flex items-center p-0"
                >
                    @{username}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@{username}</h4>
                        <p className="text-sm">{role}</p>
                        <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70"/>
                            <span className="text-xs text-muted-foreground">
        Joined {formatDate(joinDate)}
    </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
