"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadBox } from "@/components/ui/upload-box";

export default function CreateWorkPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    beforeImage: "",
    afterImage: "",
    isPublic: true,
  });

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      setCheckingSubscription(true);
      const { paymentService } = await import("@/services/payment.service");
      const response = await paymentService.getSubscriptionStatus();
      
      if (response.success && response.data?.activeSubscription) {
        setHasActiveSubscription(true);
      } else {
        setHasActiveSubscription(false);
        toast.error("You need an active subscription to create work posts");
        setTimeout(() => {
          router.push("/provider/subscriptions");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error checking subscription:", error);
      setHasActiveSubscription(false);
      toast.error("Failed to verify subscription status");
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string, field: "beforeImage" | "afterImage") => {
    setFormData((prev) => ({ ...prev, [field]: url }));
    toast.success("Image uploaded successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.beforeImage || !formData.afterImage) {
      toast.error("Please upload both Before and After images");
      return;
    }

    setLoading(true);

    try {
      const response = await providerService.createWorkPost(formData);
      if (response.success) {
        toast.success("Work post created successfully");
        router.push("/provider/work-posts");
      } else {
        throw new Error(response.message || "Failed to create post");
      }
    } catch (error: any) {
      console.error("Error creating work post:", error);
      toast.error(error.message || "Failed to create work post");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSubscription) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying subscription...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need an active subscription to create work posts. Redirecting to subscription page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Work Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Kitchen Renovation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Plumbing, Carpentry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the work done..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadBox
                label="Before Image"
                value={formData.beforeImage}
                onUpload={(url) => handleImageUpload(url, "beforeImage")}
                onClear={() => setFormData((prev) => ({ ...prev, beforeImage: "" }))}
              />
              <UploadBox
                label="After Image"
                value={formData.afterImage}
                onUpload={(url) => handleImageUpload(url, "afterImage")}
                onClear={() => setFormData((prev) => ({ ...prev, afterImage: "" }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked as boolean }))}
              />
              <Label htmlFor="isPublic">Make this post public</Label>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
