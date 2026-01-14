import { supabase } from "@/lib/supabase";
import type { 
  RegisterData, 
  LoginData, 
  UserMetadata, 
  AuthResponse,
  Session,
  User 
} from "@/types/auth";
import { AuthError } from "@supabase/supabase-js";

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    try {
      // Register user dengan Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        phone: data.phone,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: data.role || "developer",
            status: "pending", // Default status adalah pending
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Logout setelah register agar user harus login manual
      await supabase.auth.signOut();

      return {
        success: true,
        message: "Registration successful! Please wait for admin approval before logging in.",
        data: authData,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.message || "Registration failed",
        error: authError,
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse<{ user: User; session: Session }>> {
    try {
      // Step 1: Login dengan email & password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user || !authData.session) {
        throw new Error("Invalid login response");
      }

      // Step 2: Ambil metadata user
      const userMetadata = authData.user.user_metadata as UserMetadata;

      // Step 3: Validasi role
      const userRole = userMetadata.role;
      if (!userRole) {
        await supabase.auth.signOut();
        throw new Error("User role is not defined. Please contact administrator.");
      }

      if (userRole !== data.role) {
        await supabase.auth.signOut();
        throw new Error(`This account is registered as ${userRole}, not ${data.role}. Please select the correct role.`);
      }

      // Step 4: Validasi status approval - INI YANG PALING PENTING!
      const userStatus = userMetadata.status;
      
      if (!userStatus || userStatus === "pending") {
        await supabase.auth.signOut();
        throw new Error("Your account is pending approval. Please wait for admin to approve your account before you can login.");
      }

      if (userStatus === "rejected") {
        await supabase.auth.signOut();
        throw new Error("Your account has been rejected. Please contact administrator for more information.");
      }

      if (userStatus !== "approved") {
        await supabase.auth.signOut();
        throw new Error("Your account status is invalid. Please contact administrator.");
      }

      // Step 5: Login berhasil - session sudah di-set oleh Supabase
      return {
        success: true,
        message: "Login successful!",
        data: authData as { user: User; session: Session },
        role: userRole,
      };
    } catch (error) {
      const authError = error as AuthError;
      console.error("LOGIN ERROR:", authError);

      return {
        success: false,
        message: authError.message || "Login failed",
        error: authError,
      };
    }
  },

  async logout(): Promise<AuthResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.message || "Logout failed",
        error: authError,
      };
    }
  },

  async getCurrentUser(): Promise<AuthResponse<User | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "User retrieved successfully",
        data: user as User | null,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.message,
        error: authError,
      };
    }
  },

  async getSession(): Promise<AuthResponse<Session | null>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Session retrieved successfully",
        data: session as Session | null,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.message,
        error: authError,
      };
    }
  },
};
