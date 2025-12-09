"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { serviceService } from "@/services/service.service";
import { ServiceType } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    category: "Cleaning",
    base_price: 0,
    unit: "hour",
    icon: "",
  });
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === "admin") {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getAll();
      setServiceList(res.data || []);
    } catch (error: any) {
      console.error("Error loading services:", error);
      toast.error(error.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "WorkBond");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setNewService({ ...newService, icon: data.secure_url });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "WorkBond");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url && editingService) {
        setEditingService({ ...editingService, icon: data.secure_url });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
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
        icon: "",
      });
      loadServices();
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(error.response?.data?.message || "Failed to create service");
    }
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    try {
      await serviceService.update(editingService._id, editingService);
      toast.success("Service updated successfully");
      setIsEditDialogOpen(false);
      setEditingService(null);
      loadServices();
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.message || "Failed to update service");
    }
  };

  const openEditDialog = (service: ServiceType) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-1/3">
                  <label className="text-sm font-medium text-foreground block mb-2">Service Icon</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative">
                    {newService.icon ? (
                      <div className="relative aspect-square w-full">
                        <img 
                          src={newService.icon} 
                          alt="Service icon" 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          onClick={() => setNewService({ ...newService, icon: "" })}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <p className="text-sm text-muted-foreground mb-2">
                          {uploading ? "Uploading..." : "Click to upload"}
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-2/3 space-y-4">
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
                </div>
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
              <Button onClick={handleCreate} disabled={uploading}>
                {uploading ? "Uploading..." : "Create Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-1/3">
                  <label className="text-sm font-medium text-foreground block mb-2">Service Icon</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative">
                    {editingService.icon ? (
                      <div className="relative aspect-square w-full">
                        <img 
                          src={editingService.icon} 
                          alt="Service icon" 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          onClick={() => setEditingService({ ...editingService, icon: "" })}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <p className="text-sm text-muted-foreground mb-2">
                          {uploading ? "Uploading..." : "Click to upload"}
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-2/3 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Service Name *</label>
                    <Input
                      placeholder="e.g., House Cleaning"
                      value={editingService.name}
                      onChange={(e) =>
                        setEditingService({ ...editingService, name: e.target.value })
                      }
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Category *</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                      value={editingService.category}
                      onChange={(e) =>
                        setEditingService({ ...editingService, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Description *</label>
                <Textarea
                  placeholder="Describe the service..."
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
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
                    value={editingService.base_price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
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
                    value={editingService.unit}
                    onChange={(e) =>
                      setEditingService({ ...editingService, unit: e.target.value })
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
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={uploading}>
              {uploading ? "Uploading..." : "Update Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Card key={service._id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted relative">
                {service.icon ? (
                  <img 
                    src={service.icon} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={service.isActive ? "active" : "inactive"} />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="capitalize text-foreground">{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {service.category}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="border-t pt-3 mb-3">
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="text-lg font-bold text-primary">
                    LKR {service.base_price}/{service.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(service)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(service._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
