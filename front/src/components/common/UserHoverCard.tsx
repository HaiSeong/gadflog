import {HoverCard, HoverCardContent, HoverCardTrigger,} from '@/components/ui/hover-card';
import {Button} from '@/components/ui/button';

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
                    variant="ghost"
                    className="bg-white hover:bg-gray-100 h-8 p-2"
                >
                    <span className="text-black">{username}</span>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-black">{username}</div>
                        <div className="text-xs text-gray-500">{role}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Joined on {new Date(joinDate).toLocaleDateString()}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
