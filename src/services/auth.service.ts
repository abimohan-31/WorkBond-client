import apiClient from "@/lib/apiClient";
import { LoginCredentials, RegisterData } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { providerService } from "./provider.service";
import { customerService } from "./customer.service";

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },
  register: async (
    data: RegisterData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post("/users/register", data);
    return response.data;
  },
  getCurrentUser: async (
    userRole?: string,
    userId?: string
  ): Promise<ApiResponse<{ user: User }>> => {
    try {
      // If we have role and userId, use the appropriate endpoint
      if (userRole && userId) {
        if (userRole === "provider") {
          const response = await providerService.getProfile();
          return {
            success: response.success,
            statusCode: response.statusCode,
            message: response.message,
            data: {
              user: response.data?.provider as User,
            },
          };
        } else if (userRole === "customer") {
          const response = await customerService.getProfile();
          return {
            success: response.success,
            statusCode: response.statusCode,
            message: response.message,
            data: {
              user: response.data?.customer as User,
            },
          };
        } else if (userRole === "admin") {
          // For admin, use getUserById endpoint
          const response = await apiClient.get(`/users/${userId}?role=admin`);
          return response.data;
        }
      }

      // Fallback: try to get user from token (this requires backend support)
      // For now, throw error if role/userId not provided
      throw new Error("User role and ID required to fetch current user");
    } catch (error: any) {
      throw error;
    }
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/users/logout");
  },
  changePassword: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/users/change-password", data);
    return response.data;
  },
};
