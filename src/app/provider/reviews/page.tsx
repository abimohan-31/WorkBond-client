"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProviderReviewsPage() {
  const [reviewList, setReviewList] = useState([]);
  const { isProvider } = usePermissions();

  useEffect(() => {
    if (isProvider) loadReviews();
  }, [isProvider]);

  const loadReviews = async () => {
    try {
      const res = await reviews.getAll();
      setReviewList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    }
  };

  if (!isProvider) return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {reviewList.map((review: any) => (
          <Card key={review._id}>
            <CardHeader><CardTitle>Rating: {review.rating}/5</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2">{review.comment}</p>
              <p className="text-sm text-muted-foreground">From: {review.customer?.name || "Customer"}</p>
            </CardContent>
          </Card>
        ))}
        {reviewList.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
      </div>
    </div>
  );
}
