"use client";

import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="customer" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* <Card>
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$0.00</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
