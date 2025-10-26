import apiClient from './api.js';

export const getUser = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateProfile = async (userId, payload) => {
  const response = await apiClient.put(`/users/${userId}`, payload);
  return response.data;
};
