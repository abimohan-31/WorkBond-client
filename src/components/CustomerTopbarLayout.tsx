"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Menu, ArrowLeft, Home } from "lucide-react";
import { useState } from "react";

export default function CustomerTopbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboard = pathname === "/customer/dashboard";

  return (
    <div className="mx-35 min-h-screen flex flex-col bg-background">
      <header className="w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between ">
          <div className="flex items-center gap-6">
            {isDashboard ? (
              <Link
                href="/"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                <Button variant="ghost" size="sm" className="mt-2 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            ) : (
              <Link
                href="/customer/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                <Button variant="ghost" size="sm" className="mt-2 flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            )}

            <div className="h-6 w-px bg-border mt-2" />

            <Link
              href="/customer/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Button variant="secondary" size="sm" className="mt-2">
                Dashboard
              </Button>
            </Link>
            <Link
              href="/customer/job-posts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Button variant="secondary" size="sm" className="mt-2">
                My Jobs
              </Button>
            </Link>
            <Link
              href="/customer/reviews"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Button variant="secondary" size="sm" className="mt-2">
                Reviews
              </Button>
            </Link>
            <Link
              href="/customer/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Button variant="secondary" size="sm" className="mt-2">
                Profile
              </Button>
            </Link>
            <Link
              href="/customer/subscriptions"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Button variant="secondary" size="sm" className="mt-2">
                Subscription
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 overflow-y-auto">{children}</main>
    </div>
  );
}
