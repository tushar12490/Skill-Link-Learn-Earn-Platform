import apiClient from './api.js';

export const fetchJobs = async () => {
  const response = await apiClient.get('/jobs');
  return response.data;
};

export const createJob = async (payload) => {
  const response = await apiClient.post('/jobs', payload);
  return response.data;
};

export const applyToJob = async (jobId) => {
  const response = await apiClient.post('/applications', { jobId });
  return response.data;
};

export const fetchClientJobs = async () => {
  const response = await apiClient.get('/jobs/client');
  return response.data;
};

export const fetchFreelancerJobs = async () => {
  const response = await apiClient.get('/jobs/freelancer');
  return response.data;
};

export const fetchJobDetails = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}/details`);
  return response.data;
};
