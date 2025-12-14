"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { serviceService } from "@/services/service.service";
import { priceListService } from "@/services/priceList.service";
import { workPostService } from "@/services/workPost.service";
import { providerService } from "@/services/provider.service";
import { toast } from "sonner";
import { HeroSection } from "@/components/ui/HeroSection";
import { WorkPostType } from "@/types/provider";
import { ProviderDetailsModal } from "@/components/modals/ProviderDetailsModal";
import { PriceList, Service } from "@/types/workPost";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProviderInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: string;
  profileImage?: string;
  rating?: number;
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [workPosts, setWorkPosts] = useState<WorkPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const isPublic = !user;
  const isCustomer = user && user.role === "customer";
  const isProvider = user && user.role === "provider";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [servicesRes, priceListsRes] = await Promise.all([
        serviceService.getAll(),
        priceListService.getAll(),
      ]);

      setServices(servicesRes.data || []);
      setPriceLists(priceListsRes.data || []);

      if (isCustomer || isProvider) {
        const workPostsRes = await workPostService.getAll();
        if (workPostsRes.success && workPostsRes.data) {
          const posts = Array.isArray(workPostsRes.data)
            ? workPostsRes.data
            : [];
          setWorkPosts(posts);
        }
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [isCustomer, isProvider]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const getPriceDisplay = useCallback(
    (service: Service) => {
      const servicePriceLists = priceLists.filter(
        (pl) => pl.service_id === service._id && pl.isActive
      );

      if (servicePriceLists.length === 0) {
        return `LKR ${service.base_price}/${service.unit}`;
      }

      return servicePriceLists
        .map((pl) => {
          if (pl.price_type === "fixed") {
            return `LKR ${pl.fixed_price} fixed`;
          } else if (pl.price_type === "per_unit") {
            return `LKR ${pl.unit_price}/${pl.unit}`;
          } else if (pl.price_type === "range") {
            return `LKR ${pl.min_price} - LKR ${pl.max_price}`;
          }
          return "";
        })
        .filter(Boolean)
        .join(" • ");
    },
    [priceLists]
  );

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

  const filteredWorkPosts = workPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewProviderDetails = useCallback(
    async (provider: ProviderInfo) => {
      try {
        if (provider._id) {
          const response = await providerService.getProviderById(provider._id);
          if (response.success && response.data?.provider) {
            setSelectedProvider(response.data.provider);
            setModalOpen(true);
          } else {
            setSelectedProvider(provider);
            setModalOpen(true);
          }
        } else {
          setSelectedProvider(provider);
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setSelectedProvider(provider);
        setModalOpen(true);
      }
    },
    []
  );

  const getProviderFromWorkPost = useCallback(
    (post: WorkPostType): ProviderInfo | null => {
      if (typeof post.providerId === "object" && post.providerId !== null) {
        const provider = post.providerId as any;
        return {
          _id: provider._id || "",
          name: provider.name || "",
          email: provider.email || "",
          phone: provider.phone || "",
          address: provider.address || "",
          experience_years: provider.experience_years || 0,
          skills: provider.skills || [],
          availability_status: provider.availability_status || "Unavailable",
          profileImage: provider.profileImage,
          rating: provider.rating,
        };
      }
      return null;
    },
    []
  );

  const cleanDescription = useCallback((description: string) => {
    return description
      .replace(/completed/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.src = "";
      target.alt = "Image not available";
    },
    []
  );

  return (
    <main className="">
      <HeroSection
        title="Welcome to WorkBond"
        subtitle="Connecting talented professionals with forward-thinking companies. WorkBond bridges the gap between exceptional talent and meaningful opportunities, creating lasting professional relationships that drive success."
        primaryAction={{
          label: "Get Started",
          href: "/auth/register/customer",
        }}
        secondaryAction={{ label: "Learn More", href: "#services" }}
        backgroundImage="https://images.pexels.com/photos/6077647/pexels-photo-6077647.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        className="mb-12"
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        id="services"
      >
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
              className="w-full md:w-1/2"
              aria-label="Search input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-background text-foreground border-input"
              aria-label="Category filter"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <Button
              variant="secondary"
              className="w-full md:w-auto"
              onClick={handleClearFilters}
              aria-label="Clear search and filters"
            >
              Clear
            </Button>
          </div>

          {loading || authLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                        onError={handleImageError}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <span className="capitalize truncate">
                        {service.name}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap shrink-0">
                        {service.category}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="border-t pt-4 mt-auto space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Pricing
                        </p>
                        <p className="text-lg font-bold text-secondary truncate">
                          {getPriceDisplay(service)}
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (isPublic) {
                            router.push("/auth/login");
                          } else if (isCustomer) {
                            router.push(`/services/${service._id}/providers`);
                          } else if (isProvider) {
                            toast.info("Providers cannot view provider listings");
                          }
                        }}
                      >
                        See more
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {(isCustomer || isProvider) && (
          <div className="mb-8 mt-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Provider Work Showcases
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
              <Input
                type="text"
                placeholder="Search work posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2"
                aria-label="Search work posts"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-background text-foreground border-input"
                aria-label="Category filter"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                className="w-full md:w-auto"
                onClick={handleClearFilters}
                aria-label="Clear search and filters"
              >
                Clear
              </Button>
            </div>

            {loading || authLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading work posts...</p>
              </div>
            ) : filteredWorkPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No work posts found</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredWorkPosts.map((post) => {
                  const provider = getProviderFromWorkPost(post);
                  const cleanedDescription = post.description
                    ? cleanDescription(post.description)
                    : "";

                  return (
                    <Card
                      key={post._id}
                      className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-3 sm:p-4">
                        <div className="relative overflow-hidden rounded-md aspect-square">
                          <img
                            src={post.beforeImage}
                            alt={`Before: ${post.title}`}
                            className="w-full h-full object-cover rounded-md"
                            onError={handleImageError}
                            loading="lazy"
                          />
                        </div>
                        <div className="relative overflow-hidden rounded-md aspect-square">
                          <img
                            src={post.afterImage}
                            alt={`After: ${post.title}`}
                            className="w-full h-full object-cover rounded-md"
                            onError={handleImageError}
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="capitalize truncate text-base sm:text-lg">
                            {post.title}
                          </span>
                          {post.category &&
                            post.category.toLowerCase() !== "general" && (
                              <Badge
                                variant="secondary"
                                className="whitespace-nowrap w-fit"
                              >
                                {post.category}
                              </Badge>
                            )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between pt-0">
                        {cleanedDescription && (
                          <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                            {cleanedDescription}
                          </p>
                        )}
                        {provider && isCustomer && (
                          <div className="border-t pt-3 sm:pt-4 mt-auto">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                              Provider
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-sm sm:text-base font-medium"
                              onClick={() => handleViewProviderDetails(provider)}
                            >
                              {provider.name}
                            </Button>
                          </div>
                        )}
                        {provider && isProvider && (
                          <div className="border-t pt-3 sm:pt-4 mt-auto">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                              Provider
                            </p>
                            <p className="text-sm sm:text-base font-medium">
                              {provider.name}
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
        )}
      </div>

      <ProviderDetailsModal
        provider={selectedProvider}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
