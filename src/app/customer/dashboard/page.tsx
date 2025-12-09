"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceService } from "@/services/service.service";
import { jobPostService } from "@/services/jobPost.service";
import { reviewService } from "@/services/review.service";
import { customerService } from "@/services/customer.service";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Provider {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: string;
  rating: number;
  profileImage?: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  unit: string;
  providers: Provider[];
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    jobPosts: 0,
    reviews: 0,
    profileImage: null as string | null,
  });
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchStats();
      fetchServices();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [jobPostsRes, reviewsRes, profileRes] = await Promise.all([
        jobPostService.getAll(),
        reviewService.getAll(),
        customerService.getProfile().catch(() => null),
      ]);

      const jobPostsData = jobPostsRes.data || [];
      const reviewsData = reviewsRes.data || [];
      
      setStats({
        jobPosts: Array.isArray(jobPostsData) ? jobPostsData.length : 0,
        reviews: Array.isArray(reviewsData) ? reviewsData.length : 0,
        profileImage: profileRes?.data?.customer?.profileImage || null,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const servicesRes = await serviceService.getAll();
      const allServices = servicesRes.data || [];

      const servicesWithProviders = await Promise.all(
        allServices.slice(0, 12).map(async (service) => {
          try {
            const providersRes = await serviceService.getProviders(service._id);
            const providers = providersRes.data?.providers || [];
            
            return {
              ...service,
              providers: providers.map((p: any) => ({
                _id: p._id,
                name: p.name,
                phone: p.phone,
                email: p.email,
                address: p.address,
                experience_years: p.experience_years,
                skills: p.skills,
                availability_status: p.availability_status,
                rating: p.rating,
                profileImage: p.profileImage,
              })),
            };
          } catch (error) {
            return {
              ...service,
              providers: [],
            };
          }
        })
      );

      setServicesList(servicesWithProviders);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setServicesLoading(false);
    }
  };

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        {/* <Avatar className="h-16 w-16">
          <AvatarImage
            src={stats.profileImage || user.profileImage }
            alt={user.name}
          />
          <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar> */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.jobPosts}</p>
            <Link href="/customer/job-posts">
              <Button variant="link" className="px-0">View all →</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.reviews}</p>
            <Link href="/customer/reviews">
              <Button variant="link" className="px-0">View all →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Available Services</h2>
        </div>

        {servicesLoading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : servicesList.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No services available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {servicesList.map((service) => (
              <Card key={service._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl capitalize">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary">
                        LKR {service.base_price}/{service.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  {service.providers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No providers available for this service</p>
                  ) : (
                    <div>
                      <p className="text-sm font-medium mb-3">
                        Available Providers ({service.providers.length})
                      </p>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {service.providers.map((provider) => (
                          <Card key={provider._id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={provider.profileImage }
                                    alt={provider.name}
                                  />
                                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{provider.name}</p>
                                  <p className="text-xs text-muted-foreground">{provider.phone}</p>
                                  <p className="text-xs text-muted-foreground truncate">{provider.email}</p>
                                  {provider.address && (
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                      {provider.address}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      {provider.experience_years} years exp.
                                    </span>
                                    {provider.rating > 0 && (
                                      <span className="text-xs text-warning">
                                        ⭐ {provider.rating.toFixed(1)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2">
                                    <StatusBadge 
                                      status={provider.availability_status === "Available" ? "active" : "inactive"} 
                                      className="text-xs px-2 py-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/customer/job-posts">
              <Button className="w-full">Post a New Job</Button>
            </Link>
            <Link href="/customer/reviews">
              <Button variant="outline" className="w-full">Write a Review</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
