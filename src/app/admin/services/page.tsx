"use client";
import { useEffect, useState } from "react";
import { services } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";

export default function AdminServicesPage() {
  const [serviceList, setServiceList] = useState([]);
  const [newService, setNewService] = useState({ name: "", category: "", description: "" });
  const { canManageServices } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!canManageServices) {
        // router.push("/"); // Optional: redirect if not authorized
        return;
    }
    loadServices();
  }, [canManageServices]);

  const loadServices = async () => {
    try {
      const res = await services.getAll();
      setServiceList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load services");
    }
  };

  const handleCreate = async () => {
    if (!newService.name || !newService.category) {
        toast.error("Name and Category are required");
        return;
    }
    try {
      await services.create(newService);
      toast.success("Service created");
      loadServices();
      setNewService({ name: "", category: "", description: "" });
    } catch (err) {
      toast.error("Failed to create service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await services.delete(id);
      toast.success("Service deleted");
      loadServices();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  if (!canManageServices) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Services</h1>
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
        <Input placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
        <Input placeholder="Category" value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} />
        <Input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
        <Button onClick={handleCreate}>Add Service</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {serviceList.map((service: any) => (
          <Card key={service._id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-primary mb-2">{service.category}</p>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(service._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
