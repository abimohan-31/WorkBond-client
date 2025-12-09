"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { serviceService } from "@/services/service.service";
import { ServiceType } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Gardening",
  "Moving",
  "Handyman",
  "Other",
];
const units = ["hour", "day", "project", "item", "1 square feet"];

export default function AdminServicesPage() {
  const { user } = useAuth();
  const [serviceList, setServiceList] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    category: "Cleaning",
    base_price: 0,
    unit: "hour",
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      setLoading(true);
      // Admin should see all services (active and inactive)
      // Pass isActive=false to override default filter, or pass empty to get all
      const res = await serviceService.getAll();
      // API returns: { success: true, data: [services array], pagination }
      // queryHelper returns data as direct array, not wrapped in { services: [] }
      setServiceList(res.data || []);
    } catch (error: any) {
      console.error("Error loading services:", error);
      toast.error(error.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (
      !newService.name ||
      !newService.description ||
      newService.base_price <= 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await serviceService.create(newService);
      toast.success("Service created successfully");
      setIsCreateDialogOpen(false);
      setNewService({
        name: "",
        description: "",
        category: "Cleaning",
        base_price: 0,
        unit: "hour",
      });
      loadServices();
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(error.response?.data?.message || "Failed to create service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await serviceService.delete(id);
      toast.success("Service deleted");
      loadServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Manage Services</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Service Name *</label>
                <Input
                  placeholder="e.g., House Cleaning"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Category *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({ ...newService, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description *</label>
                <Textarea
                  placeholder="Describe the service..."
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Base Price (LKR) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.base_price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        base_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Unit *</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                    value={newService.unit}
                    onChange={(e) =>
                      setNewService({ ...newService, unit: e.target.value })
                    }
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      ) : serviceList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No services created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service) => (
            <Card key={service._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize text-foreground">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.category}
                    </p>
                  </div>
                  <StatusBadge status={service.isActive ? "active" : "inactive"} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  {service.description}
                </p>
                <div className="border-t pt-3 mb-3">
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="text-lg font-bold text-primary">
                    LKR {service.base_price}/{service.unit}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(service._id)}
                >
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
