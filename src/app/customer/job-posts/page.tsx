"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { jobPostService } from "@/services/jobPost.service";
import { serviceService } from "@/services/service.service";
import { JobPostType } from "@/types/jobPost";
import { ServiceType } from "@/types/service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function CustomerJobPostsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPostType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
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
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("all");
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
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
        jobPostService.getAll(),
        serviceService.getAll(),
      ]);

      setJobs(jobsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load job posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (
      !newJob.title ||
      !newJob.description ||
      !newJob.duration ||
      !newJob.service_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await jobPostService.create(newJob);
      toast.success("Job posted successfully");
      setIsCreateDialogOpen(false);
      setNewJob({
        title: "",
        description: "",
        duration: "",
        service_id: "",
        location: "",
      });
      fetchData();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job post");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: "Are you sure you want to delete this job post?",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        try {
          await jobPostService.delete(id);
          toast.success("Job post deleted");
          fetchData();
        } catch (error: any) {
          console.error("Error deleting job:", error);
          toast.error("Failed to delete job post");
        }
      },
    });
  };

  const handleApproveApplication = (jobId: string, appId: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: "Approve Application?",
      description: "Are you sure you want to approve this application?",
      onConfirm: async () => {
        try {
          await jobPostService.approve(jobId, appId);
          toast.success("Application approved");
          fetchData();
        } catch (error: any) {
          console.error("Error approving application:", error);
          toast.error("Failed to approve application");
        }
      },
    });
  };

  const handleRejectApplication = (jobId: string, appId: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: "Reject Application?",
      description: "Are you sure you want to reject this application?",
      onConfirm: async () => {
        try {
          await jobPostService.reject(jobId, appId);
          toast.success("Application rejected");
          fetchData();
        } catch (error: any) {
          console.error("Error rejecting application:", error);
          toast.error("Failed to reject application");
        }
      },
    });
  };

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  const filteredJobs =
    filterService === "all"
      ? jobs
      : jobs.filter((job) => {
          const serviceId =
            typeof job.service_id === "object"
              ? job.service_id._id
              : job.service_id;
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
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input mb-4"
                  value={formCategory}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    setNewJob({ ...newJob, service_id: "" });
                  }}
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(services.map((s) => s.category))).map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Service Type *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input"
                  value={newJob.service_id}
                  onChange={(e) =>
                    setNewJob({ ...newJob, service_id: e.target.value })
                  }
                >
                  <option value="">Select a service</option>

                  {Array.from(new Set(services.map((s) => s.category)))
                    .filter(
                      (cat) => formCategory === "all" || cat === formCategory
                    )
                    .map((category) => (
                      <optgroup key={category} label={category}>
                        {services
                          .filter((s) => s.category === category)
                          .map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe the work you need done..."
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration *</label>
                  <Input
                    placeholder="e.g., 2 weeks, 1 month"
                    value={newJob.duration}
                    onChange={(e) =>
                      setNewJob({ ...newJob, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g., New York, NY"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Post Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-muted-foreground">
          Filter by Service:
        </label>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-4 py-2 border rounded-md bg-background text-foreground border-input min-w-[200px]"
        >
          <option value="all">All Services ({jobs.length})</option>
          {services.map((service) => {
            const count = jobs.filter((job) => {
              const serviceId =
                typeof job.service_id === "object"
                  ? job.service_id._id
                  : job.service_id;
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterService("all")}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading job posts...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven't posted any jobs yet
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No job posts found for this service
            </p>
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {typeof job.service_id === "object"
                        ? job.service_id.name
                        : "Service"}{" "}
                      • {job.duration}
                      {job.location && ` • ${job.location}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>

                {job.applications && job.applications.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">
                      Applications ({job.applications.length})
                    </h4>
                    <div className="space-y-2">
                      {job.applications.map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center p-3 bg-muted rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {typeof app.providerId === "object" &&
                              app.providerId !== null
                                ? (app.providerId as any).name
                                : "Provider"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Status:{" "}
                              <span className="capitalize">{app.status}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                            {app.status === "applied" && app._id && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    app._id &&
                                    handleApproveApplication(job._id, app._id)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    app._id &&
                                    handleRejectApplication(job._id, app._id)
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && selectedApplication.providerId && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-foreground">
                  {(selectedApplication.providerId as any).name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-foreground">
                  {(selectedApplication.providerId as any).email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-foreground">
                  {(selectedApplication.providerId as any).phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="text-foreground">
                  {(selectedApplication.providerId as any).address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Availability
                </label>
                <p className="text-foreground">
                  {(selectedApplication.providerId as any).availability_status}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmationDialog.isOpen}
        onOpenChange={(isOpen) =>
          setConfirmationDialog({ ...confirmationDialog, isOpen })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmationDialog.title}</DialogTitle>
            <DialogDescription>
              {confirmationDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmationDialog({ ...confirmationDialog, isOpen: false })
              }
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmationDialog.title.toLowerCase().includes("delete")
                  ? "destructive"
                  : "default"
              }
              onClick={() => {
                confirmationDialog.onConfirm();
                setConfirmationDialog({ ...confirmationDialog, isOpen: false });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
