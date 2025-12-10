"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { WorkPostType } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function WorkPostsPage() {
  const [workPosts, setWorkPosts] = useState<WorkPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWorkPosts();
  }, []);

  const fetchWorkPosts = async () => {
    try {
      const response = await providerService.getWorkPosts();
      if (response.success && response.data) {
        // Handle both array directly or nested in data property
        const posts = Array.isArray(response.data) ? response.data : (response.data as any).workPosts || [];
        setWorkPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching work posts:", error);
      toast.error("Failed to load work posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await providerService.deleteWorkPost(id);
      if (response.success) {
        toast.success("Work post deleted successfully");
        fetchWorkPosts();
      }
    } catch (error) {
      console.error("Error deleting work post:", error);
      toast.error("Failed to delete work post");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading work posts...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Work Portfolio</h1>
        <Button onClick={() => router.push("/provider/work-posts/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      {workPosts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">You haven't posted any work yet.</p>
          <Button onClick={() => router.push("/provider/work-posts/create")}>
            Start Building Your Portfolio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workPosts.map((post) => (
            <Card key={post._id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full relative">
                    <img 
                      src={post.beforeImage} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-black/70">Before</Badge>
                  </div>
                  <div className="w-1/2 h-full relative">
                    <img 
                      src={post.afterImage} 
                      alt="After" 
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-600">After</Badge>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate" title={post.title}>{post.title}</CardTitle>
                  <Badge variant={post.isPublic ? "default" : "secondary"}>
                    {post.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{post.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{post.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/provider/work-posts/edit/${post._id}`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(post._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
