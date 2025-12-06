export interface ServiceType {
  _id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  unit: string;
  isActive: boolean;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  category: string;
  base_price: number;
  unit: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  category?: string;
  base_price?: number;
  unit?: string;
}

