import apiClient from "@/lib/apiClient";
import { ReviewType, CreateReviewData, UpdateReviewData } from "@/types/review";
import { ApiResponse } from "@/types/api";

export const reviewService = {
  getAll: async (filters?: any): Promise<ApiResponse<ReviewType[]>> => {
    const response = await apiClient.get("/reviews", { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<ReviewType>> => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },
  create: async (data: CreateReviewData): Promise<ApiResponse<ReviewType>> => {
    const response = await apiClient.post("/reviews", data);
    return response.data;
  },
  update: async (id: string, data: Partial<UpdateReviewData>): Promise<ApiResponse<ReviewType>> => {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },
};

