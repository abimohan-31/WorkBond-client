"use client";
import { useEffect, useState } from "react";
import { jobPosts } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProviderJobPostsPage() {
  const [jobs, setJobs] = useState([]);
  const { canApplyJobPost } = usePermissions();

  useEffect(() => {
    if (canApplyJobPost) {
        loadJobs();
    }
  }, [canApplyJobPost]);

  const loadJobs = async () => {
    try {
      const res = await jobPosts.getAll();
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load jobs");
    }
  };

  const handleApply = async (id: string) => {
    try {
      await jobPosts.apply(id);
      toast.success("Applied successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!canApplyJobPost) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Available Jobs</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job: any) => (
          <Card key={job._id}>
            <CardHeader><CardTitle>{job.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2">{job.description}</p>
              <p className="text-sm text-muted-foreground mb-4">{job.location} - ${job.budget}</p>
              <Button className="w-full" onClick={() => handleApply(job._id)}>Apply Now</Button>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && <p className="text-muted-foreground">No jobs available at the moment.</p>}
      </div>
    </div>
  );
}
