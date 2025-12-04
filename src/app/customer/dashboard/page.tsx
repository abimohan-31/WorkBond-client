"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobPosts, reviews } from "@/lib/apiClient";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    jobPosts: 0,
    reviews: 0,
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
      const [jobPostsRes, reviewsRes] = await Promise.all([
        jobPosts.getAll(),
        reviews.getAll(),
      ]);

      setStats({
        jobPosts: jobPostsRes.data.data?.jobPosts?.length || 0,
        reviews: reviewsRes.data.data?.reviews?.length || 0,
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
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}</h1>

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

