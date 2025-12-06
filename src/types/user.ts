export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "provider" | "customer";
  isApproved?: boolean;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: "customer" | "provider" | "admin";
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
  phone?: string;
  address?: string;
  experience_years?: number;
  skills?: string[];
}

