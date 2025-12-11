"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { providerService } from "@/services/provider.service";
import { toast } from "sonner";
import { Loader2, Eye } from "lucide-react";
import { ProviderDetailsModal } from "@/components/modals/ProviderDetailsModal";

interface WorkPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  providerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    experience_years: number;
    skills: string[];
    availability_status: string;
    profileImage?: string;
  };
  createdAt: string;
}

export default function CustomerWorkPostsPage() {
  const [workPosts, setWorkPosts] = useState<WorkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchWorkPosts();
  }, []);

  const fetchWorkPosts = async () => {
    try {
      setLoading(true);
      const response = await providerService.getAllPublicWorkPosts();
      if (response.success) {
        setWorkPosts(response.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching work posts:", error);
      toast.error("Failed to load work posts");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (provider: any) => {
    setSelectedProvider(provider);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Work Showcases</h1>
          <p className="text-muted-foreground">
            Browse completed work from our professional service providers
          </p>
        </div>

        {workPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No work posts available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workPosts.map((post) => (
              <Card key={post._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {post.providerId.name}
                      </p>
                    </div>
                    {post.category && (
                      <Badge variant="secondary">{post.category}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Before</p>
                      <img
                        src={post.beforeImage}
                        alt="Before"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">After</p>
                      <img
                        src={post.afterImage}
                        alt="After"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  </div>

                  {post.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                  )}

                  <div className="pt-2">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleViewDetails(post.providerId)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Provider Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ProviderDetailsModal
        provider={selectedProvider}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
