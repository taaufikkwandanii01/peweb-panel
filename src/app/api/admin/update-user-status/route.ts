import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: userId and status" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, approved, or rejected" },
        { status: 400 }
      );
    }

    // Use admin client to update user
    const adminClient = await createAdminClient();

    // Update user metadata using Admin API
    const { data: updatedUser, error: updateError } =
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: { status },
      });

    if (updateError) {
      console.error("Error updating user status:", updateError);
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `User ${status} successfully`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unexpected error in POST /api/admin/update-user-status:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
