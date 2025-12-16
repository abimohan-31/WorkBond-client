import apiClient from "@/lib/apiClient";
import {
  ProviderType,
  UpdateProviderData,
  CreateWorkPostData,
  UpdateWorkPostData,
  WorkPostType,
} from "@/types/provider";
import { ApiResponse } from "@/types/api";
import { ReviewType } from "@/types/review";
import { SubscriptionType } from "@/types/subscription";

export const providerService = {
  getProfile: async (): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.get("/providers/profile");
    return response.data;
  },
  updateProfile: async (
    data: Partial<UpdateProviderData>
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.put("/providers/profile", data);
    return response.data;
  },
  getReviews: async (): Promise<ApiResponse<{ reviews: ReviewType[] }>> => {
    const response = await apiClient.get("/reviews");
    return response.data;
  },
  getSubscription: async (): Promise<
    ApiResponse<{ subscription: SubscriptionType }>
  > => {
    const response = await apiClient.get("/subscription");
    return response.data;
  },

  // Work Post Methods
  createWorkPost: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/workposts", data);
    return response.data;
  },

  getWorkPosts: async (params?: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.get("/workposts", { params });
    return response.data;
  },

  getWorkPostById: async (
    id: string
  ): Promise<ApiResponse<{ workPost: WorkPostType }>> => {
    const response = await apiClient.get(`/workposts/${id}`);
    return response.data;
  },

  updateWorkPost: async (
    id: string,
    data: Partial<UpdateWorkPostData>
  ): Promise<ApiResponse<{ workPost: WorkPostType }>> => {
    const response = await apiClient.put(`/workposts/${id}`, data);
    return response.data;
  },

  deleteWorkPost: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/workposts/${id}`);
    return response.data;
  },

  // Profile Image
  updateProfileImage: async (imageUrl: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put("/providers/profile", {
      profileImage: imageUrl,
    });
    return response.data;
  },

  getAllPublicWorkPosts: async (params?: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.get("/workposts", { params });
    return response.data;
  },

  getProviderById: async (
    id: string
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.get(`/providers/public/${id}`);
    return response.data;
  },
};
