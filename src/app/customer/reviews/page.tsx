"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function CustomerReviewsPage() {
  const [reviewList, setReviewList] = useState([]);
  const [newReview, setNewReview] = useState({ providerId: "", rating: "5", comment: "" });
  const { canManageReviews } = usePermissions();

  useEffect(() => {
    if (canManageReviews) loadReviews();
  }, [canManageReviews]);

  const loadReviews = async () => {
    try {
      const res = await reviews.getAll();
      setReviewList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    }
  };

  const handleCreate = async () => {
    if (!newReview.providerId || !newReview.comment) {
        toast.error("Provider ID and Comment are required");
        return;
    }
    try {
      await reviews.create({ ...newReview, rating: Number(newReview.rating) });
      toast.success("Review posted");
      loadReviews();
      setNewReview({ providerId: "", rating: "5", comment: "" });
    } catch (err) {
      toast.error("Failed to post review");
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      try {
          await reviews.delete(id);
          toast.success("Review deleted");
          loadReviews();
      } catch (err) {
          toast.error("Failed to delete review");
      }
  }

  if (!canManageReviews) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>
      <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <Input placeholder="Provider ID" value={newReview.providerId} onChange={(e) => setNewReview({ ...newReview, providerId: e.target.value })} />
        <Input placeholder="Rating (1-5)" type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} />
        <Textarea placeholder="Comment" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
        <Button onClick={handleCreate}>Post Review</Button>
      </div>
      <div className="space-y-4">
        {reviewList.map((review: any) => (
          <Card key={review._id}>
            <CardHeader><CardTitle>Rating: {review.rating}/5</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2">{review.comment}</p>
              <p className="text-sm text-muted-foreground">Provider: {review.provider?.name || review.provider}</p>
              <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(review._id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
