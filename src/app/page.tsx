"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  services as servicesApi,
  priceLists as priceListsApi,
} from "@/lib/apiClient";
import { toast } from "sonner";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  unit: string;
  isActive: boolean;
  icon?: string;
}

interface PriceList {
  _id: string;
  service_id: string;
  price_type: "fixed" | "per_unit" | "range";
  fixed_price?: number;
  unit_price?: number;
  unit?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  isActive: boolean;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceListSearch, setPriceListSearch] = useState("");
  const [priceTypeFilter, setPriceTypeFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data from API...");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const [servicesRes, priceListsRes] = await Promise.all([
        servicesApi.getAll(),
        priceListsApi.getAll(),
      ]);

      console.log("Services response:", servicesRes.data);
      console.log("Price lists response:", priceListsRes.data);

      // Both endpoints return data array directly in data property
      setServices(servicesRes.data.data || []);
      setPriceLists(priceListsRes.data.data || []);

      console.log("Services loaded:", servicesRes.data.data?.length || 0);
      console.log("Price lists loaded:", priceListsRes.data.data?.length || 0);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (service: Service) => {
    const servicePriceLists = priceLists.filter(
      (pl) => pl.service_id === service._id && pl.isActive
    );

    if (servicePriceLists.length === 0) {
      return `LKR${service.base_price}/${service.unit}`;
    }

    return servicePriceLists
      .map((pl, idx) => {
        if (pl.price_type === "fixed") {
          return `LKR${pl.fixed_price} fixed`;
        } else if (pl.price_type === "per_unit") {
          return `LKR${pl.unit_price}/${pl.unit}`;
        } else if (pl.price_type === "range") {
          return `LKR${pl.min_price} - ${pl.max_price}`;
        }
        return "";
      })
      .join(" • ");
  };

  const categories = [
    "all",
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

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory && service.isActive;
  });

  const filteredPriceLists = priceLists.filter((pl: any) => {
    const service = services.find(
      (s) => s._id === pl.service_id?._id || pl.service_id
    );
    const serviceName =
      typeof pl.service_id === "object" ? pl.service_id?.name : service?.name;
    const matchesSearch =
      serviceName?.toLowerCase().includes(priceListSearch.toLowerCase()) ||
      false;
    const matchesPriceType =
      priceTypeFilter === "all" || pl.price_type === priceTypeFilter;
    return matchesSearch && matchesPriceType && pl.isActive;
  });

  const formatPriceListPrice = (pl: any) => {
    if (pl.price_type === "fixed") return `LKR${pl.fixed_price} fixed`;
    if (pl.price_type === "per_unit") return `LKR${pl.unit_price}/${pl.unit}`;
    if (pl.price_type === "range")
      return `LKR${pl.min_price} - ${pl.max_price}`;
    return "Price not available";
  };

  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-transparent">
              <span className="text-[#061D4E]">Work</span>
              <span className="text-[#F35C27]">Bond</span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
            Connecting talented professionals with forward-thinking companies.
            WorkBond bridges the gap between exceptional talent and meaningful
            opportunities, creating lasting professional relationships that
            drive success.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-md md:w-1/4"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No services found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{service.name}</span>
                      <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {service.category}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 mb-1">Pricing</p>
                      <p className="text-2xl font-bold text-[#061D4E]">
                        {getPriceDisplay(service)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Price Lists Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Service Pricing
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by service name..."
              value={priceListSearch}
              onChange={(e) => setPriceListSearch(e.target.value)}
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
          ) : filteredPriceLists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No price lists found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPriceLists.map((priceList: any) => {
                const service =
                  typeof priceList.service_id === "object"
                    ? priceList.service_id
                    : services.find((s) => s._id === priceList.service_id);

                return (
                  <Card
                    key={priceList._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="capitalize">
                          {service?.name || "Service"}
                        </span>
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {priceList.price_type.replace("_", " ")}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Category</p>
                        <p className="text-sm font-medium">
                          {service?.category || "N/A"}
                        </p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-1">Price</p>
                        <p className="text-2xl font-bold text-[#061D4E]">
                          {formatPriceListPrice(priceList)}
                        </p>
                      </div>
                      {priceList.description && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            {priceList.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
