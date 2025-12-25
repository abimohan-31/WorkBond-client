"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobPostService } from "@/services/jobPost.service";
import { reviewService } from "@/services/review.service";
import { customerService } from "@/services/customer.service";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Star } from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    jobPosts: 0,
    reviews: 0,
    profileImage: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (!user) return;
      const [jobPostsRes, reviewsRes, profileRes] = await Promise.all([
        jobPostService.getAll(),
        reviewService.getAll({ customerId: user._id }),
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

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  const dashboardItems = [
    { title: "Job Posts", count: stats.jobPosts, icon: Briefcase, href: "/customer/job-posts", color: "text-blue-500" },
    { title: "My Reviews", count: stats.reviews, icon: Star, href: "/customer/reviews", color: "text-yellow-500" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={stats.profileImage || user.profileImage}
            alt={user.name}
          />
          <AvatarFallback className="text-xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-dashed text-center">
        <p className="text-muted-foreground">
          Need help? Post a job to get offers from expert providers in minutes.
          Simply click the <strong>Job Posts</strong> card to start.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
                  {loading ? "..." : item.count}
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
