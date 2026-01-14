# Installation Guide

## Dependencies yang perlu diinstall:

```bash
npm install @supabase/supabase-js
```

## Setup Supabase

1. Buka Supabase Dashboard (https://app.supabase.com/)
2. Pilih project Anda
3. Konfigurasi Email Authentication:
   - Pergi ke Authentication > Providers
   - Enable "Email" provider
   - **PENTING**: Disable "Confirm email" agar tidak ada proses email confirmation
   
4. Konfigurasi User Metadata:
   - Metadata akan otomatis disimpan saat registrasi dengan struktur:
     ```json
     {
       "full_name": "string",
       "phone": "string", 
       "role": "developer" | "admin",
       "status": "pending" | "approved" | "rejected"
     }
     ```

## Setup Admin User

Untuk approve/reject user, Anda perlu membuat fungsi admin di Supabase:

1. Buka SQL Editor di Supabase Dashboard
2. Jalankan query berikut untuk membuat fungsi update user status:

```sql
-- Function untuk admin update user status
CREATE OR REPLACE FUNCTION update_user_status(
  user_id UUID,
  new_status TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{status}',
    to_jsonb(new_status)
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. Untuk membuat admin pertama, jalankan:

```sql
-- Update user menjadi admin dan approved
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  '{status}',
  '"approved"'
)
WHERE email = 'your-admin@email.com';
```

## Environment Variables

Pastikan file `.env.local` sudah ada di root project dengan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://nnvlkwbsiiisgebsknuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udmxrd2JzaWlpc2dlYnNrbnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjkzOTAsImV4cCI6MjA4Mzk0NTM5MH0.RgbpzzRDZzATF8l7ifyuDBHh0GNOboJIxlojLe9Ig7k
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_A6Qid4c2bjW5L8UKuJFSIA_L4ZV3E-V
```

## Run Project

```bash
npm run dev
```

## Testing Flow

1. **Registrasi**: 
   - Buka http://localhost:3000/auth/register
   - Isi form dengan role default "developer"
   - Setelah submit, user dibuat dengan status "pending"
   
2. **Login (akan gagal)**:
   - Coba login dengan akun yang baru dibuat
   - Akan muncul error: "Your account is pending approval"
   
3. **Approve User** (via Supabase Dashboard):
   - Buka Supabase Dashboard > Authentication > Users
   - Pilih user yang baru dibuat
   - Edit user metadata, ubah status dari "pending" menjadi "approved"
   
4. **Login (berhasil)**:
   - Login kembali dengan akun yang sudah di-approve
   - Akan redirect ke dashboard sesuai role
   - Admin -> /admin/dashboard
   - Developer -> /developer/dashboard

## Features

✅ Login dengan role selection (Admin/Developer)
✅ Register dengan role default Developer
✅ Input nomor telepon di form registrasi
✅ Validasi status "approved" sebelum login
✅ Validasi role saat login
✅ Protected routes dengan middleware
✅ Auth context untuk global state management
✅ HOC withAuth untuk protect components
✅ Auto redirect berdasarkan role
✅ Logout functionality
