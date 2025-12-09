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

      // API returns: { success: true, data: [priceLists array], pagination }
      // queryHelper returns data as direct array, not wrapped in { priceLists: [] }
      setPriceListData(priceListsRes.data || []);
      // Services API also returns data as direct array
      setServicesList(servicesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(
        error.response?.data?.message || "Failed to load price lists"
      );
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
      toast.error(
        error.response?.data?.message || "Failed to create price list"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this price list?")) return;

    try {
      await priceListService.delete(id);
      toast.success("Price list deleted");
      fetchData();
    } catch (error: any) {
      console.error("Error deleting price list:", error);
      toast.error("Failed to delete price list");
    }
  };

  const getPriceDisplay = (priceList: PriceListType) => {
    if (priceList.price_type === "fixed") {
      return `LKR${priceList.fixed_price} (Fixed)`;
    } else if (priceList.price_type === "per_unit") {
      return `LKR${priceList.unit_price}/${priceList.unit}`;
    } else if (priceList.price_type === "range") {
      return `LKR${priceList.min_price} - LKR${priceList.max_price}`;
    }
    return "N/A";
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Manage Price Lists
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Price List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Price List</DialogTitle>
              <DialogDescription>
                Add pricing information for a service
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Service *
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newPriceList.service_id}
                  onChange={(e) =>
                    setNewPriceList({
                      ...newPriceList,
                      service_id: e.target.value,
                    })
                  }
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
                <label className="text-sm font-medium text-foreground">
                  Price Type *
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newPriceList.price_type}
                  onChange={(e) =>
                    setNewPriceList({
                      ...newPriceList,
                      price_type: e.target.value as any,
                    })
                  }
                >
                  {priceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {newPriceList.price_type === "fixed" && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Fixed Price (LKR) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPriceList.fixed_price}
                    onChange={(e) =>
                      setNewPriceList({
                        ...newPriceList,
                        fixed_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-background border-input text-foreground"
                  />
                </div>
              )}

              {newPriceList.price_type === "per_unit" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Unit Price (LKR) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPriceList.unit_price}
                      onChange={(e) =>
                        setNewPriceList({
                          ...newPriceList,
                          unit_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Unit *
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                      value={newPriceList.unit}
                      onChange={(e) =>
                        setNewPriceList({
                          ...newPriceList,
                          unit: e.target.value,
                        })
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
              )}

              {newPriceList.price_type === "range" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Min Price (LKR) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPriceList.min_price}
                      onChange={(e) =>
                        setNewPriceList({
                          ...newPriceList,
                          min_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Max Price (LKR) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPriceList.max_price}
                      onChange={(e) =>
                        setNewPriceList({
                          ...newPriceList,
                          max_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="Optional description..."
                  value={newPriceList.description}
                  onChange={(e) =>
                    setNewPriceList({
                      ...newPriceList,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="bg-background border-input text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
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
            <p className="text-muted-foreground mb-4">
              No price lists created yet
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Price List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceListData.map((priceList) => (
            <Card key={priceList._id}>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  {typeof priceList.service_id === "object"
                    ? priceList.service_id.name
                    : "Service"}
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {priceList.price_type.replace("_", " ")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">
                  {getPriceDisplay(priceList)}
                </p>
                {priceList.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {priceList.description}
                  </p>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(priceList._id)}
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
