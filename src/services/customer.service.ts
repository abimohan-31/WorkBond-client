import apiClient from "@/lib/apiClient";
import { CustomerType, UpdateCustomerData } from "@/types/customer";
import { ApiResponse } from "@/types/api";

export const customerService = {
  getProfile: async (): Promise<ApiResponse<{ customer: CustomerType }>> => {
    const response = await apiClient.get("/customers/profile");
    return response.data;
  },
  updateProfile: async (data: Partial<UpdateCustomerData>): Promise<ApiResponse<{ customer: CustomerType }>> => {
    const response = await apiClient.put("/customers/profile", data);
    return response.data;
  },
  getAll: async (filters?: any): Promise<ApiResponse<{ customers: CustomerType[] }>> => {
    const response = await apiClient.get("/customers", { params: filters });
    return response.data;
  },
};

