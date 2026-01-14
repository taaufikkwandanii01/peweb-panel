import { supabase } from "@/lib/supabase";
import type { User, UserMetadata, AuthResponse } from "@/types/auth";
import { AuthError } from "@supabase/supabase-js";

export interface UpdateUserStatusData {
  userId: string;
  status: "pending" | "approved" | "rejected";
}

export interface PendingUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: UserMetadata;
}

export const adminService = {
  /**
   * Get all pending users that need approval
   */
  async getPendingUsers(): Promise<AuthResponse<PendingUser[]>> {
    try {
      // Note: This requires admin access
      // You might need to use Supabase Admin API or create a database function
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const userMetadata = user.user_metadata as UserMetadata;
      if (userMetadata.role !== "admin") {
        throw new Error("Not authorized. Admin access required.");
      }

      // This is a placeholder - you'll need to implement this based on your setup
      // Option 1: Use Supabase Admin API (server-side only)
      // Option 2: Create a database view/function that admins can query

      return {
        success: true,
        message: "Pending users retrieved successfully",
        data: [],
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.message || "Failed to get pending users",
        error: authError,
      };
    }
  },

  /**
   * Update user status (approve/reject)
   */
  async updateUserStatus(
    data: UpdateUserStatusData
  ): Promise<AuthResponse<null>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const userMetadata = user.user_metadata as UserMetadata;
      if (userMetadata.role !== "admin") {
        throw new Error("Not authorized. Admin access required.");
      }

      // Note: Updating user metadata requires Supabase Admin API
      // This needs to be done server-side with service role key
      // You should create an API route for this

      // Example API call (you need to implement the API route):
      const response = await fetch("/api/admin/update-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user status");
      }

      return {
        success: true,
        message: `User ${data.status} successfully`,
      };
    } catch (error) {
      const authError = error as Error;
      return {
        success: false,
        message: authError.message || "Failed to update user status",
        error: authError,
      };
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<AuthResponse<User[]>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const userMetadata = user.user_metadata as UserMetadata;
      if (userMetadata.role !== "admin") {
        throw new Error("Not authorized. Admin access required.");
      }

      // This requires server-side implementation with Admin API
      const response = await fetch("/api/admin/users");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get users");
      }

      const users = await response.json();

      return {
        success: true,
        message: "Users retrieved successfully",
        data: users,
      };
    } catch (error) {
      const authError = error as Error;
      return {
        success: false,
        message: authError.message || "Failed to get users",
        error: authError,
      };
    }
  },
};
