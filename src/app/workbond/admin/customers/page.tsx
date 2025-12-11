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
import { CustomerType } from "@/types/customer";
import { RefreshCw, Ban, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
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
      fetchCustomers();
    }
  }, [user]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllCustomers();
      setCustomers(response.data?.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCustomers();
    setIsRefreshing(false);
    toast.success("Customers refreshed");
  };

  const handleBanCustomer = async (customerId: string, customerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Ban Customer",
      description: `Are you sure you want to ban ${customerName}? They will not be able to access the system.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          await adminService.banCustomer(customerId);
          toast.success(`${customerName} has been banned`);
          fetchCustomers();
        } catch (error) {
          toast.error("Failed to ban customer");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleActivateCustomer = async (customerId: string, customerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Activate Customer",
      description: `Are you sure you want to activate ${customerName}? They will be able to access the system.`,
      onConfirm: async () => {
        try {
          await adminService.activateCustomer(customerId);
          toast.success(`${customerName} has been activated`);
          fetchCustomers();
        } catch (error) {
          toast.error("Failed to activate customer");
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Customer",
      description: `Are you sure you want to delete ${customerName}? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          await adminService.deleteCustomer(customerId);
          toast.success(`${customerName} has been deleted`);
          fetchCustomers();
        } catch (error) {
          toast.error("Failed to delete customer");
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
        <h1 className="text-3xl font-bold">Customers</h1>
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
                  <TableHead>Account Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Badge variant={customer.account_status === "active" ? "default" : "destructive"}>
                        {customer.account_status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {customer.account_status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBanCustomer(customer._id, customer.name)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivateCustomer(customer._id, customer.name)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No customers found
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
