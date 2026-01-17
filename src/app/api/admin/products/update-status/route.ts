import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// PUT: Update product status and admin notes
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

    // Parse request body
    const body = await request.json();
    const { id, status, admin_notes } = body;

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: "Product ID and status are required" },
        { status: 400 },
      );
    }

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be 'pending', 'approved', or 'rejected'",
        },
        { status: 400 },
      );
    }

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id, title, developer_id")
      .eq("id", id)
      .single();

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product status and admin notes
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        status,
        admin_notes: admin_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating product status:", updateError);
      return NextResponse.json(
        { error: "Failed to update product status" },
        { status: 500 },
      );
    }

    // Get developer info
    const { data: developerProfile } = await supabase
      .from("usersProfiles")
      .select("full_name, phone")
      .eq("id", updatedProduct.developer_id)
      .single();

    // Transform response
    const transformedProduct = {
      id: updatedProduct.id,
      title: updatedProduct.title,
      category: updatedProduct.category,
      price: updatedProduct.price,
      discount: updatedProduct.discount,
      href: updatedProduct.href,
      image: updatedProduct.image,
      description: updatedProduct.description,
      tools: updatedProduct.tools || [],
      status: updatedProduct.status,
      admin_notes: updatedProduct.admin_notes,
      developer_id: updatedProduct.developer_id,
      developer_name: developerProfile?.full_name || "Unknown",
      developer_phone: developerProfile?.phone || "",
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
    };

    return NextResponse.json(
      {
        message: "Product status updated successfully",
        product: transformedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Unexpected error in PUT /api/admin/products/update-status:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
