"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/provider/subscriptions");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for subscribing! Your payment has been processed successfully.
          </p>
          <p className="text-sm text-muted-foreground">
            Your subscription is now active and you can start creating work posts.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground">
              Session ID: {sessionId}
            </p>
          )}
          <div className="pt-4">
            <Button onClick={() => router.push("/provider/subscriptions")}>
              View Subscription Details
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Redirecting to subscriptions page in 5 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
