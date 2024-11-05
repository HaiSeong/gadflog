'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Handle} from '@xyflow/react';
import {useRouter} from 'next/navigation';
import {CustomNodeData} from './types';
import {getRelationshipLabel} from './utils';
import {sliceContent} from '@/utils/string';

const CustomNode = ({data}: { data: CustomNodeData }) => {
    const router = useRouter();
    const nodeRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(200);
    const [isHovered, setIsHovered] = useState(false);
    const [showAddButton, setShowAddButton] = useState(false);

    useEffect(() => {
        if (nodeRef.current) {
            const textWidth = nodeRef.current.querySelector('p')?.scrollWidth || 0;
            const newWidth = Math.max(200, textWidth + 32);
            setWidth(newWidth);
        }
    }, [data.title]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/discussions/${data.id}`);
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (data.onAddRelation) {
            data.onAddRelation(data.id);
        }
    };

    const containerWidth = width;
    const expandedWidth = width * 1.1;
    const offset = (expandedWidth - containerWidth) / 2;

    return (
        <div className="relative" style={{width: containerWidth}}>
            <Handle
                id="top"
                type="target"
                position="top"
                style={{
                    background: '#555',
                    width: 8,
                    height: 8,
                }}
            />
            <div
                ref={nodeRef}
                onClick={handleClick}
                style={{
                    width: isHovered ? expandedWidth : containerWidth,
                    marginLeft: isHovered ? -offset : 0,
                    transition: 'all 0.3s ease',
                    pointerEvents: 'all',
                    transform: isHovered ? 'scaleY(1.1)' : 'none',
                    transformOrigin: 'top',
                    position: 'relative',
                }}
                className={`px-4 py-3 bg-white rounded-lg shadow-sm 
                    ${data.isCurrent ? 'border-2 border-black shadow-md' : 'border border-gray-200'}
                    ${isHovered ? 'shadow-lg' : ''}
                    cursor-pointer
                    hover:bg-gray-50
                    origin-top`}
                onMouseEnter={() => {
                    setIsHovered(true);
                    setShowAddButton(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setShowAddButton(false);
                }}
            >
                <p className="text-m font-medium text-gray-900">
                    {sliceContent(data.title, 24)}
                </p>
                {isHovered && (
                    <div className="mt-2 text-sm space-y-2">
                        <div className={`font-medium ${getRelationshipLabel(data.relation, data.isCurrent).color}`}>
                            {getRelationshipLabel(data.relation, data.isCurrent).text}
                        </div>
                        {data.content && (
                            <div className="text-gray-600 max-w-xs">
                                {sliceContent(data.content, 10)}
                            </div>
                        )}
                    </div>
                )}
                {showAddButton && (
                    <div
                        className="absolute -right-2 -bottom-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors z-10"
                        onClick={handleAddClick}
                    >
                        <span className="text-sm font-bold">+</span>
                    </div>
                )}
            </div>
            <Handle
                id="bottom"
                type="source"
                position="bottom"
                style={{
                    background: '#555',
                    width: 8,
                    height: 8,
                }}
            />
        </div>
    );
};

export default CustomNode;

export const nodeTypes = {
    custom: CustomNode,
};
