import { Collection, Discussion } from "@/types";

const BASE_URL = "http://localhost:8080"; // 환경변수로 관리하는 것을 추천합니다

export const fetchCollectionDiscussions = async (collectionId: number): Promise<Collection> => {
    const response = await fetch(`${BASE_URL}/collections/${collectionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch collection discussions');
  }
  return response.json();
}; 


interface DiscussionRequest {
    title: string;
    content: string;
    type: DiscussionType;
  }
  
  export const createDiscussion = async (collectionId: number, data: DiscussionRequest): Promise<Discussion> => {
    const response = await fetch(`${BASE_URL}/collections/${collectionId}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create discussion');
    }
  
    return response.json();
  };
  