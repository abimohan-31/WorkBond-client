"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscriptions } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const [subList, setSubList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState({ name: "", price: "", duration: "", features: "" });
  const { canManageSubscriptions } = usePermissions();

  useEffect(() => {
    if (user && user.role === "admin" && canManageSubscriptions) {
      loadSubs();
    }
  }, [user, canManageSubscriptions]);

  const loadSubs = async () => {
    try {
      setLoading(true);
      const res = await subscriptions.getAll();
      // API returns: { success: true, data: [subscriptions array], pagination }
      // queryHelper returns data as direct array, not wrapped
      setSubList(res.data.data || []);
    } catch (err: any) {
      console.error("Error loading subscriptions:", err);
      toast.error(err.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newSub.name || !newSub.price) {
        toast.error("Name and Price are required");
        return;
    }
    try {
      const featuresArray = newSub.features.split(",").map(f => f.trim());
      await subscriptions.create({ ...newSub, price: Number(newSub.price), duration: Number(newSub.duration), features: featuresArray });
      toast.success("Subscription created");
      loadSubs();
      setNewSub({ name: "", price: "", duration: "", features: "" });
    } catch (err) {
      toast.error("Failed to create subscription");
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      try {
          await subscriptions.delete(id);
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
      <h1 className="text-3xl font-bold">Manage Subscriptions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input placeholder="Plan Name" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} />
            <Input placeholder="Price" type="number" value={newSub.price} onChange={(e) => setNewSub({ ...newSub, price: e.target.value })} />
            <Input placeholder="Duration (days)" type="number" value={newSub.duration} onChange={(e) => setNewSub({ ...newSub, duration: e.target.value })} />
            <Input placeholder="Features (comma separated)" value={newSub.features} onChange={(e) => setNewSub({ ...newSub, features: e.target.value })} />
            <Button onClick={handleCreate}>Create Plan</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      ) : subList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No subscriptions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {subList.map((sub: any) => (
            <Card key={sub._id}>
              <CardHeader>
                <CardTitle>{sub.plan_name} - ${sub.amount}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-gray-600">
                  Provider: {typeof sub.provider_id === 'object' ? sub.provider_id.name : 'N/A'}
                </p>
                <p className="mb-2">
                  Duration: {sub.end_date && sub.start_date 
                    ? Math.ceil((new Date(sub.end_date).getTime() - new Date(sub.start_date).getTime()) / (1000 * 60 * 60 * 24)) 
                    : 'N/A'} days
                </p>
                <p className="mb-2 text-sm">
                  Status: <span className={`font-semibold ${sub.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {sub.status || 'N/A'}
                  </span>
                </p>
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
