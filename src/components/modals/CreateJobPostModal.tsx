"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { jobPostService } from "@/services/jobPost.service";
import { serviceService } from "@/services/service.service";
import { ServiceType } from "@/types/service";

interface CreateJobPostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateJobPostModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateJobPostModalProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [formCategory, setFormCategory] = useState("all");
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    duration: "",
    service_id: "",
    location: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const servicesRes = await serviceService.getAll();
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
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
      setLoading(true);
      await jobPostService.create(newJob);
      toast.success("Job posted successfully");
      onOpenChange(false);
      setNewJob({
        title: "",
        description: "",
        duration: "",
        service_id: "",
        location: "",
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                .filter((cat) => formCategory === "all" || cat === formCategory)
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
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
