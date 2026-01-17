import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET: Fetch all products for admin
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
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: roleCheck, error: roleError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleCheck || roleCheck.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get filter parameters from query string
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Build query - Fetch products first
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: products, error: productsError } = await query;

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    // If no products, return empty array
    if (!products || products.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Get developer IDs
    const developerIds = [
      ...new Set(products.map((p) => p.developer_id)),
    ] as string[];

    // Get developer profiles from usersProfiles
    const { data: developerProfiles, error: profileError } = await supabase
      .from("usersProfiles")
      .select("id, full_name, phone, email")
      .in("id", developerIds);

    if (profileError) {
      console.error("Error fetching developer profiles:", profileError);
    }

    // Create a map of developer profiles
    const profileMap = new Map(
      developerProfiles?.map((p) => [p.id, p]) || [],
    );

    // Transform data
    const transformedProducts = products.map((p) => {
      const profile = profileMap.get(p.developer_id);
      return {
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price,
        discount: p.discount,
        href: p.href,
        image: p.image,
        description: p.description,
        tools: p.tools || [],
        status: p.status,
        admin_notes: p.admin_notes || null,
        developer_id: p.developer_id,
        developer_name: profile?.full_name || "Unknown",
        developer_phone: profile?.phone || "",
        developer_email: profile?.email || "",
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/admin/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
