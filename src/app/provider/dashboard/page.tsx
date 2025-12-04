"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobPosts, providers } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalEarnings: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "provider") {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [jobsRes, profileRes, reviewsRes] = await Promise.all([
        jobPosts.getAll(),
        providers.getProfile(),
        providers.getReviews(),
      ]);

      const myApplications = jobsRes.data.data?.jobPosts?.filter((job: any) =>
        job.applications?.some((app: any) => app.providerId === user?._id && app.status === "approved")
      ) || [];

      const profile = profileRes.data.data?.provider;
      const reviews = reviewsRes.data.data?.reviews || [];
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        activeJobs: myApplications.length,
        totalEarnings: 0,
        rating: profile?.rating || avgRating || 0,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.activeJobs}</p>
            <Link href="/provider/job-posts">
              <Button variant="link" className="px-0">View all →</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${loading ? "..." : stats.totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.rating.toFixed(1)}</p>
            <Link href="/provider/reviews">
              <Button variant="link" className="px-0">View reviews →</Button>
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
            <Link href="/provider/job-posts">
              <Button className="w-full">Browse Available Jobs</Button>
            </Link>
            <Link href="/provider/profile">
              <Button variant="outline" className="w-full">Update Profile</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Status:</span>
                <span className={`font-semibold ${user.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              {!user.isApproved && (
                <p className="text-sm text-gray-500 mt-2">
                  Your account is pending admin approval. You'll be notified once approved.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
