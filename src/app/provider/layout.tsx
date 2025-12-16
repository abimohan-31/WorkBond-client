"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "provider") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsSidebarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsSidebarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    mainElement.addEventListener("scroll", handleScroll);
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Add a loading state to prevent hydration mismatch
  if (typeof window === "undefined" || isLoading) {
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
    <div className="flex h-screen bg-background">
      <div
        className={`fixed md:relative transition-transform duration-300 z-40 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar
          role="provider"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      <main ref={mainRef} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mb-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu />
          </Button>
          {children}
        </div>
      </main>
    </div>
  );
}
