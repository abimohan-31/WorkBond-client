"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  CreditCard,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/workbond/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Providers",
    href: "/workbond/admin/providers",
    icon: Briefcase,
  },
  {
    title: "Customers",
    href: "/workbond/admin/customers",
    icon: Users,
  },
  {
    title: "Pending Approvals",
    href: "/workbond/admin/pending-providers",
    icon: UserCheck,
  },
  {
    title: "Services",
    href: "/workbond/admin/services",
    icon: Settings,
  },
  {
    title: "Subscriptions",
    href: "/workbond/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Reviews",
    href: "/workbond/admin/reviews",
    icon: Star,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card px-3 py-4">
      <div className="mb-8 px-4 flex items-center">
        <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
      </div>
      <div className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
      <div className="mt-auto border-t pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
