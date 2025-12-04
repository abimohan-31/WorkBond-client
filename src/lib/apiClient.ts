import axios from "axios";
import { toast } from "sonner";

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
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export const services = {
  getAll: () => apiClient.get("/services"),
  getById: (id: string) => apiClient.get(`/services/${id}`),
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
  approve: (id: string, appId: string) => apiClient.put(`/job-posts/${id}/applications/${appId}/approve`),
  reject: (id: string, appId: string) => apiClient.put(`/job-posts/${id}/applications/${appId}/reject`),
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
  update: (id: string, data: any) => apiClient.put(`/subscriptions/${id}`, data),
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
  getPendingProviders: () => apiClient.get("/admins/providers/pending"),
  approveProvider: (id: string) => apiClient.patch(`/admins/providers/${id}/approve`),
  rejectProvider: (id: string) => apiClient.patch(`/admins/providers/${id}/reject`),
  deleteProvider: (id: string) => apiClient.delete(`/admins/providers/${id}`),
  getAllProviders: () => apiClient.get("/admins/providers"),
  updateProviderStatus: (id: string, isActive: boolean) => apiClient.patch(`/admins/providers/${id}`, { isActive }),
  getAllCustomers: () => apiClient.get("/admins/customers"),
  getAllSubscriptions: () => apiClient.get("/admins/subscriptions"),
  getAllReviews: () => apiClient.get("/admins/reviews"),
  deleteReview: (id: string) => apiClient.delete(`/admins/reviews/${id}`),
};

export const providers = {
  getProfile: () => apiClient.get("/providers/profile"),
  updateProfile: (data: any) => apiClient.put("/providers/profile", data),
  getReviews: () => apiClient.get("/providers/reviews"),
  getSubscription: () => apiClient.get("/providers/subscription"),
};

export default apiClient;
