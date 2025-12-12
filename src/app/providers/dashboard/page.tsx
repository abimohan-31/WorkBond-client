"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { jobPostService } from "@/services/jobPost.service";
import { providerService } from "@/services/provider.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertBanner } from "@/components/ui/AlertBanner";

import { JobPostType } from "@/types/jobPost";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalEarnings: 0,
    rating: 0,
    profileImage: null as string | null,
  });
  const [jobPostsList, setJobPostsList] = useState<JobPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (user && user.role === "provider") {
      if (user.isApproved) {
        fetchStats();
        fetchJobPosts();
        fetchSubscriptionStatus();
      } else {
        setLoading(false);
        setJobsLoading(false);
      }
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const { paymentService } = await import("@/services/payment.service");
      const response = await paymentService.getSubscriptionStatus();
      if (response.success) {
        setSubscriptionStatus(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [jobsRes, profileRes, reviewsRes] = await Promise.all([
        jobPostService.getAll(),
        providerService.getProfile(),
        providerService.getReviews(),
      ]);

      const myApplications =
        jobsRes.data?.filter((job: JobPostType) =>
          job.applications?.some((app: any) => {
            const providerId =
              typeof app.providerId === "object"
                ? app.providerId._id
                : app.providerId;
            return providerId === user?._id && app.status === "approved";
          })
        ) || [];

      const profile = profileRes.data?.provider || profileRes.data;
      const reviews = reviewsRes.data?.reviews || [];

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          : 0;

      const providerData = (profile as any)?.provider || profile;
      setStats({
        activeJobs: myApplications.length,
        totalEarnings: 0,
        rating: (providerData as any)?.rating || avgRating || 0,
        profileImage: (providerData as any)?.profileImage || null,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      // Don't show error toast for approval-related errors
      if (error.response?.status !== 403) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPosts = async () => {
    try {
      setJobsLoading(true);
      const res = await jobPostService.getAll();
      const jobs = res.data || [];
      setJobPostsList(Array.isArray(jobs) ? jobs.slice(0, 6) : []);
    } catch (error: any) {
      console.error("Error fetching job posts:", error);
      // Don't show error toast for approval-related errors
      if (error.response?.status !== 403) {
        toast.error(
          error.response?.data?.message || "Failed to load job posts"
        );
      }
    } finally {
      setJobsLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobPostService.apply(jobId);
      toast.success("Application submitted successfully");
      fetchJobPosts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  const hasApplied = (job: JobPostType) => {
    return job.applications?.some((app: any) => {
      const providerId =
        typeof app.providerId === "object"
          ? app.providerId._id
          : app.providerId;
      return providerId === user?._id;
    });
  };

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  // Show pending approval message for unapproved providers
  if (!user.isApproved) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Welcome, {user.name}!
                </h2>
                <p className="text-muted-foreground">
                  Your provider account is currently pending admin approval.
                  Once your account is approved, you'll be able to:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                  <li>Browse and apply to available job posts</li>
                  <li>View your application status</li>
                  <li>Manage your profile and portfolio</li>
                  <li>Receive job notifications</li>
                </ul>
              </div>
            </div>
            <AlertBanner
              type="warning"
              title="Status: Pending"
              message="Your account is pending approval. You'll receive a notification once an admin reviews and approves your account."
            />
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Once approved, you'll be able to access all provider features
                including your profile, job applications, and more.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

      {!subscriptionStatus?.activeSubscription && (
        <div className="mb-6">
          <AlertBanner
            type="warning"
            title="No Active Subscription"
            message="You need an active subscription to create work posts and access all provider features."
          />
          <Link href="/provider/subscriptions">
            <Button variant="default" size="sm" className="mt-2">
              View Subscription Plans
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.activeJobs}
            </p>
            <Link href="/provider/job-posts">
              <Button variant="link" className="px-0">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.rating.toFixed(1)}
            </p>
            <Link href="/provider/reviews">
              <Button variant="link" className="px-0">
                View reviews →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* <div className="mb-8">
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
              <p className="text-muted-foreground">No job posts available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobPostsList.map((job) => (
              <Card key={job._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {typeof job.service_id === "object"
                      ? job.service_id.name
                      : "Service"}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Customer:</strong>{" "}
                      {typeof job.customerId === "object"
                        ? job.customerId.name
                        : "N/A"}
                    </p>
                    {job.location && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Location:</strong> {job.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
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
      </div> */}
{/* 
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
              <Button variant="outline" className="w-full">
                Update Profile
              </Button>
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
                <span className="text-muted-foreground">Approval Status:</span>
                <StatusBadge
                  status={user.isApproved ? "approved" : "pending"}
                />
              </div>
              {!user.isApproved && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your account is pending admin approval. You'll be notified
                  once approved.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div> */}
    </>
  );
}
