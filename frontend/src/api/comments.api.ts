import apiClient from './client';

export const getComments = async (postId: string | number) => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
};

export const addComment = async ({
    postId,
    content,
}: {
    postId: string | number;
    content: string;
}) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data;
};

export const deleteComment = async (commentId: string | number) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
};

