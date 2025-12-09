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
import { User } from "@/types/user";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const storedUser = Cookies.get("user");
      if (!storedUser) {
        return;
      }

      const userData = JSON.parse(storedUser);
      if (!userData?.role || !userData?._id) {
        return;
      }

      const response = await authService.getCurrentUser(
        userData.role,
        userData._id
      );
      if (response.success && response.data?.user) {
        const refreshedUserData = response.data.user;
        setUser(refreshedUserData);
        Cookies.set("user", JSON.stringify(refreshedUserData));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // Don't clear auth state on refresh failure - user might still be valid
      // Only log the error
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // Check user data stored in non-sensitive cookie
      const storedUser = Cookies.get("user");
      const token = Cookies.get("token");

      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Optionally verify token is still valid by refreshing user
          // Don't await - let it happen in background
          refreshUser().catch(() => {
            // Silently fail - user data from cookie is still valid
          });
        } catch (error) {
          console.error("Failed to parse user data:", error);
          Cookies.remove("user");
          Cookies.remove("token");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove("user");
      Cookies.remove("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    // Store token in cookie
    Cookies.set("token", token, { expires: 7, path: "/" }); // 7 days expiry
    Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" });
    
    // Set state immediately
    setUser(userData);
    
    toast.success("Logged in successfully");

    // Redirect based on role
    if (userData.role === "admin") {
      router.push("/workbond/admin/dashboard");
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

  const logout = () => {
    // Call backend to clear HttpOnly cookie
    authService.logout().catch((error) => {
      console.error("Logout error:", error);
    });

    setUser(null);
    Cookies.remove("user");
    Cookies.remove("token");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
