"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobPosts } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobPost {
  _id: string;
  title: string;
  description: string;
  duration: string;
  service_id: any;
  location?: string;
  customerId: any;
  applications: Array<{
    _id: string;
    providerId: string;
    status: string;
    appliedAt: string;
  }>;
  createdAt: string;
}

export default function ProviderJobPostsPage() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "provider") {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobPosts.getAll();
      setAllJobs(res.data.data?.jobPosts || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job posts");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobPosts.apply(jobId);
      toast.success("Application submitted successfully");
      fetchJobs();
    } catch (error: any) {
      console.error("Error applying to job:", error);
      toast.error(error.response?.data?.message || "Failed to apply to job");
    }
  };

  const hasApplied = (job: JobPost) => {
    return job.applications?.some((app) => app.providerId === user?._id);
  };

  const getApplicationStatus = (job: JobPost) => {
    const app = job.applications?.find((app) => app.providerId === user?._id);
    return app?.status || null;
  };

  const availableJobs = allJobs.filter((job) => !hasApplied(job));
  const myApplications = allJobs.filter((job) => hasApplied(job));

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  if (!user.isApproved) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Account Pending Approval</h2>
            <p className="text-gray-600">
              Your provider account is pending admin approval. You'll be able to browse and apply to jobs once your account is approved.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Job Posts</h1>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Jobs ({availableJobs.length})</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications ({myApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : availableJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">No available jobs at the moment</p>
              </CardContent>
            </Card>
          ) : (
            availableJobs.map((job) => (
              <Card key={job._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {typeof job.service_id === 'object' ? job.service_id.name : 'Service'} • {job.duration}
                        {job.location && ` • ${job.location}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Posted by: {typeof job.customerId === 'object' ? job.customerId.name : 'Customer'}
                      </p>
                    </div>
                    <Button onClick={() => handleApply(job._id)}>
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{job.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="my-applications" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : myApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">You haven't applied to any jobs yet</p>
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
                        <CardTitle>{job.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {typeof job.service_id === 'object' ? job.service_id.name : 'Service'} • {job.duration}
                          {job.location && ` • ${job.location}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Posted by: {typeof job.customerId === 'object' ? job.customerId.name : 'Customer'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status === "approved"
                            ? "bg-green-100 text-green-800"
                            : status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
