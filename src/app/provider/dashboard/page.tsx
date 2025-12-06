"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobPosts, providers } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JobPost {
  _id: string;
  title: string;
  description: string;
  location?: string;
  duration: string;
  service_id: {
    _id: string;
    name: string;
    category: string;
  };
  customerId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  applications: Array<{
    providerId: string | { _id: string; name: string };
    status: string;
    appliedAt: string;
  }>;
  createdAt: string;
}

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalEarnings: 0,
    rating: 0,
    profileImage: null as string | null,
  });
  const [jobPostsList, setJobPostsList] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "provider") {
      fetchStats();
      fetchJobPosts();
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

      const myApplications = jobsRes.data.data?.filter((job: JobPost) =>
        job.applications?.some((app: any) => {
          const providerId = typeof app.providerId === 'object' ? app.providerId._id : app.providerId;
          return providerId === user?._id && app.status === "approved";
        })
      ) || [];

      const profile = profileRes.data.data?.provider || profileRes.data.data;
      const reviews = reviewsRes.data.data?.reviews || [];
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        activeJobs: myApplications.length,
        totalEarnings: 0,
        rating: profile?.rating || avgRating || 0,
        profileImage: profile?.profileImage || null,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPosts = async () => {
    try {
      setJobsLoading(true);
      const res = await jobPosts.getAll();
      const jobs = res.data.data || [];
      setJobPostsList(Array.isArray(jobs) ? jobs.slice(0, 6) : []);
    } catch (error: any) {
      console.error("Error fetching job posts:", error);
      toast.error(error.response?.data?.message || "Failed to load job posts");
    } finally {
      setJobsLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobPosts.apply(jobId);
      toast.success("Application submitted successfully");
      fetchJobPosts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  const hasApplied = (job: JobPost) => {
    return job.applications?.some((app: any) => {
      const providerId = typeof app.providerId === 'object' ? app.providerId._id : app.providerId;
      return providerId === user?._id;
    });
  };

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        {/* <Avatar className="h-16 w-16">
          <AvatarImage
            src={stats.profileImage || user.profileImage || "/avatars/01.png"}
            alt={user.name}
          />
          <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar> */}
        <div>
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
      </div>

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
            <p className="text-2xl font-bold">LKR {loading ? "..." : stats.totalEarnings.toFixed(2)}</p>
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

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Available Job Posts</h2>
          <Link href="/provider/job-posts">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {jobsLoading ? (
          <div className="text-center py-8">Loading job posts...</div>
        ) : jobPostsList.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No job posts available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobPostsList.map((job) => (
              <Card key={job._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {typeof job.service_id === 'object' ? job.service_id.name : 'Service'}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{job.description}</p>
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-gray-500">
                      <strong>Customer:</strong> {typeof job.customerId === 'object' ? job.customerId.name : 'N/A'}
                    </p>
                    {job.location && (
                      <p className="text-xs text-gray-500">
                        <strong>Location:</strong> {job.location}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      <strong>Duration:</strong> {job.duration}
                    </p>
                  </div>
                  {hasApplied(job) ? (
                    <Button variant="outline" className="w-full" disabled>
                      Already Applied
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleApply(job._id)}
                    >
                      Apply Now
                    </Button>
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
