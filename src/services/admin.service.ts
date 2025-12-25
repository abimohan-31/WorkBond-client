import apiClient from "@/lib/apiClient";
import { ProviderType } from "@/types/provider";
import { CustomerType } from "@/types/customer";
import { SubscriptionType } from "@/types/subscription";
import { ReviewType } from "@/types/review";
import { ApiResponse } from "@/types/api";

export const adminService = {
  getPendingProviders: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{ providers: ProviderType[] }>> => {
    const response = await apiClient.get("/providers/pending", {
      params: { page, limit },
    });
    return response.data;
  },
  getAllProviders: async (): Promise<ApiResponse<ProviderType[]>> => {
    const response = await apiClient.get("/providers/admin/all");
    return response.data;
  },
  getAllCustomers: async (
    filters?: any
  ): Promise<ApiResponse<{ customers: CustomerType[] }>> => {
    const response = await apiClient.get("/customers", { params: filters });
    return response.data;
  },
  getAllSubscriptions: async (
    filters?: any
  ): Promise<ApiResponse<SubscriptionType[]>> => {
    const response = await apiClient.get("/subscriptions", { params: filters });
    return response.data;
  },
  getAllReviews: async (filters?: any): Promise<ApiResponse<ReviewType[]>> => {
    const response = await apiClient.get("/reviews", { params: filters });
    return response.data;
  },
  approveProvider: async (
    id: string
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.patch(`/providers/${id}/approve`);
    return response.data;
  },
  rejectProvider: async (
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.patch(`/providers/${id}/reject`, {
      reason,
    });
    return response.data;
  },
  deleteProvider: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/providers/${id}`);
    return response.data;
  },
  updateProviderStatus: async (
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.patch(`/providers/${id}`, { isActive });
    return response.data;
  },
  deleteReview: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  banProvider: async (
    id: string
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.patch(`/providers/${id}/ban`);
    return response.data;
  },

  activateProvider: async (
    id: string
  ): Promise<ApiResponse<{ provider: ProviderType }>> => {
    const response = await apiClient.patch(`/providers/${id}/activate`);
    return response.data;
  },

  banCustomer: async (
    id: string
  ): Promise<ApiResponse<{ customer: CustomerType }>> => {
    const response = await apiClient.patch(`/customers/${id}/ban`);
    return response.data;
  },

  activateCustomer: async (
    id: string
  ): Promise<ApiResponse<{ customer: CustomerType }>> => {
    const response = await apiClient.patch(`/customers/${id}/activate`);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  },

  updateSubscriptionStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<{ subscription: SubscriptionType }>> => {
    const response = await apiClient.put(`/subscriptions/${id}`, { status });
    return response.data;
  },
  getSubscriptionsSummary: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get("/subscriptions/admin-summary");
    return response.data;
  },
};
