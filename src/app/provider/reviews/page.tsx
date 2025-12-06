"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { providerService } from "@/services/provider.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Review {
  _id: string;
  customer_id: any;
  rating: number;
  comment: string;
  review_date: string;
}

export default function ProviderReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (user && user.role === "provider") {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await providerService.getReviews();
      const reviewData = res.data?.reviews || [];
      setReviews(reviewData);

      if (reviewData.length > 0) {
        const avg = reviewData.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviewData.length;
        setAvgRating(avg);
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "provider") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Reviews</h1>
        {reviews.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-3xl font-bold text-[#061D4E]">
              {avgRating.toFixed(1)} <span className="text-yellow-500">★</span>
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Complete jobs to receive reviews from customers
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
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
                      By: {typeof review.customer_id === 'object' ? review.customer_id.name : 'Customer'}
                    </p>
                  </div>
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
