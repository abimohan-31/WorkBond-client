"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 p-4 md:p-8">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu />
        </Button>
        {children}
      </main>
    </div>
  );
}
