import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('skilllink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('skilllink_token');
      window.dispatchEvent(new CustomEvent('skilllink:logout'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
