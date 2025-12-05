"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "provider" | "customer";
  isApproved?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check user data stored in non-sensitive cookie
    const storedUser = Cookies.get("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        Cookies.remove("user");
      }
    }
    setIsLoading(false);
  };

  const login = (userData: User) => {
    setUser(userData);

    // Store user data (non-sensitive) in cookies
    Cookies.set("user", JSON.stringify(userData));

    toast.success("Logged in successfully");

    // Redirect based on role
    if (userData.role === "admin") {
      router.push("/admin/dashboard");
    } else if (userData.role === "provider") {
      if (userData.isApproved) {
        router.push("/provider/dashboard");
      } else {
        router.push("/provider/pending");
      }
    } else {
      router.push("/customer/dashboard");
    }
  };

  const logout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include", // important!
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    Cookies.remove("user");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
