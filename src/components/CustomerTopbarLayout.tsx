"use client";

import Link from "next/link";
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
import { User, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function CustomerTopbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="mx-35 min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between ">
          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
