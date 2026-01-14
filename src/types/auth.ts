export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: "developer" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
  role: "developer" | "admin";
}

export interface UserMetadata {
  full_name?: string;
  phone?: string;
  role?: "developer" | "admin";
  status?: "pending" | "approved" | "rejected";
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: Error;
  role?: "developer" | "admin";
}

export interface User {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}
