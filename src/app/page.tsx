"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { serviceService } from "@/services/service.service";
import { priceListService } from "@/services/priceList.service";
import { toast } from "sonner";
import { HeroSection } from "@/components/ui/HeroSection";

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
        serviceService.getAll(),
        priceListService.getAll(),
      ]);

      console.log("Services response:", servicesRes.data);
      console.log("Price lists response:", priceListsRes.data);

      // Both endpoints return data array directly in data property
      setServices(servicesRes.data || []);
      setPriceLists(priceListsRes.data || []);

      console.log("Services loaded:", servicesRes.data?.length || 0);
      console.log("Price lists loaded:", priceListsRes.data?.length || 0);
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
          return `LKR${pl.min_price} - LKR${pl.max_price}`;
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
      return `LKR${pl.min_price} - LKR${pl.max_price}`;
    return "Price not available";
  };

  return (
    <main className="pt-16">
      <HeroSection
        title="Welcome to WorkBond"
        subtitle="Connecting talented professionals with forward-thinking companies. WorkBond bridges the gap between exceptional talent and meaningful opportunities, creating lasting professional relationships that drive success."
        primaryAction={{ label: "Get Started", href: "/auth/register/customer" }}
        secondaryAction={{ label: "Learn More", href: "#services" }}
        className="mb-12"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="services">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Our Services
          </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
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
              className="px-4 py-2 border rounded-md md:w-1/4 bg-background text-foreground border-input"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              aria-label="Clear search and filters"
            >
              Clear
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden"
                >
                  <div className="h-48 w-full bg-muted relative overflow-hidden">
                    {service.icon ? (
                      <img 
                        src={service.icon} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize truncate pr-2">{service.name}</span>
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                        {service.category}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                    <div className="border-t pt-4 mt-auto">
                      <p className="text-sm text-muted-foreground mb-1">Pricing</p>
                      <p className="text-lg font-bold text-secondary truncate">
                        {getPriceDisplay(service)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Price Lists Section
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">
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
              className="px-4 py-2 border rounded-md md:w-1/4 bg-background text-foreground border-input"
            >
              <option value="all">All Price Types</option>
              <option value="fixed">Fixed Price</option>
              <option value="per_unit">Per Unit</option>
              <option value="range">Price Range</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading price lists...</p>
            </div>
          ) : filteredPriceLists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No price lists found</p>
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
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                          {priceList.price_type.replace("_", " ")}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="text-sm font-medium">
                          {service?.category || "N/A"}
                        </p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="text-2xl font-bold text-secondary">
                          {formatPriceListPrice(priceList)}
                        </p>
                      </div>
                      {priceList.description && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
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
        </div> */}
      </div>
    </main>
  );
}
