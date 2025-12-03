"use client";
import { useEffect, useState } from "react";
import { priceLists, services } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminPriceListsPage() {
  const [list, setList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [newItem, setNewItem] = useState({ serviceId: "", price: "", description: "" });
  const { canManagePriceLists } = usePermissions();

  useEffect(() => {
    if (canManagePriceLists) {
        loadData();
        loadServices();
    }
  }, [canManagePriceLists]);

  const loadData = async () => {
    try {
      const res = await priceLists.getAll();
      setList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load price lists");
    }
  };

  const loadServices = async () => {
      try {
          const res = await services.getAll();
          setServiceList(res.data.data || []);
      } catch (err) {
          console.error(err);
      }
  }

  const handleCreate = async () => {
    if (!newItem.serviceId || !newItem.price) {
        toast.error("Service and Price are required");
        return;
    }
    try {
      await priceLists.create({ ...newItem, price: Number(newItem.price) });
      toast.success("Price list item created");
      loadData();
      setNewItem({ serviceId: "", price: "", description: "" });
    } catch (err) {
      toast.error("Failed to create item");
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      try {
          await priceLists.delete(id);
          toast.success("Item deleted");
          loadData();
      } catch (err) {
          toast.error("Failed to delete item");
      }
  }

  if (!canManagePriceLists) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Price Lists</h1>
      <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Select onValueChange={(val) => setNewItem({ ...newItem, serviceId: val })} value={newItem.serviceId}>
            <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
            <SelectContent>
                {serviceList.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
            </SelectContent>
        </Select>
        <Input placeholder="Price" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
        <Input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
        <Button onClick={handleCreate}>Add Item</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((item: any) => (
          <Card key={item._id}>
            <CardHeader><CardTitle>{item.service?.name || "Unknown Service"}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">${item.price}</div>
              <p className="text-muted-foreground">{item.description}</p>
              <Button variant="destructive" size="sm" className="mt-4" onClick={() => handleDelete(item._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
