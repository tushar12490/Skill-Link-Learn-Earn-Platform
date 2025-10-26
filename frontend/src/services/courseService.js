import apiClient from './api.js';

export const fetchCourses = async () => {
  const response = await apiClient.get('/courses');
  return response.data;
};

export const createCourse = async (payload) => {
  const response = await apiClient.post('/courses', payload);
  return response.data;
};

export const enrollCourse = async (courseId) => {
  const response = await apiClient.post(`/courses/${courseId}/enroll`);
  return response.data;
};
