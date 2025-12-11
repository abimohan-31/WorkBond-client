"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { priceListService } from "@/services/priceList.service";
import { serviceService } from "@/services/service.service";
import { PriceListType } from "@/types/priceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit2, Trash2 } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  category: string;
}

const priceTypes = ["fixed", "per_unit", "range"];
const units = ["hour", "day", "project", "item", "square_feet", "square_meter"];

export default function AdminPriceListsPage() {
  const { user } = useAuth();
  const [priceListData, setPriceListData] = useState<PriceListType[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<any>(null);
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
  const [newPriceList, setNewPriceList] = useState({
    service_id: "",
    price_type: "fixed" as "fixed" | "per_unit" | "range",
    fixed_price: 0,
    unit_price: 0,
    unit: "hour",
    min_price: 0,
    max_price: 0,
    description: "",
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [priceListsRes, servicesRes] = await Promise.all([
        priceListService.getAll(),
        serviceService.getAll(),
      ]);
      setPriceListData(priceListsRes.data || []);
      setServicesList(servicesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load price lists");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newPriceList.service_id) {
      toast.error("Please select a service");
      return;
    }

    const payload: any = {
      service_id: newPriceList.service_id,
      price_type: newPriceList.price_type,
      description: newPriceList.description,
    };

    if (newPriceList.price_type === "fixed") {
      if (newPriceList.fixed_price <= 0) {
        toast.error("Fixed price must be greater than 0");
        return;
      }
      payload.fixed_price = newPriceList.fixed_price;
    } else if (newPriceList.price_type === "per_unit") {
      if (newPriceList.unit_price <= 0) {
        toast.error("Unit price must be greater than 0");
        return;
      }
      payload.unit_price = newPriceList.unit_price;
      payload.unit = newPriceList.unit;
    } else if (newPriceList.price_type === "range") {
      if (newPriceList.min_price <= 0 || newPriceList.max_price <= 0) {
        toast.error("Min and max prices must be greater than 0");
        return;
      }
      if (newPriceList.min_price >= newPriceList.max_price) {
        toast.error("Min price must be less than max price");
        return;
      }
      payload.min_price = newPriceList.min_price;
      payload.max_price = newPriceList.max_price;
    }

    try {
      await priceListService.create(payload);
      toast.success("Price list created successfully");
      setIsCreateDialogOpen(false);
      setNewPriceList({
        service_id: "",
        price_type: "fixed",
        fixed_price: 0,
        unit_price: 0,
        unit: "hour",
        min_price: 0,
        max_price: 0,
        description: "",
      });
      fetchData();
    } catch (error: any) {
      console.error("Error creating price list:", error);
      toast.error(error.response?.data?.message || "Failed to create price list");
    }
  };

  const handleEdit = (priceList: any) => {
    setEditingPriceList({
      _id: priceList._id,
      service_id: typeof priceList.service_id === "object" ? priceList.service_id._id : priceList.service_id,
      price_type: priceList.price_type,
      fixed_price: priceList.fixed_price || 0,
      unit_price: priceList.unit_price || 0,
      unit: priceList.unit || "hour",
      min_price: priceList.min_price || 0,
      max_price: priceList.max_price || 0,
      description: priceList.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    const payload: any = {
      price_type: editingPriceList.price_type,
      description: editingPriceList.description,
    };

    if (editingPriceList.price_type === "fixed") {
      payload.fixed_price = editingPriceList.fixed_price;
    } else if (editingPriceList.price_type === "per_unit") {
      payload.unit_price = editingPriceList.unit_price;
      payload.unit = editingPriceList.unit;
    } else if (editingPriceList.price_type === "range") {
      payload.min_price = editingPriceList.min_price;
      payload.max_price = editingPriceList.max_price;
    }

    setConfirmDialog({
      open: true,
      title: "Update Price List",
      description: "Are you sure you want to update this price list?",
      onConfirm: async () => {
        try {
          await priceListService.update(editingPriceList._id, payload);
          toast.success("Price list updated successfully");
          setIsEditDialogOpen(false);
          setEditingPriceList(null);
          fetchData();
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update price list");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Price List",
      description: "Are you sure you want to delete this price list? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await priceListService.delete(id);
          toast.success("Price list deleted");
          fetchData();
        } catch (error: any) {
          console.error("Error deleting price list:", error);
          toast.error("Failed to delete price list");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const getPriceDisplay = (priceList: PriceListType) => {
    if (priceList.price_type === "fixed") {
      return `$${priceList.fixed_price} (Fixed)`;
    } else if (priceList.price_type === "per_unit") {
      return `$${priceList.unit_price}/${priceList.unit}`;
    } else if (priceList.price_type === "range") {
      return `$${priceList.min_price} - $${priceList.max_price}`;
    }
    return "N/A";
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  const renderPriceFields = (data: any, setData: any) => (
    <>
      {data.price_type === "fixed" && (
        <div>
          <label className="text-sm font-medium text-foreground">Fixed Price *</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={data.fixed_price}
            onChange={(e) => setData({ ...data, fixed_price: parseFloat(e.target.value) || 0 })}
            className="bg-background border-input text-foreground"
          />
        </div>
      )}
      {data.price_type === "per_unit" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Unit Price *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.unit_price}
              onChange={(e) => setData({ ...data, unit_price: parseFloat(e.target.value) || 0 })}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Unit *</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
              value={data.unit}
              onChange={(e) => setData({ ...data, unit: e.target.value })}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {data.price_type === "range" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Min Price *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.min_price}
              onChange={(e) => setData({ ...data, min_price: parseFloat(e.target.value) || 0 })}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Max Price *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={data.max_price}
              onChange={(e) => setData({ ...data, max_price: parseFloat(e.target.value) || 0 })}
              className="bg-background border-input text-foreground"
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Manage Price Lists</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Price List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Price List</DialogTitle>
              <DialogDescription>Add pricing information for a service</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Service *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newPriceList.service_id}
                  onChange={(e) => setNewPriceList({ ...newPriceList, service_id: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {servicesList.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} ({service.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Price Type *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newPriceList.price_type}
                  onChange={(e) => setNewPriceList({ ...newPriceList, price_type: e.target.value as any })}
                >
                  {priceTypes.map((type) => (
                    <option key={type} value={type}>{type.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>
              {renderPriceFields(newPriceList, setNewPriceList)}
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Optional description..."
                  value={newPriceList.description}
                  onChange={(e) => setNewPriceList({ ...newPriceList, description: e.target.value })}
                  rows={2}
                  className="bg-background border-input text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Price List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading price lists...</p>
        </div>
      ) : priceListData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No price lists created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create First Price List</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceListData.map((priceList) => (
            <Card key={priceList._id}>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  {typeof priceList.service_id === "object" ? priceList.service_id.name : "Service"}
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {priceList.price_type.replace("_", " ")}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold text-primary">{getPriceDisplay(priceList)}</p>
                {priceList.description && (
                  <p className="text-sm text-muted-foreground">{priceList.description}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(priceList)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(priceList._id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Price List</DialogTitle>
            <DialogDescription>Update pricing information</DialogDescription>
          </DialogHeader>
          {editingPriceList && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Price Type *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={editingPriceList.price_type}
                  onChange={(e) => setEditingPriceList({ ...editingPriceList, price_type: e.target.value })}
                >
                  {priceTypes.map((type) => (
                    <option key={type} value={type}>{type.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>
              {renderPriceFields(editingPriceList, setEditingPriceList)}
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Optional description..."
                  value={editingPriceList.description}
                  onChange={(e) => setEditingPriceList({ ...editingPriceList, description: e.target.value })}
                  rows={2}
                  className="bg-background border-input text-foreground"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Price List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
