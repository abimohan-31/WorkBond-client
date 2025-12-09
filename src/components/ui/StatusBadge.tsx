import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusType = "pending" | "approved" | "rejected" | "active" | "inactive" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning text-warning-foreground hover:bg-warning/90",
  approved: "bg-success text-success-foreground hover:bg-success/90",
  active: "bg-success text-success-foreground hover:bg-success/90",
  completed: "bg-success text-success-foreground hover:bg-success/90",
  rejected: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  inactive: "bg-muted text-muted-foreground hover:bg-muted/90",
  cancelled: "bg-muted text-muted-foreground hover:bg-muted/90",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <Badge className={cn("capitalize", style, className)}>
      {status}
    </Badge>
  );
}
