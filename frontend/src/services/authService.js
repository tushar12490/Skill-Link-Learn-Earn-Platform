import apiClient from './api.js';

export const register = async (data) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await apiClient.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const setAuthTokenStorage = (token) => {
  localStorage.setItem('skilllink_token', token);
};

export const clearAuthTokenStorage = () => {
  localStorage.removeItem('skilllink_token');
};
