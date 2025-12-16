"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { WorkPostType, UpdateWorkPostData } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditWorkPostPage() {
  const [workPost, setWorkPost] = useState<WorkPostType | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateWorkPostData>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchWorkPost(id);
    }
  }, [id]);

  const fetchWorkPost = async (postId: string) => {
    try {
      const response = await providerService.getWorkPostById(postId);
      if (response.success && response.data) {
        const post = (response.data as any).workPost;
        setWorkPost(post);
        setFormData({
          title: post.title,
          description: post.description,
          category: post.category,
          isPublic: post.isPublic,
        });
      }
    } catch (error) {
      console.error("Error fetching work post:", error);
      toast.error("Failed to load work post data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked as boolean }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const response = await providerService.updateWorkPost(id, formData);
      if (response.success) {
        toast.success("Work post updated successfully");
        router.push("/provider/work-posts");
      }
    } catch (error) {
      console.error("Error updating work post:", error);
      toast.error("Failed to update work post");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!workPost) {
    return <div className="p-8 text-center">Work post not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Work Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isPublic">Make this post public</Label>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
