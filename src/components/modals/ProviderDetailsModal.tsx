"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  CheckCircle,
} from "lucide-react";
import { reviewService } from "@/services/review.service";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Provider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: string;
  profileImage?: string;
  rating?: number;
}

interface Review {
  _id: string;
  customer_id: any;
  rating: number;
  comment: string;
  review_date: string;
}

interface ProviderDetailsModalProps {
  provider: Provider | null;
  open: boolean;
  onClose: () => void;
}

export function ProviderDetailsModal({
  provider,
  open,
  onClose,
}: ProviderDetailsModalProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (open && provider && user) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [open, provider, user]);

  const fetchReviews = async () => {
    if (!provider) return;
    try {
      setLoadingReviews(true);
      const response = await reviewService.getAll({
        provider_id: provider._id,
      });
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={provider.profileImage} alt={provider.name} />
              <AvatarFallback className="text-2xl">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{provider.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    provider.availability_status === "Available"
                      ? "default"
                      : "secondary"
                  }
                >
                  {provider.availability_status}
                </Badge>
                {provider.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{provider.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{provider.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{provider.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{provider.experience_years} years</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Reviews</h4>
              {loadingReviews ? (
                <p className="text-sm text-muted-foreground">
                  Loading reviews...
                </p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <Card key={review._id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <span>{review.rating}/5</span>
                            <span className="text-warning">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </span>
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {typeof review.customer_id === "object"
                              ? review.customer_id.name
                              : "Customer"}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
