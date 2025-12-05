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
import { adminApi, Provider, Customer } from "@/lib/api/admin";
import { RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pendingRes, providersRes, customersRes] = await Promise.all([
        adminApi.getPendingProviders(),
        adminApi.getAllProviders(),
        adminApi.getAllCustomers(),
      ]);

      setPendingProviders(pendingRes.data?.providers || []);
      setAllProviders(providersRes.data?.providers || []);
      setCustomers(customersRes.data?.customers || []);
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

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProviders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProviders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Providers</TabsTrigger>
            <TabsTrigger value="providers">All Providers</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Provider Approvals</CardTitle>
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
                                    This will keep their record but mark them as rejected.
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
          </TabsContent>

          <TabsContent value="providers">
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
                        <TableHead>Status</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allProviders.map((provider) => (
                        <TableRow key={provider._id}>
                          <TableCell>{provider.name}</TableCell>
                          <TableCell>{provider.email}</TableCell>
                          <TableCell>{provider.phone}</TableCell>
                          <TableCell>
                            {provider.isApproved ? "Approved" : "Pending"}
                          </TableCell><TableCell>
                            {provider.availability_status ? "Available" : "Unavailable"}
                          </TableCell>
                          <TableCell>{provider.rating.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                      {allProviders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No providers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
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
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {customers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No customers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </>
  );
}
