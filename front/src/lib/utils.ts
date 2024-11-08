import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const sliceContent = (content: string, maxLength: number): string => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
