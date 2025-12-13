"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "provider") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "provider") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        role="provider"
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
