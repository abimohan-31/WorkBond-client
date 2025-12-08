"use client";
import { useEffect, useState } from "react";
import { priceListService } from "@/services/priceList.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PublicPriceListsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceTypeFilter, setPriceTypeFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await priceListService.getAll();
      setList(res.data || []); // Backend returns data array directly
    } catch (err) {
      console.error("Error loading price lists:", err);
      toast.error("Failed to load price lists");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (item: any) => {
    if (item.price_type === "fixed") return `LKR${item.fixed_price} fixed`;
    if (item.price_type === "per_unit")
      return `LKR${item.unit_price}/${item.unit}`;
    if (item.price_type === "range")
      return `LKR${item.min_price} - LKR${item.max_price}`;
    return "Price not available";
  };

  const filteredList = list.filter((item) => {
    const serviceName =
      typeof item.service_id === "object" ? item.service_id?.name : "";
    const matchesSearch = serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriceType =
      priceTypeFilter === "all" || item.price_type === priceTypeFilter;
    return matchesSearch && matchesPriceType && item.isActive;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Service Pricing</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by service name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/2"
        />
        <select
          value={priceTypeFilter}
          onChange={(e) => setPriceTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded-md md:w-1/4"
        >
          <option value="all">All Price Types</option>
          <option value="fixed">Fixed Price</option>
          <option value="per_unit">Per Unit</option>
          <option value="range">Price Range</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading price lists...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No price lists found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredList.map((item: any) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.service_id?.name || "Service"}</span>
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.price_type.replace("_", " ")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-sm font-medium">
                    {item.service_id?.category || "N/A"}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(item)}
                  </div>
                </div>
                {item.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
