import {Relation} from '@/types';

export const getRelationshipLabel = (relation?: Relation, isCurrent: boolean = false) => {
    if (isCurrent) return {
        text: 'Current',
        color: 'text-purple-600'
    };

    if (!relation) return {
        text: '',
        color: ''
    };

    switch (relation.type) {
        case 'QUESTION':
            return {
                text: 'Question',
                color: 'text-orange-500'
            };
        case 'OPINION':
            return {
                text: 'Opinion',
                color: 'text-green-600'
            };
        default:
            return {
                text: '',
                color: ''
            };
    }
};

export const getEdgeStyle = (type: string) => {
    const baseStyle = {
        strokeWidth: 3,
    };

    return {
        ...baseStyle,
        stroke: '#78716c',
    };
};

export const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
