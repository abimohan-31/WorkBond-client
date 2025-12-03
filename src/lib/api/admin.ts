// API Configuration
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

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

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Admin API Service
export const adminApi = {
  /**
   * Get all pending providers
   */
  async getPendingProviders(
    token: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{ providers: Provider[] }>> {
    const response = await fetch(`${API_URL}/admins/providers/pending`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pending providers: ${response.statusText}`
      );
    }

    return response.json();
  },

  /**
   * Get all providers (approved)
   */
  async getAllProviders(
    token: string
  ): Promise<ApiResponse<{ providers: Provider[] }>> {
    const response = await fetch(`${API_URL}/admins/providers`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get all customers
   */
  async getAllCustomers(
    token: string
  ): Promise<ApiResponse<{ customers: Customer[] }>> {
    const response = await fetch(`${API_URL}/admins/customers`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Approve a provider
   */
  async approveProvider(
    token: string,
    providerId: string
  ): Promise<ApiResponse<{ provider: Provider }>> {
    const url = `${API_URL}/admins/providers/${providerId}/approve`;
    console.log("Approving provider at:", url);
    const response = await fetch(
      url,
      {
        method: "PATCH",
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to approve provider`);
    }

    return response.json();
  },

  /**
   * Reject a provider
   */
  async rejectProvider(
    token: string,
    providerId: string,
    reason?: string
  ): Promise<ApiResponse<{ provider: Provider }>> {
    const response = await fetch(
      `${API_URL}/admins/providers/${providerId}/reject`,
      {
        method: "PATCH",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to reject provider`);
    }

    return response.json();
  },

  /**
   * Delete a provider permanently
   */
  async deleteProvider(
    token: string,
    providerId: string
  ): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${API_URL}/admins/providers/${providerId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete provider`);
    }

    return response.json();
  },
};
