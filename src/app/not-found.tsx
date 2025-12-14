"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <h1 className="text-9xl font-bold text-secondary animate-pulse">
                  404
                </h1>
                <AlertCircle className="h-8 w-8 text-muted-foreground absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground">
                The page you are looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary" size="lg" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
