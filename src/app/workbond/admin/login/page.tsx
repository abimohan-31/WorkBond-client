"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Shield, Lock } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in as admin - must be in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.push("/workbond/admin/dashboard");
    }
  }, [authLoading, user, router]);

  // Show loading state while checking auth or redirecting
  if (authLoading || user?.role === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      setIsLoading(true);

      // Attempt login with admin role
      const result = await authService.login({
        ...data,
        role: "admin",
      });

      // Check if login was successful
      if (!result.success) {
        const errorMessage = result.message || result.error || "Login failed";
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Check if user data exists
      if (!result.data || !result.data.user) {
        toast.error("Invalid response from server");
        setIsLoading(false);
        return;
      }

      // Verify admin role
      if (result.data.user.role !== "admin") {
        toast.error("Access Denied. This portal is for Administrators only.");
        setIsLoading(false);
        return;
      }

      // Get token from response
      const token = result.data.token || "";

      // Login and redirect
      await login(token, result.data.user);

      // Redirect to admin dashboard
      router.push("/workbond/admin/dashboard");
    } catch (error: any) {
      // Extract error message from various possible locations
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Invalid credentials. Please check your email and password.";

      toast.error(errorMessage);

      // Log full error for debugging in development
      if (process.env.NODE_ENV === "development") {
        console.error("Admin login error:", {
          response: error.response?.data,
          status: error.response?.status,
          message: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-border bg-card text-card-foreground">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter your administrator credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@workbond.com"
                        disabled={isLoading}
                        className="h-11 bg-background border-input text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className="h-11  bg-background border-input text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Authenticating...</span>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Unauthorized access is prohibited</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
