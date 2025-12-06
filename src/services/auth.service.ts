import apiClient from "@/lib/apiClient";
import { LoginCredentials, RegisterData } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post("/users/register", data);
    return response.data;
  },
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/users/logout");
  },
};

