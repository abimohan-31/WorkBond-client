"use client";

import { useAuth } from "@/contexts/AuthContext";
import CustomerTopbarLayout from "@/components/CustomerTopbarLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "customer") {
    return null;
  }

  return <CustomerTopbarLayout>{children}</CustomerTopbarLayout>;
}
