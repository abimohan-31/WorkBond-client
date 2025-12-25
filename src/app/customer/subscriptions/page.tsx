"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/payment.service";
import { subscriptionService } from "@/services/subscription.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Check, Loader2, Sparkles, Shield, User } from "lucide-react";

const CUSTOMER_PLANS = [
  {
    name: "Individual",
    price: 1000.00,
    features: ["Post up to 5 jobs", "Standard support", "1-month validity"],
  },
  {
    name: "Business",
    price: 1500.00,
    features: ["Unlimited job posts", "Priority support", "Featured listings", "3-month validity"],
  }
];

export default function CustomerSubscriptionsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getSubscriptionStatus();
      setStatus(res.data);
    } catch (err: any) {
      console.error("Error loading status:", err);
      toast.error("Failed to load subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: any) => {
    try {
      setSubmitting(true);
      const res = await subscriptionService.subscribeUser(plan.name, plan.price);
      
      if (res.success && res.data?._id) {
        toast.info("Redirecting to checkout...");
        const paymentRes = await paymentService.createSubscriptionPayment(res.data._id);
        if (paymentRes.success && paymentRes.data?.url) {
          window.location.href = paymentRes.data.url;
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate subscription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeSub = status?.activeSubscription;
  const createdAt = (user as any)?.createdAt || new Date();
  const trialExpiration = new Date(new Date(createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);
  const isTrialActive = trialExpiration ? new Date() < trialExpiration : false;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Subscription Plans</h1>
        <p className="text-lg text-muted-foreground">Choose a plan that works best for your needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="md:sticky md:top-24 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Your Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Trial Status</span>
                <StatusBadge 
                  status={isTrialActive ? 'Active' : 'Expired'} 
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trial Expires</span>
                <span>{trialExpiration?.toLocaleDateString()}</span>
              </div>
            </div>

            {activeSub ? (
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-bold">Active: {activeSub.plan_name}</span>
                  </div>
                  <StatusBadge status="Paid" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-primary/10">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(activeSub.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(activeSub.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center py-8">
                <p className="text-amber-600 font-medium">No Active Paid Subscription</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {!isTrialActive ? 'Your trial has expired. Subscribe to continue posting jobs.' : 'Subscribe now to ensure uninterrupted service after trial.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {CUSTOMER_PLANS.map((plan) => (
            <Card key={plan.name} className="hover:border-primary/40 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">LKR {plan.price.toFixed(2)}</div>
                </div>
                <CardDescription>Perfect for {plan.name === 'Individual' ? 'occasional job posts' : 'regular hiring needs'}.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-12 text-lg font-bold" 
                  onClick={() => handleSubscribe(plan)}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Select {plan.name} Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
