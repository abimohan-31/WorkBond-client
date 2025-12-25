"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any[]>([]);
  const [filteredSummary, setFilteredSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { canManageSubscriptions } = usePermissions();

  useEffect(() => {
    if (user && user.role === "admin" && canManageSubscriptions) {
      loadSummary();
    }
  }, [user, canManageSubscriptions]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredSummary(
      summary.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.role.toLowerCase().includes(term)
      )
    );
  }, [search, summary]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubscriptionsSummary();
      setSummary(res.data || []);
      setFilteredSummary(res.data || []);
    } catch (err: any) {
      console.error("Error loading summary:", err);
      toast.error(err.response?.data?.message || "Failed to load subscription summary");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin" || !canManageSubscriptions) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">User Subscription Summary</h1>
        <Button onClick={loadSummary} variant="outline" size="sm">Refresh</Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading summary...</p>
        </div>
      ) : filteredSummary.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSummary.map((item: any) => (
            <Card key={item.id} className="relative overflow-hidden">
              <div 
                className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  item.role === 'provider' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'
                }`}
              >
                {item.role}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{item.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Status</span>
                  <StatusBadge 
                    status={item.status} 
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Joined On</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Trial Expires</span>
                    <span className={new Date(item.trialExpiresAt) < new Date() ? 'text-destructive font-semibold' : ''}>
                      {new Date(item.trialExpiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {item.subscription ? (
                  <div className="mt-4 p-3 bg-card border rounded-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <Info className="h-4 w-4 text-primary" />
                      Active Plan: {item.subscription.plan}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p>{new Date(item.subscription.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expiry Date</p>
                        <p>{new Date(item.subscription.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-muted/50 border border-dashed rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">No active subscription</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
