import apiClient from "@/lib/apiClient";
import { JobPostType, CreateJobPostData, UpdateJobPostData } from "@/types/jobPost";
import { ApiResponse } from "@/types/api";

export const jobPostService = {
  getAll: async (filters?: any): Promise<ApiResponse<JobPostType[]>> => {
    const response = await apiClient.get("/jobposts", { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.get(`/jobposts/${id}`);
    return response.data;
  },
  create: async (data: CreateJobPostData): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.post("/jobposts", data);
    return response.data;
  },
  update: async (id: string, data: Partial<UpdateJobPostData>): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.put(`/jobposts/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/jobposts/${id}`);
    return response.data;
  },
  apply: async (id: string): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.post(`/jobposts/${id}/apply`);
    return response.data;
  },
  approve: async (id: string, appId: string): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.put(`/jobposts/${id}/applications/${appId}/approve`);
    return response.data;
  },
  reject: async (id: string, appId: string): Promise<ApiResponse<JobPostType>> => {
    const response = await apiClient.put(`/jobposts/${id}/applications/${appId}/reject`);
    return response.data;
  },
};

