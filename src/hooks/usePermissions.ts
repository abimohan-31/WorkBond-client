import { useAuth } from "@/context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    // Admin Permissions
    canManageServices: role === "admin",
    canManageProviders: role === "admin",
    canManageCustomers: role === "admin",
    canManageSubscriptions: role === "admin",
    canManagePriceLists: role === "admin",
    
    // Customer Permissions
    canCreateJobPost: role === "customer",
    canViewOwnJobPosts: role === "customer",
    
    // Provider Permissions
    canApplyJobPost: role === "provider",
    canViewSubscriptions: role === "provider" || role === "admin",
    
    // Shared / Public
    canManageReviews: role === "customer" || role === "admin",
    canViewReviews: role === "provider" || role === "admin" || role === "customer",
    canViewPriceLists: true, // Public
    
    // Role checks
    isAdmin: role === "admin",
    isCustomer: role === "customer",
    isProvider: role === "provider",
  };
}
