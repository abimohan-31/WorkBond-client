"use client";
import { useEffect, useState } from "react";
import { subscriptions } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProviderSubscriptionsPage() {
  const [subList, setSubList] = useState([]);
  const { canViewSubscriptions } = usePermissions();

  useEffect(() => {
    if (canViewSubscriptions) loadSubs();
  }, [canViewSubscriptions]);

  const loadSubs = async () => {
    try {
      const res = await subscriptions.getAll();
      setSubList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load subscriptions");
    }
  };

  const handleSubscribe = (id: string) => {
      toast.info("Subscription flow to be implemented with payment gateway.");
  }

  if (!canViewSubscriptions) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription Plans</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {subList.map((sub: any) => (
          <Card key={sub._id} className="flex flex-col">
            <CardHeader><CardTitle>{sub.name}</CardTitle></CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="text-3xl font-bold mb-4">${sub.price}</div>
              <p className="mb-4 text-muted-foreground">{sub.duration} days access</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground mb-6 flex-1">
                  {sub.features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
              <Button onClick={() => handleSubscribe(sub._id)}>Subscribe Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
