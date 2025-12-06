import apiClient from "@/lib/apiClient";
import { PriceListType, CreatePriceListData, UpdatePriceListData } from "@/types/priceList";
import { ApiResponse } from "@/types/api";

export const priceListService = {
  getAll: async (filters?: any): Promise<ApiResponse<PriceListType[]>> => {
    const response = await apiClient.get("/price-list", { params: filters });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<PriceListType>> => {
    const response = await apiClient.get(`/price-list/${id}`);
    return response.data;
  },
  create: async (data: CreatePriceListData): Promise<ApiResponse<PriceListType>> => {
    const response = await apiClient.post("/price-list", data);
    return response.data;
  },
  update: async (id: string, data: Partial<UpdatePriceListData>): Promise<ApiResponse<PriceListType>> => {
    const response = await apiClient.put(`/price-list/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/price-list/${id}`);
    return response.data;
  },
};

