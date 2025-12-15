import apiClient from "@/lib/apiClient";
import {
  SubscriptionType,
  CreateSubscriptionData,
  UpdateSubscriptionData,
} from "@/types/subscription";
import { ApiResponse } from "@/types/api";

export const subscriptionService = {
  getAll: async (filters?: any): Promise<ApiResponse<SubscriptionType[]>> => {
    const response = await apiClient.get("/subscriptions", { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<SubscriptionType>> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },
  create: async (
    data: CreateSubscriptionData
  ): Promise<ApiResponse<SubscriptionType>> => {
    const response = await apiClient.post("/subscriptions", data);
    return response.data;
  },
  update: async (
    id: string,
    data: Partial<UpdateSubscriptionData>
  ): Promise<ApiResponse<SubscriptionType>> => {
    const response = await apiClient.put(`/subscriptions/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/subscriptions/${id}`);
    return response.data;
  },

  createProviderSubscription: async (
    planName: string,
    amount: number
  ): Promise<ApiResponse<SubscriptionType>> => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const response = await apiClient.post("/subscriptions/provider/subscribe", {
      plan_name: planName,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      amount,
    });
    return response.data;
  },
};
