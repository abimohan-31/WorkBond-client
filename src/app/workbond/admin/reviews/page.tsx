"use client";
import { useState, useEffect } from "react";
import { reviewService } from "@/services/review.service";
import { ReviewType } from "@/types/review";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAll();
      setReviews(res.data || []);
    } catch (error: any) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await reviewService.delete(reviewToDelete);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error: any) {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setReviewToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Reviews</h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.customer_id?.name}</TableCell>
                <TableCell>{review.provider_id?.name}</TableCell>
                <TableCell>
                  <Badge>{review.rating} ★</Badge>
                </TableCell>
                <TableCell>
                  {new Date(review.review_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      {selectedReview && (
                        <div>
                          <p>
                            <strong>Customer:</strong>{" "}
                            {selectedReview.customer_id?.name}
                          </p>
                          <p>
                            <strong>Provider:</strong>{" "}
                            {selectedReview.provider_id?.name}
                          </p>
                          <p>
                            <strong>Rating:</strong> {selectedReview.rating} ★
                          </p>
                          <p>
                            <strong>Comment:</strong> {selectedReview.comment}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(
                              selectedReview.review_date
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(review._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the review.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminReviewsPage;
