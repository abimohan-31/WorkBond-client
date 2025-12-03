"use client";
import { useEffect, useState } from "react";
import { jobPosts } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function CustomerJobPostsPage() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "", location: "", budget: "" });
  const { canCreateJobPost } = usePermissions();

  useEffect(() => {
    if (canCreateJobPost) {
        loadJobs();
    }
  }, [canCreateJobPost]);

  const loadJobs = async () => {
    try {
      const res = await jobPosts.getAll();
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load jobs");
    }
  };

  const handleCreate = async () => {
    if (!newJob.title || !newJob.description) {
        toast.error("Title and Description are required");
        return;
    }
    try {
      await jobPosts.create(newJob);
      toast.success("Job posted");
      loadJobs();
      setNewJob({ title: "", description: "", location: "", budget: "" });
    } catch (err) {
      toast.error("Failed to post job");
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      try {
          await jobPosts.delete(id);
          toast.success("Job deleted");
          loadJobs();
      } catch (err) {
          toast.error("Failed to delete job");
      }
  }

  if (!canCreateJobPost) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Job Posts</h1>
      <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Input placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
        <Input placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
            <Input placeholder="Budget" type="number" value={newJob.budget} onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })} />
        </div>
        <Button onClick={handleCreate}>Post Job</Button>
      </div>
      <div className="space-y-4">
        {jobs.map((job: any) => (
          <Card key={job._id}>
            <CardHeader><CardTitle>{job.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2">{job.description}</p>
              <p className="text-sm text-muted-foreground mb-4">{job.location} - ${job.budget}</p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(job._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
