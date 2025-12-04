"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobPosts, services as servicesApi } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobPost {
  _id: string;
  title: string;
  description: string;
  duration: string;
  service_id: any;
  location?: string;
  customerId: string;
  applications: Array<{
    _id: string;
    providerId: any;
    status: string;
    appliedAt: string;
  }>;
  createdAt: string;
}

interface Service {
  _id: string;
  name: string;
  category: string;
}

export default function CustomerJobPostsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterService, setFilterService] = useState<string>("all");
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    duration: "",
    service_id: "",
    location: "",
  });

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, servicesRes] = await Promise.all([
        jobPosts.getAll(),
        servicesApi.getAll(),
      ]);

      setJobs(jobsRes.data.data?.jobPosts || []);
      setServices(servicesRes.data.data?.services || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load job posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newJob.title || !newJob.description || !newJob.duration || !newJob.service_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await jobPosts.create(newJob);
      toast.success("Job posted successfully");
      setIsCreateDialogOpen(false);
      setNewJob({ title: "", description: "", duration: "", service_id: "", location: "" });
      fetchData();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;

    try {
      await jobPosts.delete(id);
      toast.success("Job post deleted");
      fetchData();
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job post");
    }
  };

  const handleApproveApplication = async (jobId: string, appId: string) => {
    try {
      await jobPosts.approve(jobId, appId);
      toast.success("Application approved");
      fetchData();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApplication = async (jobId: string, appId: string) => {
    try {
      await jobPosts.reject(jobId, appId);
      toast.success("Application rejected");
      fetchData();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  const filteredJobs = filterService === "all" 
    ? jobs 
    : jobs.filter(job => {
        const serviceId = typeof job.service_id === 'object' ? job.service_id._id : job.service_id;
        return serviceId === filterService;
      });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Job Posts</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Post New Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Job Post</DialogTitle>
              <DialogDescription>
                Post a new job request for service providers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="e.g., House Cleaning Needed"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Service Type *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newJob.service_id}
                  onChange={(e) => setNewJob({ ...newJob, service_id: e.target.value })}
                >
                  <option value="">Select a service</option>
                  
                  <optgroup label="Plumbing">
                    {services
                      .filter(s => s.category === "Plumbing")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Gardening">
                    {services
                      .filter(s => s.category === "Gardening")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Electrical">
                    {services
                      .filter(s => s.category === "Electrical")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Painting">
                    {services
                      .filter(s => s.category === "Painting")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Cleaning">
                    {services
                      .filter(s => s.category === "Cleaning")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Carpentry">
                    {services
                      .filter(s => s.category === "Carpentry")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Handyman">
                    {services
                      .filter(s => s.category === "Handyman")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Moving">
                    {services
                      .filter(s => s.category === "Moving")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Other">
                    {services
                      .filter(s => s.category === "Other")
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe the work you need done..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration *</label>
                  <Input
                    placeholder="e.g., 2 weeks, 1 month"
                    value={newJob.duration}
                    onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g., New York, NY"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Post Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Service:</label>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white min-w-[200px]"
        >
          <option value="all">All Services ({jobs.length})</option>
          {services.map((service) => {
            const count = jobs.filter(job => {
              const serviceId = typeof job.service_id === 'object' ? job.service_id._id : job.service_id;
              return serviceId === service._id;
            }).length;
            return (
              <option key={service._id} value={service._id}>
                {service.name} ({count})
              </option>
            );
          })}
        </select>
        {filterService !== "all" && (
          <Button variant="outline" size="sm" onClick={() => setFilterService("all")}>
            Clear Filter
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading job posts...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Post Your First Job</Button>
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No job posts found for this service</p>
            <Button variant="outline" onClick={() => setFilterService("all")}>
              Show All Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {typeof job.service_id === 'object' ? job.service_id.name : 'Service'} • {job.duration}
                      {job.location && ` • ${job.location}`}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(job._id)}>
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                {job.applications && job.applications.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">
                      Applications ({job.applications.length})
                    </h4>
                    <div className="space-y-2">
                      {job.applications.map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {typeof app.providerId === 'object' ? app.providerId.name : 'Provider'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status: <span className="capitalize">{app.status}</span>
                            </p>
                          </div>
                          {app.status === "applied" && (
                            <div className="space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveApplication(job._id, app._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectApplication(job._id, app._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
