"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { adminApi, Provider } from "@/lib/api/admin";
import { RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Only fetch pending providers for dashboard - customers and providers should be loaded on their dedicated pages
      const pendingRes = await adminApi.getPendingProviders();
      setPendingProviders(pendingRes.data?.providers || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveProvider(id);
      toast.success("Provider approved successfully");
      setOpenDialogs({ ...openDialogs, [`approve-${id}`]: false });
      await fetchData();
    } catch (error) {
      console.error("Error approving provider:", error);
      toast.error(
        error instanceof Error ? error.message : "Error approving provider"
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectProvider(id);
      toast.success("Provider rejected successfully");
      setOpenDialogs({ ...openDialogs, [`reject-${id}`]: false });
      await fetchData();
    } catch (error) {
      console.error("Error rejecting provider:", error);
      toast.error(
        error instanceof Error ? error.message : "Error rejecting provider"
      );
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
          <CardTitle>Pending Provider Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingProviders.length}</div>
        </CardContent>
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
                  <TableHead>Experience</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProviders.map((provider) => (
                  <TableRow key={provider._id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.phone}</TableCell>
                    <TableCell>{provider.experience_years} years</TableCell>
                    <TableCell>{provider.skills.join(", ")}</TableCell>
                    <TableCell>
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Dialog
                        open={openDialogs[`approve-${provider._id}`]}
                        onOpenChange={(open) =>
                          setOpenDialogs({
                            ...openDialogs,
                            [`approve-${provider._id}`]: open,
                          })
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Provider</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to approve {provider.name}?
                              They will be able to log in and accept jobs.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() =>
                                setOpenDialogs({
                                  ...openDialogs,
                                  [`approve-${provider._id}`]: false,
                                })
                              }
                            >
                              Cancel
                            </Button>
                            <Button onClick={() => handleApprove(provider._id)}>
                              Confirm Approval
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={openDialogs[`reject-${provider._id}`]}
                        onOpenChange={(open) =>
                          setOpenDialogs({
                            ...openDialogs,
                            [`reject-${provider._id}`]: open,
                          })
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Provider</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reject {provider.name}?
                              This will keep their record but mark them as
                              rejected.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() =>
                                setOpenDialogs({
                                  ...openDialogs,
                                  [`reject-${provider._id}`]: false,
                                })
                              }
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(provider._id)}
                            >
                              Confirm Rejection
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingProviders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No pending providers
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
