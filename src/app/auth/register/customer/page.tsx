"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth.service";

const registerCustomerSchema = z
  .object({
    name: z
      .string()
      .min(1, "name is required")
      .refine((val) => val.trim().length >= 3, {
        message: "name must be at least 3 letters",
      }),
    email: z
      .string()
      .min(1, "email is required")
      .refine((val) => val.includes("@"), {
        message: "invalid email address",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;

export default function RegisterCustomerPage() {
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<RegisterCustomerFormValues>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterCustomerFormValues) => {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registerData } = data;

      const result = await authService.register({
        ...registerData,
        role: "customer",
      });

      // Check if registration was successful
      if (!result.success) {
        throw new Error(
          result.message || result.error || "Registration failed"
        );
      }

      // Check if user data exists in response
      if (!result.data || !result.data.user) {
        throw new Error("Invalid response from server");
      }

      // Automatically log in the user after successful registration
      // Backend doesn't set cookie during registration, so we need to login
      try {
        const loginResult = await authService.login({
          email: data.email,
          password: data.password,
          role: "customer",
        });

        if (loginResult.success && loginResult.data?.user) {
          // Login function accepts token and userData
          const token = loginResult.data.token || "";
          await login(token, loginResult.data.user);
          toast.success("Account created and logged in successfully!");
          router.push("/customer/dashboard");
        } else {
          // Registration successful but auto-login failed, redirect to login
          toast.success("Account created successfully! Please log in.");
          router.push("/auth/login");
        }
      } catch (loginError: any) {
        // Registration successful but auto-login failed, redirect to login
        toast.success("Account created successfully! Please log in.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign Up as Customer</h1>
          <p className="text-muted-foreground mt-2">
            Create an account to book services.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="******"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="******"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline hover:text-primary">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
