"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { reviewService } from "@/services/review.service";
import { customerService } from "@/services/customer.service";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Review {
  _id: string;
  customer_id: any;
  provider_id: any;
  rating: number;
  comment: string;
  review_date: string;
}

interface Provider {
  _id: string;
  name: string;
  email: string;
  skills: string[];
}

export default function CustomerReviewsPage() {
  const { user } = useAuth();
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    provider_id: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, providersRes] = await Promise.all([
        reviewService.getAll(),
        apiClient.get("/customers/providers"),
      ]);

      setReviewList(reviewsRes.data || []);
      setProviders(providersRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newReview.provider_id || !newReview.comment) {
      toast.error("Please select a provider and write a comment");
      return;
    }

    try {
      await reviewService.create(newReview);
      toast.success("Review posted successfully");
      setIsCreateDialogOpen(false);
      setNewReview({ provider_id: "", rating: 5, comment: "" });
      fetchData();
    } catch (error: any) {
      console.error("Error creating review:", error);
      toast.error(error.response?.data?.message || "Failed to post review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewService.delete(id);
      toast.success("Review deleted");
      fetchData();
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with a service provider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provider *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newReview.provider_id}
                  onChange={(e) => setNewReview({ ...newReview, provider_id: e.target.value })}
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.name} - {provider.skills.join(", ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Rating * ({newReview.rating}/5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Comment *</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Post Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading reviewService...</p>
        </div>
      ) : reviewList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Write Your First Review</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviewList.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>Rating: {review.rating}/5</span>
                      <span className="text-yellow-500">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Provider: {typeof review.provider_id === 'object' ? review.provider_id.name : 'Provider'}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(review._id)}>
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on{" "}
                  {review.review_date
                    ? new Date(review.review_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
