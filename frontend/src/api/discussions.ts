import {Discussion, DiscussionRequest} from "@/types";
import {DiscussionRelationships} from "@/components/discussions/flow/types";

const API_BASE_URL = process.env.API_BASE_URL;

export const getDiscussions = async (): Promise<Discussion[]> => {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const getDiscussionById = async (id: number): Promise<Discussion | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/discussions/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching discussion:', error);
        return null;
    }
};

export const createDiscussion = async (request: DiscussionRequest): Promise<Discussion> => {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create discussion');
    }

    return response.json();
};

export const updateDiscussion = async (id: number, request: DiscussionRequest): Promise<Discussion> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const deleteDiscussion = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
};

export const getDiscussionRelations = async (id: number): Promise<DiscussionRelationships> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}/relations`);
    if (!response.ok) {
        throw new Error('Failed to fetch relations');
    }
    return response.json();
};
