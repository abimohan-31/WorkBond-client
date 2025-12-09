import apiClient from "@/lib/apiClient";
import { ProviderType, UpdateProviderData } from "@/types/provider";
import { ApiResponse } from "@/types/api";
import { ReviewType } from "@/types/review";
import { SubscriptionType } from "@/types/subscription";

export const providerService = {
  getProfile: async (): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.get("/providers/profile");
    return response.data;
  },
  updateProfile: async (data: Partial<UpdateProviderData>): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.put("/providers/profile", data);
    return response.data;
  },
  getReviews: async (): Promise<ApiResponse<{ reviews: ReviewType[] }>> => {
    const response = await apiClient.get("/reviews");
    return response.data;
  },
  getSubscription: async (): Promise<ApiResponse<{ subscription: SubscriptionType }>> => {
    const response = await apiClient.get("/subscription");
    return response.data;
  },
};

