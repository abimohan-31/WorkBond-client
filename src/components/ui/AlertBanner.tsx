import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const alertStyles: Record<AlertType, { variant: "default" | "destructive"; icon: React.ElementType; className: string }> = {
  success: {
    variant: "default",
    icon: CheckCircle2,
    className: "border-success/50 text-success dark:border-success [&>svg]:text-success",
  },
  error: {
    variant: "destructive",
    icon: XCircle,
    className: "",
  },
  warning: {
    variant: "default",
    icon: AlertCircle,
    className: "border-warning/50 text-warning dark:border-warning [&>svg]:text-warning",
  },
  info: {
    variant: "default",
    icon: Info,
    className: "border-info/50 text-info dark:border-info [&>svg]:text-info",
  },
};

export function AlertBanner({ type = "info", title, message, className }: AlertBannerProps) {
  const { variant, icon: Icon, className: styleClass } = alertStyles[type];

  return (
    <Alert variant={variant} className={cn(styleClass, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
