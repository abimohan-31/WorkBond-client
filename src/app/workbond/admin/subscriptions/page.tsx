"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/services/subscription.service";
import { adminService } from "@/services/admin.service";
import { SubscriptionType } from "@/types/subscription";
import { ProviderType } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const [subList, setSubList] = useState<SubscriptionType[]>([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState({ 
    provider_id: "", 
    plan_name: "Free" as "Free" | "Standard" | "Premium", 
    amount: "", 
    end_date: "",
    start_date: "",
    renewal_date: "",
    status: "Active" as "Active" | "Expired" | "Cancelled"
  });
  const { canManageSubscriptions } = usePermissions();

  useEffect(() => {
    if (user && user.role === "admin" && canManageSubscriptions) {
      loadSubs();
      loadProviders();
    }
  }, [user, canManageSubscriptions]);

  const loadProviders = async () => {
    try {
      const res = await adminService.getAllProviders();
      setProviders(res.data || []);
    } catch (err: any) {
      console.error("Error loading providers:", err);
    }
  };

  const loadSubs = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAll();
      // API returns: { success: true, data: [subscriptions array], pagination }
      // queryHelper returns data as direct array, not wrapped
      setSubList(res.data || []);
    } catch (err: any) {
      console.error("Error loading subscriptions:", err);
      toast.error(err.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newSub.provider_id || !newSub.plan_name || !newSub.amount || !newSub.end_date) {
        toast.error("Provider, Plan Name, Amount, and End Date are required");
        return;
    }
    try {
      const payload = {
        provider_id: newSub.provider_id,
        plan_name: newSub.plan_name,
        amount: Number(newSub.amount),
        end_date: newSub.end_date,
        start_date: newSub.start_date || undefined,
        renewal_date: newSub.renewal_date || undefined,
        status: newSub.status,
      };
      await subscriptionService.create(payload);
      toast.success("Subscription created");
      loadSubs();
      setNewSub({ 
        provider_id: "", 
        plan_name: "Free", 
        amount: "", 
        end_date: "",
        start_date: "",
        renewal_date: "",
        status: "Active"
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create subscription");
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      try {
          await subscriptionService.delete(id);
          toast.success("Subscription deleted");
          loadSubs();
      } catch (err) {
          toast.error("Failed to delete subscription");
      }
  }

  if (!user || user.role !== "admin" || !canManageSubscriptions) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Manage Subscriptions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Create New Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Provider *</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                value={newSub.provider_id}
                onChange={(e) => setNewSub({ ...newSub, provider_id: e.target.value })}
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name} ({provider.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Plan Name *</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                value={newSub.plan_name}
                onChange={(e) => setNewSub({ ...newSub, plan_name: e.target.value as "Free" | "Standard" | "Premium" })}
              >
                <option value="Free">Free</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Amount (LKR) *</label>
              <Input 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="0.00" 
                value={newSub.amount} 
                onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })} 
                className="bg-background border-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Start Date</label>
              <Input 
                type="date" 
                value={newSub.start_date} 
                onChange={(e) => setNewSub({ ...newSub, start_date: e.target.value })} 
                className="bg-background border-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">End Date *</label>
              <Input 
                type="date" 
                value={newSub.end_date} 
                onChange={(e) => setNewSub({ ...newSub, end_date: e.target.value })} 
                className="bg-background border-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Renewal Date</label>
              <Input 
                type="date" 
                value={newSub.renewal_date} 
                onChange={(e) => setNewSub({ ...newSub, renewal_date: e.target.value })} 
                className="bg-background border-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                value={newSub.status}
                onChange={(e) => setNewSub({ ...newSub, status: e.target.value as "Active" | "Expired" | "Cancelled" })}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <Button onClick={handleCreate}>Create Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      ) : subList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No subscriptions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {subList.map((sub: any) => (
            <Card key={sub._id}>
              <CardHeader>
                <CardTitle className="text-foreground">{sub.plan_name} - ${sub.amount}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  Provider: {typeof sub.provider_id === 'object' ? sub.provider_id.name : 'N/A'}
                </p>
                <p className="mb-2 text-foreground">
                  Duration: {sub.end_date && sub.start_date 
                    ? Math.ceil((new Date(sub.end_date).getTime() - new Date(sub.start_date).getTime()) / (1000 * 60 * 60 * 24)) 
                    : sub.end_date 
                    ? Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : 'N/A'} days
                </p>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={sub.status || "active"} />
                </div>
                <Button variant="destructive" size="sm" className="mt-4 w-full" onClick={() => handleDelete(sub._id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
