export interface WorkPostType {
  _id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  providerId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        skills: string[];
        rating: number;
        profileImage?: string;
      };
  jobPostId?: string | { _id: string; title: string; description: string };
  service_id?: string | { _id: string; name: string; category: string };
  customerId?: string | { _id: string; name: string; email: string };
  completedAt: string;
  customerFeedback?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkPostData {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  jobPostId?: string;
  isPublic?: boolean;
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
  workPosts?: WorkPostType[];
  role: string;
  isApproved: boolean;
  account_status?: "active" | "inactive";
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
  workPosts?: WorkPostType[];
  isActive?: boolean;
}

export interface UpdateWorkPostData {
  title?: string;
  description?: string;
  category?: string;
  isPublic?: boolean;
}
