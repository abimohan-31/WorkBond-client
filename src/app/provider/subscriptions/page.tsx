"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { toast } from "sonner";
import { Loader2, Check, CreditCard } from "lucide-react";

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Standard",
    price: 29.99,
    features: [
      "First month FREE",
      "Post unlimited work showcases",
      "Apply to customer job posts",
      "Basic profile visibility",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: 49.99,
    recommended: true,
    features: [
      "First month FREE",
      "All Standard features",
      "Featured profile placement",
      "Priority job notifications",
      "Advanced analytics",
      "Priority support",
    ],
  },
];

export default function ProviderSubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getSubscriptionStatus();
      if (response.success) {
        setSubscriptionStatus(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching subscription status:", error);
      toast.error("Failed to load subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setSubscribing(plan.name);

      const subscriptionResponse = await subscriptionService.createProviderSubscription(
        plan.name,
        0
      );

      if (!subscriptionResponse.success) {
        throw new Error(subscriptionResponse.message || "Failed to create subscription");
      }

      toast.success("Subscription activated! First month is free.");
      setTimeout(() => {
        router.push("/provider/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error subscribing:", error);
      toast.error(error.message || "Failed to start subscription process");
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasActiveSubscription = subscriptionStatus?.activeSubscription;
  const hasPendingSubscription = subscriptionStatus?.pendingSubscription;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose a plan to start posting your work and applying to jobs
        </p>
      </div>

      {hasActiveSubscription && (
        <AlertBanner
          type="success"
          title="Active Subscription"
          message={`You have an active ${subscriptionStatus.activeSubscription.plan_name} subscription until ${new Date(
            subscriptionStatus.activeSubscription.end_date
          ).toLocaleDateString()}`}
          className="mb-6"
        />
      )}

      {hasPendingSubscription && !hasActiveSubscription && (
        <AlertBanner
          type="warning"
          title="Pending Payment"
          message="You have a pending subscription. Please complete the payment to activate your subscription."
          className="mb-6"
        />
      )}

      {!hasActiveSubscription && !hasPendingSubscription && (
        <AlertBanner
          type="info"
          title="First Month Free!"
          message="Start your subscription today and enjoy the first month completely free. No payment required to get started."
          className="mb-6"
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={plan.recommended ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.recommended && (
                  <Badge variant="default">Recommended</Badge>
                )}
              </div>
              <CardDescription>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-green-600">FREE</span>
                  <span className="text-muted-foreground"> first month</span>
                </div>
                <div>
                  <span className="text-xl font-semibold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month after</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(plan)}
                disabled={
                  subscribing !== null ||
                  (hasActiveSubscription &&
                    subscriptionStatus.activeSubscription.plan_name === plan.name)
                }
              >
                {subscribing === plan.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : hasActiveSubscription &&
                  subscriptionStatus.activeSubscription.plan_name === plan.name ? (
                  "Current Plan"
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Start Free Month
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">
                  {subscriptionStatus.activeSubscription.plan_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="default">
                  {subscriptionStatus.activeSubscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold">
                  {new Date(
                    subscriptionStatus.activeSubscription.start_date
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-semibold">
                  {new Date(
                    subscriptionStatus.activeSubscription.end_date
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">
                  ${subscriptionStatus.activeSubscription.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant="default">
                  {subscriptionStatus.activeSubscription.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
