import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { WorkPostType } from "@/types/provider";

export const workPostService = {
  getAll: async (params?: any): Promise<ApiResponse<WorkPostType[]>> => {
    const response = await apiClient.get("/workposts", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<WorkPostType>> => {
    const response = await apiClient.get(`/workposts/${id}`);
    return response.data;
  },

  getByProvider: async (
    providerId: string,
    params?: any
  ): Promise<ApiResponse<WorkPostType[]>> => {
    const response = await apiClient.get(`/workposts/provider/${providerId}`, {
      params,
    });
    return response.data;
  },

  getByJobPost: async (
    jobPostId: string,
    params?: any
  ): Promise<ApiResponse<WorkPostType[]>> => {
    const response = await apiClient.get(`/workposts/job/${jobPostId}`, {
      params,
    });
    return response.data;
  },

  editJobPost: async (
    id: string,
    data: WorkPostType
  ): Promise<ApiResponse<WorkPostType>> => {
    const response = await apiClient.put(`/workposts/${id}`, data);
    return response.data;
  },
};
