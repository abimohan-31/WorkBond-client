"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { jobPostService } from "@/services/jobPost.service";
import { JobPostType } from "@/types/jobPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProviderJobPostsPage() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<JobPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPostType | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === "provider") {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobPostService.getAll();
      setAllJobs(res.data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job posts");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobPostService.apply(jobId);
      toast.success("Application submitted successfully");
      fetchJobs();
    } catch (error: any) {
      console.error("Error applying to job:", error);
      toast.error(error.response?.data?.message || "Failed to apply to job");
    }
  };

  const hasApplied = (job: JobPostType) => {
    if (!user?._id) return false;

    return job.applications?.some((app) => {
      const providerId =
        typeof app.providerId === "object" && app.providerId !== null
          ? (app.providerId as any)._id
          : app.providerId;
      return providerId === user._id;
    });
  };

  const getApplicationStatus = (job: JobPostType) => {
    if (!user?._id) return null;

    const application = job.applications?.find((app) => {
      const providerId =
        typeof app.providerId === "object" && app.providerId !== null
          ? (app.providerId as any)._id
          : app.providerId;
      return providerId === user._id;
    });
    return application?.status || null;
  };

  const availableJobs = allJobs.filter((job) => !hasApplied(job));
  const myApplications = allJobs.filter((job) => hasApplied(job));

  // Add loading state to prevent hydration mismatch
  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  if (user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  if (!user.isApproved) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Account Pending Approval
            </h2>
            <p className="text-muted-foreground">
              Your provider account is pending admin approval. You'll be able to
              browse and apply to jobs once your account is approved.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Job Posts</h1>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">
            Available Jobs ({availableJobs.length})
          </TabsTrigger>
          <TabsTrigger value="my-applications">
            My Applications ({myApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : availableJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No available jobs at the moment
                </p>
              </CardContent>
            </Card>
          ) : (
            availableJobs.map((job) => (
              <Card key={job._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-foreground">
                        {job.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {typeof job.service_id === "object" &&
                        job.service_id !== null
                          ? job.service_id.name
                          : "Service"}{" "}
                        • {job.duration}
                        {job.location && ` • ${job.location}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Posted by:{" "}
                        {typeof job.customerId === "object" &&
                        job.customerId !== null
                          ? job.customerId.name
                          : "Customer"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => handleApply(job._id)}>
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        View Customer Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{job.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="my-applications" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          ) : myApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't applied to any jobs yet
                </p>
              </CardContent>
            </Card>
          ) : (
            myApplications.map((job) => {
              const status = getApplicationStatus(job);
              return (
                <Card key={job._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-foreground">
                          {job.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {typeof job.service_id === "object" &&
                          job.service_id !== null
                            ? job.service_id.name
                            : "Service"}{" "}
                          • {job.duration}
                          {job.location && ` • ${job.location}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Posted by:{" "}
                          {typeof job.customerId === "object" &&
                          job.customerId !== null
                            ? job.customerId.name
                            : "Customer"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={status || "pending"} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          View Customer Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedJob &&
          selectedJob.customerId &&
          typeof selectedJob.customerId === "object" &&
          selectedJob.customerId !== null ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-foreground">
                  {selectedJob.customerId.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-foreground">
                  {selectedJob.customerId.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-foreground">
                  {selectedJob.customerId.phone || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Customer details not available
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
