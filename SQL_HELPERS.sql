-- ========================================
-- SQL Helper Scripts untuk Admin
-- ========================================

-- ========================================
-- 1. LIHAT SEMUA USERS DAN STATUS MEREKA
-- ========================================
SELECT 
  id,
  email,
  phone,
  created_at,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'status' as status,
  raw_user_meta_data->>'phone' as phone_metadata
FROM auth.users
ORDER BY created_at DESC;

-- ========================================
-- 2. LIHAT HANYA USERS YANG PENDING
-- ========================================
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'status' as status,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'status' = 'pending'
ORDER BY created_at DESC;

-- ========================================
-- 3. APPROVE USER BY EMAIL
-- ========================================
-- Ganti 'user@example.com' dengan email yang ingin di-approve
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE email = 'user@example.com';

-- ========================================
-- 4. APPROVE USER BY ID
-- ========================================
-- Ganti 'user-id-here' dengan ID user yang ingin di-approve
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE id = 'user-id-here';

-- ========================================
-- 5. REJECT USER
-- ========================================
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"rejected"'
)
WHERE email = 'user@example.com';

-- ========================================
-- 6. APPROVE MULTIPLE USERS SEKALIGUS
-- ========================================
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE email IN (
  'user1@example.com',
  'user2@example.com',
  'user3@example.com'
);

-- ========================================
-- 7. APPROVE SEMUA PENDING USERS (HATI-HATI!)
-- ========================================
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE raw_user_meta_data->>'status' = 'pending';

-- ========================================
-- 8. CHANGE USER ROLE
-- ========================================
-- Ganti role dari developer ke admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"admin"'
)
WHERE email = 'user@example.com';

-- ========================================
-- 9. FIX MISSING PHONE NUMBER
-- ========================================
-- Jika phone number kosong, tambahkan manual
UPDATE auth.users 
SET 
  phone = '+6281234567890',
  raw_user_meta_data = jsonb_set(
    raw_user_meta_data, 
    '{phone}', 
    '"+6281234567890"'
  )
WHERE email = 'user@example.com';

-- ========================================
-- 10. RESET USER STATUS KE PENDING
-- ========================================
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"pending"'
)
WHERE email = 'user@example.com';

-- ========================================
-- 11. DELETE USER COMPLETELY
-- ========================================
-- HATI-HATI! Ini akan menghapus user permanen
DELETE FROM auth.users 
WHERE email = 'user@example.com';

-- ========================================
-- 12. COUNT USERS BY STATUS
-- ========================================
SELECT 
  raw_user_meta_data->>'status' as status,
  COUNT(*) as total
FROM auth.users
GROUP BY raw_user_meta_data->>'status';

-- ========================================
-- 13. COUNT USERS BY ROLE
-- ========================================
SELECT 
  raw_user_meta_data->>'role' as role,
  COUNT(*) as total
FROM auth.users
GROUP BY raw_user_meta_data->>'role';

-- ========================================
-- 14. FIND USER BY PHONE NUMBER
-- ========================================
SELECT 
  id,
  email,
  phone,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'status' as status
FROM auth.users
WHERE phone = '+6281234567890'
   OR raw_user_meta_data->>'phone' = '+6281234567890';

-- ========================================
-- 15. CREATE ADMIN USER MANUALLY
-- ========================================
-- Catatan: Ini hanya mengubah metadata, user harus register dulu
-- Atau gunakan Supabase Dashboard untuk invite user
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || 
  '{"role": "admin", "status": "approved", "full_name": "Admin User"}'::jsonb
WHERE email = 'admin@example.com';

-- ========================================
-- 16. VIEW RECENT REGISTRATIONS (Last 7 days)
-- ========================================
SELECT 
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'status' as status,
  created_at
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- ========================================
-- 17. FIX USER WITH MISSING METADATA
-- ========================================
-- Jika user tidak punya role/status, tambahkan default
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || 
  '{"role": "developer", "status": "pending"}'::jsonb
WHERE email = 'user@example.com'
  AND (
    raw_user_meta_data->>'role' IS NULL 
    OR raw_user_meta_data->>'status' IS NULL
  );

-- ========================================
-- 18. EXPORT USER LIST (untuk backup)
-- ========================================
COPY (
  SELECT 
    email,
    phone,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'status' as status,
    created_at
  FROM auth.users
  ORDER BY created_at DESC
) TO '/tmp/users_export.csv' WITH CSV HEADER;

-- ========================================
-- 19. CHECK IF USER EXISTS
-- ========================================
SELECT EXISTS(
  SELECT 1 FROM auth.users WHERE email = 'user@example.com'
) as user_exists;

-- ========================================
-- 20. GET USER FULL INFO
-- ========================================
SELECT 
  id,
  email,
  phone,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'user@example.com';
