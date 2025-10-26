import apiClient from './api.js';

export const fetchFreelancerApplications = async (freelancerId) => {
  const response = await apiClient.get(`/applications/freelancer/${freelancerId}`);
  return response.data;
};

export const fetchJobApplications = async (jobId) => {
  const response = await apiClient.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await apiClient.put(`/applications/${applicationId}/status`, { status });
  return response.data;
};
