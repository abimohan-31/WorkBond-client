import apiClient from "../apiClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api" ;

export const auth = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "provider";
    phone?: string;
    address?: string;
    experience_years?: number;
    skills?: string[];
  }) => {
    return apiClient.post("/users/register", data);
  },

  login: async (data: {
    email: string;
    password: string;
    role: "customer" | "provider" | "admin";
  }) => {
    return apiClient.post("/users/login", data);
  },

  logout: async () => {
    return apiClient.post("/users/logout");
  },
};
