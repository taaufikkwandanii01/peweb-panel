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

export interface ApiUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: UserMetadata;
  role: string;
  status: string;
  full_name: string;
  phone: string;
}

export const adminService = {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<AuthResponse<ApiUser[]>> {
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

      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get users");
      }

      const users: ApiUser[] = await response.json();

      const developerUsers = users.filter((user) => user.role === "developer");

      return {
        success: true,
        message: "Developer users retrieved successfully",
        data: developerUsers,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message || "Failed to get users",
        error: err,
      };
    }
  },

  /**
   * Update user status (approve/reject)
   */
  async updateUserStatus(
    data: UpdateUserStatusData,
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

      const response = await fetch("/api/admin/users/update-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user status");
      }

      const result = await response.json();

      return {
        success: true,
        message: result.message || `User ${data.status} successfully`,
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
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<AuthResponse<null>> {
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

      const response = await fetch("/api/admin/users/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      const authError = error as Error;
      return {
        success: false,
        message: authError.message || "Failed to delete user",
        error: authError,
      };
    }
  },

  /**
   * Get all pending users that need approval
   */
  async getPendingUsers(): Promise<AuthResponse<ApiUser[]>> {
    try {
      const result = await this.getAllUsers();

      if (!result.success || !result.data) {
        return result;
      }

      const pendingUsers = result.data.filter(
        (user) => user.status === "pending",
      );

      return {
        success: true,
        message: "Pending developer users retrieved successfully",
        data: pendingUsers,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message || "Failed to get pending users",
        error: err,
      };
    }
  },
};
