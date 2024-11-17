import { CollectionResponse, DiscussionResponse, DiscussionType } from "@/types";

const BASE_URL = "http://localhost:8080"; // 환경변수로 관리하는 것을 추천합니다

export const fetchCollectionDiscussions = async (collectionId: number): Promise<CollectionResponse> => {
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
    collectionId: number;
    parentId: number | null;
  }
  
  export const createDiscussion = async (data: DiscussionRequest): Promise<CreateDiscussionResponse> => {
    const response = await fetch(`${BASE_URL}/discussions`, {
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
  
  export const fetchCollections = async (): Promise<CollectionResponse[]> => {
    const response = await fetch(`${BASE_URL}/collections`);
    if (!response.ok) {
        throw new Error('컬렉션 목록을 가져오는데 실패했습니다');
    }
    return response.json();
};
  
interface CreateCollectionRequest {
  title: string;
}

export const createCollection = async (data: CreateCollectionRequest): Promise<CollectionResponse> => {
  const response = await fetch(`${BASE_URL}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('컬렉션 생성에 실패했습니다');
  }

  return response.json();
};
  
export const fetchDiscussionDetail = async (discussionId: number): Promise<DiscussionResponse> => {
  const response = await fetch(`${BASE_URL}/discussions/${discussionId}`);
  
  if (!response.ok) {
    throw new Error('상세 정보를 가져오는데 실패했습니다');
  }
  
  return response.json();
};
  
interface UpdateDiscussionRequest {
  title: string;
  content: string;
  type: DiscussionType;
}

export const updateDiscussion = async (discussionId: number, data: UpdateDiscussionRequest): Promise<DiscussionResponse> => {
  const response = await fetch(`${BASE_URL}/discussions/${discussionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('디스커션 수정에 실패했습니다');
  }

  return response.json();
};

export const deleteDiscussion = async (discussionId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/discussions/${discussionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('디스커션 삭제에 실패했습니다');
  }
};
  