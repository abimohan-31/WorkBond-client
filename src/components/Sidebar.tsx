"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Settings,
  Briefcase,
  Calendar,
  Users,
  CheckSquare,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "provider" | "customer";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/providers", label: "Providers", icon: Briefcase },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const providerLinks = [
    { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/provider/profile", label: "Profile", icon: User },
  ];

  const customerLinks = [
    { href: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customer/job-posts", label: "Job Posts", icon: Calendar },
    { href: "/customer/profile", label: "Profile", icon: User },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "provider"
      ? providerLinks
      : customerLinks;

  return (
    <div className="pb-12 min-h-screen w-64 border-r bg-background hidden md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className="w-full justify-start"
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
