"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { ProviderType } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, X, Phone, Mail, MapPin, Briefcase } from "lucide-react";
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
import { Input } from "@/components/ui/input";

export default function PendingProvidersPage() {
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadPendingProviders();
  }, []);

  const loadPendingProviders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingProviders();
      setProviders(res.data?.providers || []);
    } catch (error) {
      toast.error("Failed to load pending providers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveProvider(id);
      toast.success("Provider approved successfully");
      loadPendingProviders();
    } catch (error) {
      toast.error("Failed to approve provider");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectProvider(id, rejectReason);
      toast.success("Provider rejected successfully");
      setRejectReason("");
      setSelectedProvider(null);
      loadPendingProviders();
    } catch (error) {
      toast.error("Failed to reject provider");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Pending Approvals</h1>
      
      {providers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No pending providers found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{provider.name}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.experience_years} years exp.</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(provider._id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setSelectedProvider(provider._id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Provider Application</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this provider? This action cannot be undone.
                          The provider will be notified via email.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">
                          Reason for Rejection (Optional)
                        </label>
                        <Input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g., Incomplete profile details"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                          setRejectReason("");
                          setSelectedProvider(null);
                        }}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleReject(provider._id)}
                        >
                          Reject Provider
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}