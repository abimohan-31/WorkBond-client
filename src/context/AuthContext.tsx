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

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "provider" | "customer";
  isApproved?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  };

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

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

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, checkAuth }}
    >
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
