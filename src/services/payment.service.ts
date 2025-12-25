import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { PaymentSessionResponse, SubscriptionStatusResponse } from "@/types/payment";

export const paymentService = {
  createSubscriptionPayment: async (subscriptionId: string): Promise<ApiResponse<PaymentSessionResponse>> => {
    const response = await apiClient.post("/payments/subscription-payment", { subscriptionId });
    return response.data;
  },

  getSubscriptionStatus: async (): Promise<ApiResponse<SubscriptionStatusResponse>> => {
    const response = await apiClient.get("/payments/user-subscription");
    return response.data;
  },
};
