export interface PaymentSessionResponse {
  sessionId: string;
  url: string;
}

export interface SubscriptionStatusResponse {
  activeSubscription: {
    _id: string;
    provider_id: string;
    plan_name: string;
    start_date: string;
    end_date: string;
    status: string;
    amount: number;
    paymentStatus: string;
    paidAt: string | null;
  } | null;
  pendingSubscription: {
    _id: string;
    provider_id: string;
    plan_name: string;
    start_date: string;
    end_date: string;
    status: string;
    amount: number;
    paymentStatus: string;
  } | null;
  allSubscriptions: any[];
}
