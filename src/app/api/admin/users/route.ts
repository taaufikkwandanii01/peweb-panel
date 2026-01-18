import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Cek autentikasi
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Cek apakah user adalah admin dari metadata
    if (user.user_metadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminClient = await createAdminClient();

    // 3. Ambil data profil dari tabel database
    const { data: profiles, error: profileError } = await adminClient
      .from("usersProfiles") // Ganti dengan nama tabel yang sesuai di DB Anda
      .select("id, full_name, phone, role");

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // 4. Ambil data dasar dari Auth Admin untuk mendapatkan Email
    const { data: authUsers, error: usersError } =
      await adminClient.auth.admin.listUsers();

    if (usersError) {
      return NextResponse.json(
        { error: "Failed to fetch auth users" },
        { status: 500 },
      );
    }

    // 5. Gabungkan data: Email dari Auth + Detail dari Profiles
    const combinedUsers = authUsers.users.map((u) => {
      const profile = profiles.find((p) => p.id === u.id);
      return {
        id: u.id,
        email: u.email || "",
        created_at: u.created_at,
        // Data diambil prioritas dari tabel profiles, jika kosong baru ke metadata
        full_name: profile?.full_name || u.user_metadata?.full_name || "",
        phone: profile?.phone || u.user_metadata?.phone || "",
        role: profile?.role || u.user_metadata?.role || "developer",
        status: u.user_metadata?.status || "pending", // Status biasanya tetap di metadata untuk sistem blokir auth
      };
    });

    return NextResponse.json(combinedUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
