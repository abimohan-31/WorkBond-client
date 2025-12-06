export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

