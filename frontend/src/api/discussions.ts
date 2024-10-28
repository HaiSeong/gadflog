import {Discussion, DiscussionRequest} from "@/types";

export const getDiscussions = async (): Promise<Discussion[]> => {
    const response = await fetch('/discussions', {
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

export const submitDiscussion = async (request: DiscussionRequest): Promise<Discussion> => {
    const response = await fetch('/discussions', {
        method: 'POST',
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

export const updateDiscussion = async (id: number, request: DiscussionRequest) => {
    const response = await fetch(`/discussions/${id}`, {
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

export const deleteDiscussion = async (id: number) => {
    const response = await fetch(`/discussions/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
};
