import apiClient from "@/lib/apiClient";
import { ServiceType, CreateServiceData, UpdateServiceData } from "@/types/service";
import { ApiResponse } from "@/types/api";
import { ProviderType } from "@/types/provider";

export const serviceService = {
  getAll: async (filters?: any): Promise<ApiResponse<ServiceType[]>> => {
    const response = await apiClient.get("/services", { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<ServiceType>> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },
  getProviders: async (id: string): Promise<ApiResponse<{ providers: ProviderType[] }>> => {
    const response = await apiClient.get(`/services/${id}/providers`);
    return response.data;
  },
  getAllWithProviders: async (): Promise<ApiResponse<ServiceType[]>> => {
    const response = await apiClient.get("/services/with-providers");
    return response.data;
  },
  create: async (data: CreateServiceData): Promise<ApiResponse<ServiceType>> => {
    const response = await apiClient.post("/services", data);
    return response.data;
  },
  update: async (id: string, data: Partial<UpdateServiceData>): Promise<ApiResponse<ServiceType>> => {
    const response = await apiClient.put(`/services/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};

