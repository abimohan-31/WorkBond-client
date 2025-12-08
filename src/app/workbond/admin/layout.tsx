"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to login page without authentication
  const isLoginPage = pathname === "/workbond/admin/login";

  useEffect(() => {
    if (!isLoading) {
      // If on login page and already logged in as admin, redirect to dashboard
      if (isLoginPage && user && user.role === "admin") {
        router.push("/workbond/admin/dashboard");
        return;
      }

      // If not on login page and not authenticated as admin, redirect to login
      if (!isLoginPage && (!user || user.role !== "admin")) {
        router.push("/workbond/admin/login");
        return;
      }
    }
  }, [user, isLoading, router, isLoginPage]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If on login page, render children without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated as admin, don't render (redirect will happen)
  if (!user || user.role !== "admin") {
    return null;
  }

  // Render admin layout with sidebar for authenticated admins
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
