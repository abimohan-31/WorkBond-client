"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  User,
  Settings,
  Briefcase,
  Calendar,
  Users,
  CheckSquare,
  FileText,
  CreditCard,
  DollarSign,
  Star,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "provider" | "customer";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const permissions = usePermissions();

  // Define all possible menu items with their required permission
  const menuItems = [
    // Admin Items
    {
      label: "Dashboard",
      href: "/workbond/admin/dashboard",
      icon: LayoutDashboard,
      show: permissions.isAdmin,
    },
    {
      label: "Providers",
      href: "/workbond/admin/providers",
      icon: Briefcase,
      show: permissions.canManageProviders,
    },
    {
      label: "Customers",
      href: "/workbond/admin/customers",
      icon: Users,
      show: permissions.canManageCustomers,
    },
    {
      label: "Services",
      href: "/workbond/admin/services",
      icon: CheckSquare,
      show: permissions.canManageServices,
    },
    {
      label: "Subscriptions",
      href: "/workbond/admin/subscriptions",
      icon: CreditCard,
      show: permissions.canManageSubscriptions,
    },
    {
      label: "Price Lists",
      href: "/workbond/admin/pricelists",
      icon: DollarSign,
      show: permissions.canManagePriceLists,
    },

    // Customer Items
    {
      label: "Dashboard",
      href: "/customer/dashboard",
      icon: LayoutDashboard,
      show: permissions.isCustomer,
    },
    {
      label: "My Job Posts",
      href: "/customer/job-posts",
      icon: Calendar,
      show: permissions.canViewOwnJobPosts,
    },
    {
      label: "Reviews",
      href: "/customer/reviews",
      icon: Star,
      show: permissions.isCustomer, // Customers can create reviews
    },

    // Provider Items
    {
      label: "Dashboard",
      href: "/provider/dashboard",
      icon: LayoutDashboard,
      show: permissions.isProvider,
    },
    {
      label: "Job Opportunities",
      href: "/provider/job-posts",
      icon: Briefcase,
      show: permissions.canApplyJobPost,
    },
    {
      label: "My Reviews",
      href: "/provider/reviews",
      icon: Star,
      show: permissions.isProvider, // Providers view their reviews
    },
    {
      label: "Subscriptions",
      href: "/provider/subscriptions",
      icon: CreditCard,
      show: permissions.isProvider, // Providers view subscriptions
    },
    {
      label: "Price List",
      href: "/pricelists", // Public page but relevant for provider
      icon: DollarSign,
      show: permissions.isProvider,
    },

    // Shared / Common
    {
      label: "Profile",
      href: role === "admin" ? `/workbond/${role}/profile` : `/${role}/profile`,
      icon: User,
      show: true, // Everyone has a profile
    },
    {
      label: "Settings",
      href: "/workbond/admin/settings", // Only admin has settings page for now
      icon: Settings,
      show: permissions.isAdmin,
    },
  ];

  // Filter items based on permissions
  const visibleItems = menuItems.filter((item) => item.show);

  return (
    <div className="pb-12 min-h-screen w-64 border-r bg-background hidden md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </h2>
          <div className="space-y-1">
            {visibleItems.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === link.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
