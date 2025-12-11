export interface CustomerType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  profileImage?: string;
  role: string;
  account_status?: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerData {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

