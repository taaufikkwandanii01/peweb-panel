import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userMetadata = user.user_metadata;
    if (userMetadata.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Use admin client to get all users
    const adminClient = await createAdminClient();
    
    const { data: authUsers, error: usersError } =
      await adminClient.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Transform users to match our ApiUser interface
    const users = authUsers.users.map((u) => ({
      id: u.id,
      email: u.email || "",
      created_at: u.created_at,
      user_metadata: u.user_metadata,
      role: u.user_metadata?.role || "developer",
      status: u.user_metadata?.status || "pending",
      full_name: u.user_metadata?.full_name || "",
      phone: u.user_metadata?.phone || "",
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
