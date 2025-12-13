"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { jobPostService } from "@/services/jobPost.service";
import { providerService } from "@/services/provider.service";
import { workPostService } from "@/services/workPost.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertBanner } from "@/components/ui/AlertBanner";

import { JobPostType } from "@/types/jobPost";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    approvedApplications: 0,
    rejectedApplications: 0,
    workPosts: 0,
    rating: 0,
    profileImage: null as string | null,
  });
  const [activeJobPosts, setActiveJobPosts] = useState<JobPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (user && user.role === "provider") {
      if (user.isApproved) {
        fetchStats();
        fetchActiveJobPosts();
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
      if (!user) return;
      const [jobsRes, profileRes, reviewsRes, workPostsRes] = await Promise.all(
        [
          jobPostService.getAll(),
          providerService.getProfile(),
          providerService.getReviews(),
          workPostService.getByProvider(user._id),
        ]
      );

      const allJobs = jobsRes.data || [];

      const approvedApplicationsList =
        allJobs.filter((job: JobPostType) =>
          job.applications?.some((app: any) => {
            const providerId =
              typeof app.providerId === "object"
                ? app.providerId._id
                : app.providerId;
            return providerId === user?._id && app.status === "approved";
          })
        ) || [];

      const rejectedApplicationsList =
        allJobs.filter((job: JobPostType) =>
          job.applications?.some((app: any) => {
            const providerId =
              typeof app.providerId === "object"
                ? app.providerId._id
                : app.providerId;
            return providerId === user?._id && app.status === "rejected";
          })
        ) || [];

      const profile = profileRes.data?.provider || profileRes.data;
      const reviews = reviewsRes.data?.reviews || [];
      const workPosts = workPostsRes.data || [];

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          : 0;

      const providerData = (profile as any)?.provider || profile;
      setStats({
        approvedApplications: approvedApplicationsList.length,
        rejectedApplications: rejectedApplicationsList.length,
        workPosts: workPosts.length,
        rating: (providerData as any)?.rating || avgRating || 0,
        profileImage: (providerData as any)?.profileImage || null,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      if (error.response?.status !== 403) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveJobPosts = async () => {
    try {
      setJobsLoading(true);
      const res = await jobPostService.getAll();
      const jobs = res.data || [];
      const myApprovedJobs =
        jobs.filter((job: JobPostType) =>
          job.applications?.some((app: any) => {
            const providerId =
              typeof app.providerId === "object"
                ? app.providerId._id
                : app.providerId;
            return providerId === user?._id && app.status === "approved";
          })
        ) || [];
      setActiveJobPosts(
        Array.isArray(myApprovedJobs) ? myApprovedJobs.slice(0, 6) : []
      );
    } catch (error: any) {
      console.error("Error fetching active job posts:", error);
      if (error.response?.status !== 403) {
        toast.error(
          error.response?.data?.message || "Failed to load active job posts"
        );
      }
    } finally {
      setJobsLoading(false);
    }
  };

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Accepted Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.approvedApplications}
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
            <CardTitle>Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.rejectedApplications}
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
            <CardTitle>Work Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.workPosts}
            </p>
            <Link href="/provider/work-posts">
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
    </>
  );
}
