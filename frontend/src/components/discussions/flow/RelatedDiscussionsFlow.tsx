'use client';

import React from 'react';
import {ReactFlowProvider} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Discussion} from '@/types';
import Flow from "@/components/discussions/flow/Flow";

interface RelatedDiscussionsFlowProps {
    currentDiscussion: Discussion;
    key?: string;
}

const RelatedDiscussionsFlow = (props: RelatedDiscussionsFlowProps) => {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    );
};

export default RelatedDiscussionsFlow;
