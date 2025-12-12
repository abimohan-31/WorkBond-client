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

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.jobPosts}
            </p>
            <Link href="/customer/job-posts">
              <Button variant="link" className="px-0">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.reviews}
            </p>
            <Link href="/customer/reviews">
              <Button variant="link" className="px-0">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
