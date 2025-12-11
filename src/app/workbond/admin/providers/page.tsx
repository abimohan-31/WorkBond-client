"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { ProviderType } from "@/types/provider";
import { RefreshCw, Ban, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminProvidersPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProviders();
    }
  }, [user]);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllProviders();
      setProviders(response.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch providers"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProviders();
    setIsRefreshing(false);
    toast.success("Providers refreshed");
  };

  const handleBanProvider = async (providerId: string, providerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Ban Provider",
      description: `Are you sure you want to ban ${providerName}? They will not be able to access the system.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          await adminService.banProvider(providerId);
          toast.success(`${providerName} has been banned`);
          fetchProviders();
        } catch (error) {
          toast.error("Failed to ban provider");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleActivateProvider = async (providerId: string, providerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Activate Provider",
      description: `Are you sure you want to activate ${providerName}? They will be able to access the system.`,
      onConfirm: async () => {
        try {
          await adminService.activateProvider(providerId);
          toast.success(`${providerName} has been activated`);
          fetchProviders();
        } catch (error) {
          toast.error("Failed to activate provider");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleDeleteProvider = async (providerId: string, providerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Provider",
      description: `Are you sure you want to delete ${providerName}? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          await adminService.deleteProvider(providerId);
          toast.success(`${providerName} has been deleted`);
          fetchProviders();
        } catch (error) {
          toast.error("Failed to delete provider");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Providers</h1>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Providers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider._id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.phone}</TableCell>
                    <TableCell>
                      <Badge variant={provider.isApproved ? "default" : "secondary"}>
                        {provider.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.account_status === "active" ? "default" : "destructive"}>
                        {provider.account_status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {provider.account_status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBanProvider(provider._id, provider.name)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivateProvider(provider._id, provider.name)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProvider(provider._id, provider.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {providers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No providers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </>
  );
}
