export interface SubscriptionType {
  _id: string;
  provider_id: string | any; // ProviderType (populated)
  plan_name: "Free" | "Standard" | "Premium";
  start_date: string;
  end_date: string;
  renewal_date?: string;
  status: "Active" | "Expired" | "Cancelled";
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionData {
  provider_id: string;
  plan_name: "Free" | "Standard" | "Premium";
  start_date?: string;
  end_date: string;
  renewal_date?: string;
  status?: "Active" | "Expired" | "Cancelled";
  amount: number;
}

export interface UpdateSubscriptionData {
  plan_name?: "Free" | "Standard" | "Premium";
  start_date?: string;
  end_date?: string;
  renewal_date?: string;
  status?: "Active" | "Expired" | "Cancelled";
  amount?: number;
}

