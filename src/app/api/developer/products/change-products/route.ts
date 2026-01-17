import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// PUT: Update a product
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

    // Check if user is developer
    const { data: roleCheck, error: roleError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleCheck || roleCheck.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      id,
      title,
      category,
      price,
      discount,
      href,
      image,
      description,
      tools,
    } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if product exists and belongs to this developer
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id, developer_id")
      .eq("id", id)
      .single();

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.developer_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only update your own products" },
        { status: 403 },
      );
    }

    // Validate category if provided
    if (category && !["Website", "Web App"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be 'Website' or 'Web App'" },
        { status: 400 },
      );
    }

    // Validate discount if provided
    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return NextResponse.json(
        { error: "Discount must be between 0 and 100" },
        { status: 400 },
      );
    }

    // Prepare update data (only include fields that are provided)
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (href !== undefined) updateData.href = href;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (tools !== undefined) updateData.tools = tools;

    // PERUBAHAN: Set status kembali ke pending saat produk diupdate
    updateData.status = "pending";

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating product:", updateError);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 },
      );
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from("usersProfiles")
      .select("full_name, phone")
      .eq("id", user.id)
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
      developer_name: userProfile?.full_name || "Unknown",
      developer_phone: userProfile?.phone || "",
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
    };

    return NextResponse.json(
      {
        message:
          "Product updated successfully. Status changed to pending for admin review.",
        product: transformedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Unexpected error in PUT /api/developer/products/change-products:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: NextRequest) {
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

    // Check if user is developer
    const { data: roleCheck, error: roleError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleCheck || roleCheck.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if product exists and belongs to this developer
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id, developer_id, title")
      .eq("id", id)
      .single();

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.developer_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own products" },
        { status: 403 },
      );
    }

    // Delete product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedProductId: id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Unexpected error in DELETE /api/developer/products/change-products:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
