import apiClient from "../apiClient";

// Types
export interface Provider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: "Available" | "Unavailable";
  rating: number;
  role: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Admin API Service
export const adminApi = {
  /**
   * Get all pending providers
   */
  async getPendingProviders(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{ providers: Provider[] }>> {
    const response = await apiClient.get("/providers/pending", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get all providers (approved) - Note: API returns data as direct array, not wrapped
   */
  async getAllProvidersForAdmin(): Promise<ApiResponse<Provider[]>> {
    const response = await apiClient.get("/providers/admin/all");
    return response.data;
  },

  /**
   * Alias for getAllProvidersForAdmin to match dashboard usage
   */
  async getAllProviders(): Promise<ApiResponse<Provider[]>> {
    return this.getAllProvidersForAdmin();
  },

  /**
   * Get all customers
   */
  async getAllCustomers(): Promise<ApiResponse<{ customers: Customer[] }>> {
    const response = await apiClient.get("/customers");
    return response.data;
  },

  /**
   * Approve a provider
   */
  async approveProvider(
    providerId: string
  ): Promise<ApiResponse<{ provider: Provider }>> {
    const response = await apiClient.patch(`/providers/${providerId}/approve`);
    return response.data;
  },

  /**
   * Reject a provider
   */
  async rejectProvider(
    providerId: string,
    reason?: string
  ): Promise<ApiResponse<{ provider: Provider }>> {
    const response = await apiClient.patch(
      `/providers/${providerId}/reject`,
      { reason }
    );
    return response.data;
  },

  /**
   * Delete a provider permanently
   */
  async deleteProvider(providerId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/providers/${providerId}`);
    return response.data;
  },
};

