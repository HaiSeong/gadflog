import {Discussion} from "@/types";

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

export const submitDiscussion = async (content: string) => {
    const response = await fetch('/discussions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content}),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};
