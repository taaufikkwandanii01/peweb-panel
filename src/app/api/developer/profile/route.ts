import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET - Get current developer profile
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

    // Get profile from database
    const { data: profile, error: profileError } = await supabase
      .from("usersProfiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    // Check if user is developer
    if (profile.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/developer/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update developer profile
export async function PUT(request: NextRequest) {
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

    // Get current profile to check role
    const { data: currentProfile, error: profileError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is developer
    if (currentProfile.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { full_name, phone, location, bio, github, linkedin, expertise } =
      body;

    // Validate required fields
    if (!full_name) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // Update profile in database
    const { data: updatedProfile, error: updateError } = await supabase
      .from("usersProfiles")
      .update({
        full_name,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        github: github || null,
        linkedin: linkedin || null,
        expertise: expertise || null,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully", profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in PUT /api/developer/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
