'use client'

import {CalendarIcon, Pencil1Icon} from "@radix-ui/react-icons";
import {formatDate} from "@/lib/utils";

interface DateInfoProps {
    createdAt: string;
    updatedAt: string;
}

export function DateInfo({createdAt, updatedAt}: DateInfoProps) {
    return (
        <span className="inline-flex items-center gap-1">
            {createdAt === updatedAt ? (
                <>
                    <CalendarIcon className="h-4 w-4"/>
                    {formatDate(createdAt)}
                </>
            ) : (
                <>
                    <Pencil1Icon className="h-4 w-4"/>
                    {formatDate(updatedAt)}
                </>
            )}
        </span>
    );
}
