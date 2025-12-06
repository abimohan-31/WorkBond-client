export interface WorkImage {
  title: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  category?: string;
  jobPostId?: string;
  completedAt?: string;
  _id?: string;
}

export interface ProviderType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: "Available" | "Unavailable";
  rating: number;
  profileImage?: string;
  workImages?: WorkImage[];
  role: string;
  isApproved: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProviderData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
}

export interface UpdateProviderData {
  name?: string;
  phone?: string;
  address?: string;
  experience_years?: number;
  skills?: string[];
  availability_status?: "Available" | "Unavailable";
  profileImage?: string;
  workImages?: WorkImage[];
  isActive?: boolean;
}

