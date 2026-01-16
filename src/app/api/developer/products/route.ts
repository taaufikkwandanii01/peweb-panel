import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET: Fetch products for the authenticated developer
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

    // Check if user is developer
    const { data: roleCheck, error: roleError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleCheck || roleCheck.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 }
      );
    }

    // Fetch products for this developer
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("developer_id", user.id)
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Get user profile for developer info
    const { data: userProfile } = await supabase
      .from("usersProfiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();

    // Transform data to match frontend interface
    const transformedProducts = products.map((p) => ({
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
      developer_name: userProfile?.full_name || "Unknown",
      developer_phone: userProfile?.phone || "",
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/developer/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
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

    // Check if user is developer
    const { data: roleCheck, error: roleError } = await supabase
      .from("usersProfiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleCheck || roleCheck.role !== "developer") {
      return NextResponse.json(
        { error: "Forbidden - Developer access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, category, price, discount, href, image, description, tools } = body;

    // Validate required fields
    if (!title || !category || price === undefined || !href || !image || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    if (!["Website", "Web App"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be 'Website' or 'Web App'" },
        { status: 400 }
      );
    }

    // Validate discount
    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return NextResponse.json(
        { error: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Insert new product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        developer_id: user.id,
        title,
        category,
        price,
        discount: discount || 0,
        href,
        image,
        description,
        tools: tools || [],
        status: "pending", // Always start as pending
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error creating product:", insertError);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
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
      id: newProduct.id,
      title: newProduct.title,
      category: newProduct.category,
      price: newProduct.price,
      discount: newProduct.discount,
      href: newProduct.href,
      image: newProduct.image,
      description: newProduct.description,
      tools: newProduct.tools || [],
      status: newProduct.status,
      developer_name: userProfile?.full_name || "Unknown",
      developer_phone: userProfile?.phone || "",
      created_at: newProduct.created_at,
      updated_at: newProduct.updated_at,
    };

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: transformedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/developer/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
