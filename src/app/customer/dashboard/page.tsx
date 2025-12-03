"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "customer") {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
