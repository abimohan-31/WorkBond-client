"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Users,
  CheckSquare,
  CreditCard,
  DollarSign,
  Star,
  PlusCircle,
  X,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "provider" | "customer";
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const permissions = usePermissions();

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
    {
      label: "Reviews",
      href: "/workbond/admin/reviews",
      icon: Star,
      show: permissions.isAdmin,
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
      icon: Briefcase,
      show: permissions.canViewOwnJobPosts,
    },
    {
      label: "Reviews",
      href: "/customer/reviews",
      icon: Star,
      show: permissions.isCustomer,
    },

    // Provider Items
    {
      label: "Dashboard",
      href: "/provider/dashboard",
      icon: LayoutDashboard,
      show: permissions.isProvider,
    },
    {
      label: "Create Work Post",
      href: "/provider/work-posts/create",
      icon: PlusCircle,
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
      show: permissions.isProvider,
    },
    {
      label: "Subscriptions",
      href: "/provider/subscriptions",
      icon: CreditCard,
      show: permissions.isProvider,
    },
    {
      label: "Price List",
      href: "/pricelists",
      icon: DollarSign,
      show: permissions.isProvider,
    },

    // Shared / Common
    {
      label: "Profile",
      href: role === "admin" ? `/workbond/${role}/profile` : `/${role}/profile`,
      icon: User,
      show: role !== "admin",
    },
  ];

  const visibleItems = menuItems.filter((item) => item.show);

  return (
    <>
      <div
        className={cn(
          "inset-0 z-40 bg-black/50 transition-opacity md:hidden mx-4",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "top-0 left-0 z-50 h-full w-64 border-r bg-background transition-transform transform md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {visibleItems.map((link) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                  onClick={onClose}
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
    </>
  );
}
