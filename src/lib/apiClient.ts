import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true, // Send cookies with all requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - httpOnly cookie (access_token) is sent automatically with withCredentials: true
// Backend checks cookie first, then Authorization header as fallback
apiClient.interceptors.request.use((config) => {
  // Token is stored in httpOnly cookie by backend, sent automatically
  // Optionally add to Authorization header as fallback (backend supports both)
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Handle 401, network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      // if (typeof window !== "undefined") {
      //   window.location.href = "/auth/login";
      // }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
