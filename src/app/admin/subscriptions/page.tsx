"use client";
import { useEffect, useState } from "react";
import { subscriptions } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminSubscriptionsPage() {
  const [subList, setSubList] = useState([]);
  const [newSub, setNewSub] = useState({ name: "", price: "", duration: "", features: "" });
  const { canManageSubscriptions } = usePermissions();

  useEffect(() => {
    if (canManageSubscriptions) loadSubs();
  }, [canManageSubscriptions]);

  const loadSubs = async () => {
    try {
      const res = await subscriptions.getAll();
      setSubList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load subscriptions");
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

  if (!canManageSubscriptions) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Subscriptions</h1>
      <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Input placeholder="Name" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} />
        <Input placeholder="Price" type="number" value={newSub.price} onChange={(e) => setNewSub({ ...newSub, price: e.target.value })} />
        <Input placeholder="Duration (days)" type="number" value={newSub.duration} onChange={(e) => setNewSub({ ...newSub, duration: e.target.value })} />
        <Input placeholder="Features (comma separated)" value={newSub.features} onChange={(e) => setNewSub({ ...newSub, features: e.target.value })} />
        <Button onClick={handleCreate}>Create Plan</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {subList.map((sub: any) => (
          <Card key={sub._id}>
            <CardHeader><CardTitle>{sub.name} - ${sub.price}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2">{sub.duration} days</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                  {sub.features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
              <Button variant="destructive" size="sm" className="mt-4" onClick={() => handleDelete(sub._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
