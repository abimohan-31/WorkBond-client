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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit2, Trash2 } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const [subList, setSubList] = useState<SubscriptionType[]>([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  const [newSub, setNewSub] = useState({
    provider_id: "",
    plan_name: "Free" as "Free" | "Standard" | "Premium",
    amount: "",
    end_date: "",
    start_date: "",
    renewal_date: "",
    status: "Active" as "Active" | "Expired" | "Cancelled",
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
        status: "Active",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create subscription");
    }
  };

  const handleStatusEdit = (subId: string, currentStatus: string) => {
    setEditingId(subId);
    setEditStatus(currentStatus);
  };

  const handleStatusUpdate = async (subId: string) => {
    setConfirmDialog({
      open: true,
      title: "Update Subscription Status",
      description: `Are you sure you want to change the status to ${editStatus}?`,
      onConfirm: async () => {
        try {
          await adminService.updateSubscriptionStatus(subId, editStatus);
          toast.success("Subscription status updated");
          setEditingId(null);
          loadSubs();
        } catch (error) {
          toast.error("Failed to update subscription status");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Subscription",
      description: "Are you sure you want to delete this subscription? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await subscriptionService.delete(id);
          toast.success("Subscription deleted");
          loadSubs();
        } catch (err) {
          toast.error("Failed to delete subscription");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

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
          <div className="grid gap-4 md:grid-cols-2">
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
              <label className="text-sm font-medium mb-2 block text-foreground">Amount *</label>
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
              <label className="text-sm font-medium mb-2 block text-foreground">End Date *</label>
              <Input
                type="date"
                value={newSub.end_date}
                onChange={(e) => setNewSub({ ...newSub, end_date: e.target.value })}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleCreate}>Create Subscription</Button>
            </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subList.map((sub: any) => (
            <Card key={sub._id}>
              <CardHeader>
                <CardTitle className="text-foreground">
                  {sub.plan_name} - ${sub.amount}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Provider: {typeof sub.provider_id === "object" ? sub.provider_id.name : "N/A"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {editingId === sub._id ? (
                    <div className="flex gap-2 flex-1">
                      <select
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <Button size="sm" onClick={() => handleStatusUpdate(sub._id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center flex-1">
                      <StatusBadge status={sub.status || "active"} />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusEdit(sub._id, sub.status)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(sub._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
