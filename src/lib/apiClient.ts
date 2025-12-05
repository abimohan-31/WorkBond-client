import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with all requests
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        Cookies.remove("user");
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error(
          "Access forbidden. You may not have the required permissions."
        );
      }
    }
    return Promise.reject(error);
  }
);

export const services = {
  getAll: () => apiClient.get("/services"),
  getById: (id: string) => apiClient.get(`/services/${id}`),
  getProviders: (id: string) => apiClient.get(`/services/${id}/providers`),
  getAllWithProviders: () => apiClient.get("/services/with-providers"),
  create: (data: any) => apiClient.post("/services", data),
  update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),
  delete: (id: string) => apiClient.delete(`/services/${id}`),
};

export const jobPosts = {
  getAll: () => apiClient.get("/job-posts"),
  getById: (id: string) => apiClient.get(`/job-posts/${id}`),
  create: (data: any) => apiClient.post("/job-posts", data),
  update: (id: string, data: any) => apiClient.put(`/job-posts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/job-posts/${id}`),
  apply: (id: string) => apiClient.post(`/job-posts/${id}/apply`),
  approve: (id: string, appId: string) =>
    apiClient.put(`/job-posts/${id}/applications/${appId}/approve`),
  reject: (id: string, appId: string) =>
    apiClient.put(`/job-posts/${id}/applications/${appId}/reject`),
};

export const reviews = {
  getAll: () => apiClient.get("/reviews"),
  create: (data: any) => apiClient.post("/reviews", data),
  update: (id: string, data: any) => apiClient.put(`/reviews/${id}`, data),
  delete: (id: string) => apiClient.delete(`/reviews/${id}`),
};

export const subscriptions = {
  getAll: () => apiClient.get("/subscriptions"),
  create: (data: any) => apiClient.post("/subscriptions", data),
  update: (id: string, data: any) =>
    apiClient.put(`/subscriptions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/subscriptions/${id}`),
};

export const priceLists = {
  getAll: () => apiClient.get("/price-list"),
  create: (data: any) => apiClient.post("/price-list", data),
  update: (id: string, data: any) => apiClient.put(`/price-list/${id}`, data),
  delete: (id: string) => apiClient.delete(`/price-list/${id}`),
};

export const profiles = {
  getCustomer: () => apiClient.get("/customers/profile"),
  updateCustomer: (data: any) => apiClient.put("/customers/profile", data),
  getProvider: () => apiClient.get("/providers/profile"),
  updateProvider: (data: any) => apiClient.put("/providers/profile", data),
};

export const admin = {
  getPendingProviders: () => apiClient.get("/providers/pending"),
  approveProvider: (id: string) => apiClient.patch(`/providers/${id}/approve`),
  rejectProvider: (id: string) => apiClient.patch(`/providers/${id}/reject`),
  deleteProvider: (id: string) => apiClient.delete(`/providers/${id}`),
  getAllProvidersForAdmin: () => apiClient.get("/providers/admin/all"),
  updateProviderStatus: (id: string, isActive: boolean) =>
    apiClient.patch(`/providers/${id}`, { isActive }),
  getAllCustomers: () => apiClient.get("/customers"),
  getAllSubscriptions: () => apiClient.get("/subscriptions"),
  getAllReviews: () => apiClient.get("/reviews"),
  deleteReview: (id: string) => apiClient.delete(`/reviews/${id}`),
};

export const providers = {
  getProfile: () => apiClient.get("/providers/profile"),
  updateProfile: (data: any) => apiClient.put("/providers/profile", data),
  getReviews: () => apiClient.get("/providers/reviews"),
  getSubscription: () => apiClient.get("/providers/subscription"),
};

export default apiClient;
