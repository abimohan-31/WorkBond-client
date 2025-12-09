"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { RefreshCw, Users, Briefcase, Settings, CreditCard, Star, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingProviders: 0,
    activeProviders: 0,
    customers: 0,
    services: 0,
    subscriptions: 0,
    reviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // In a real app, you'd have a dedicated stats endpoint. 
      // For now, we'll fetch lists and count them, or use existing endpoints.
      // This is a placeholder for the actual counts logic.
      const pendingRes = await adminService.getPendingProviders();
      // const providersRes = await adminService.getProviders(); // Assuming this exists
      // const customersRes = await adminService.getCustomers(); // Assuming this exists
      
      setStats({
        pendingProviders: pendingRes.data?.providers?.length || 0,
        activeProviders: 0, // Placeholder
        customers: 0, // Placeholder
        services: 0, // Placeholder
        subscriptions: 0, // Placeholder
        reviews: 0 // Placeholder
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  const dashboardItems = [
    { title: "Pending Providers", count: stats.pendingProviders, icon: UserCheck, href: "/workbond/admin/pending-providers", color: "text-orange-500" },
    { title: "Active Providers", count: stats.activeProviders, icon: Briefcase, href: "/workbond/admin/providers", color: "text-blue-500" },
    { title: "Customers", count: stats.customers, icon: Users, href: "/workbond/admin/customers", color: "text-green-500" },
    { title: "Services", count: stats.services, icon: Settings, href: "/workbond/admin/services", color: "text-purple-500" },
    { title: "Subscriptions", count: stats.subscriptions, icon: CreditCard, href: "/workbond/admin/subscriptions", color: "text-indigo-500" },
    { title: "Reviews", count: stats.reviews, icon: Star, href: "/workbond/admin/reviews", color: "text-yellow-500" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : item.count}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to view details
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
