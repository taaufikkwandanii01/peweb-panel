// src/app/api/admin/users/update-user-status/route.ts

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
        { status: 401 },
      );
    }

    // Check if user is admin
    const userMetadata = user.user_metadata;
    if (userMetadata.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: userId and status" },
        { status: 400 },
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, approved, or rejected" },
        { status: 400 },
      );
    }

    // Use admin client to update user
    const adminClient = await createAdminClient();

    // Get user data first to retrieve metadata
    const { data: targetUser, error: getUserError } =
      await adminClient.auth.admin.getUserById(userId);

    if (getUserError || !targetUser.user) {
      console.error("Error getting user:", getUserError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user metadata using Admin API
    const { data: updatedUser, error: updateError } =
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: { ...targetUser.user.user_metadata, status },
      });

    if (updateError) {
      console.error("Error updating user status:", updateError);
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 },
      );
    }

    // Create usersProfiles entry when approved
    if (status === "approved" && updatedUser.user) {
      const userMetadata = updatedUser.user.user_metadata;

      const { data: existingProfile } = await supabase
        .from("usersProfiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from("usersProfiles")
          .insert({
            id: userId,
            email: updatedUser.user.email || "",
            full_name: userMetadata.full_name || "",
            phone: userMetadata.phone || null,
            role: userMetadata.role || "developer",
            status: status,
            location: null,
            bio: null,
            github: null,
            linkedin: null,
            expertise: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          console.warn(
            `User ${userId} approved but profile creation failed:`,
            profileError,
          );
        } else {
          console.log(`✅ Profile created for user ${userId}`);
        }
      } else {
        console.log(`ℹ️ Profile already exists for user ${userId}`);
      }
    }

    // ============ NEW: Auto-pending products when user rejected ============
    if (status === "rejected") {
      // Update products to pending
      const { data: productsUpdated, error: productsError } = await supabase
        .from("products")
        .update({
          status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("developer_id", userId)
        .select();

      if (productsError) {
        console.error("Error auto-pending products:", productsError);
        // Don't fail the rejection if products update fails
        console.warn(
          `User ${userId} rejected but products update failed:`,
          productsError,
        );
      } else {
        const count = productsUpdated?.length || 0;
        console.log(
          `✅ Auto-pending ${count} products for rejected user ${userId}`,
        );
      }
    }
    // ============ END OF NEW FEATURE ============

    return NextResponse.json(
      {
        message: `User ${status} successfully`,
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Unexpected error in POST /api/admin/users/update-user-status:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
