import apiClient from './client';

export const getPosts = async (limit = 10, offset = 0) => {
    const response = await apiClient.get('/posts', {
        params: { limit, offset },
    });
    return response.data;
};

export const getPost = async (postId: string | number) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
};

export const toggleLike = async (postId: string | number) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
};

export const createPost = async (title: string, content: string, media_url?: string) => {
    const response = await apiClient.post('/posts/create', {
        title,
        content,
        media_url,
    });
    return response.data;
};



