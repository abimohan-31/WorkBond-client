export interface ReviewType {
  _id: string;
  customer_id: string | any; // CustomerType
  provider_id: string | any; // ProviderType
  rating: number;
  comment: string;
  review_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewData {
  provider_id: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

