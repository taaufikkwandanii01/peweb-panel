# ✅ Profile Feature - Implementation Checklist

## 📋 Setup Steps

### 1. Database Migration
- [ ] Buka Supabase Dashboard
- [ ] Masuk ke SQL Editor
- [ ] Copy isi file `migrations/create_profiles_table.sql`
- [ ] Paste dan Run di SQL Editor
- [ ] Verifikasi: `SELECT * FROM profiles;` harus berhasil

### 2. Verify Database Setup
```sql
-- Run these queries di Supabase SQL Editor:

-- ✅ Check table created
SELECT * FROM public.profiles LIMIT 5;

-- ✅ Check triggers exist
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%profile%';
-- Expected: on_auth_user_created, on_profile_updated

-- ✅ Check RLS policies
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
-- Expected: 3 policies

-- ✅ Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'profiles';
-- Expected: profiles_pkey, profiles_email_idx, profiles_role_idx
```

### 3. Migrate Existing Users (Opsional)
Jika sudah ada users yang terdaftar, jalankan:
```sql
INSERT INTO public.profiles (id, email, full_name, role, phone, location, bio, linkedin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  COALESCE(raw_user_meta_data->>'role', 'developer'),
  COALESCE(raw_user_meta_data->>'phone', phone),
  COALESCE(raw_user_meta_data->>'location', ''),
  COALESCE(raw_user_meta_data->>'bio', ''),
  COALESCE(raw_user_meta_data->>'linkedin', '')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id
);
```

## 🧪 Testing Checklist

### Test Admin Profile
- [ ] Login sebagai admin
- [ ] Akses halaman profile admin
- [ ] Pastikan data ter-load dari database
- [ ] Test edit profile dan save
- [ ] Verify data tersimpan di database
- [ ] Test change password
- [ ] Check error handling (password salah, dll)

### Test Developer Profile
- [ ] Login sebagai developer
- [ ] Akses halaman profile developer
- [ ] Pastikan data ter-load dari database
- [ ] Test edit profile dan save (termasuk github & expertise)
- [ ] Verify data tersimpan di database
- [ ] Test change password
- [ ] Check error handling

### API Testing
```bash
# Test dengan cURL atau Postman

# ✅ Get Admin Profile
curl http://localhost:3000/api/admin/profile

# ✅ Update Admin Profile
curl -X PUT http://localhost:3000/api/admin/profile \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Admin","phone":"+1234567890"}'

# ✅ Change Admin Password
curl -X POST http://localhost:3000/api/admin/profile/change-password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old","newPassword":"new123","confirmPassword":"new123"}'

# ✅ Get Developer Profile
curl http://localhost:3000/api/developer/profile

# ✅ Update Developer Profile
curl -X PUT http://localhost:3000/api/developer/profile \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Dev","expertise":"Full Stack"}'
```

## 🔍 Verification Queries

```sql
-- Check profile data
SELECT id, email, full_name, role, updated_at 
FROM profiles 
ORDER BY updated_at DESC;

-- Check specific user
SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- Check admin profiles
SELECT * FROM profiles WHERE role = 'admin';

-- Check developer profiles
SELECT * FROM profiles WHERE role = 'developer';

-- Check recent updates
SELECT email, full_name, updated_at 
FROM profiles 
WHERE updated_at > NOW() - INTERVAL '1 day'
ORDER BY updated_at DESC;
```

## 📁 Files Created

### API Routes
- ✅ `src/app/api/admin/profile/route.ts`
- ✅ `src/app/api/admin/profile/change-password/route.ts`
- ✅ `src/app/api/developer/profile/route.ts`
- ✅ `src/app/api/developer/profile/change-password/route.ts`

### UI Components
- ✅ `src/components/views/Admin/Profile/Index.tsx`
- ✅ `src/components/views/Developer/Profile/Index.tsx`

### Documentation
- ✅ `migrations/create_profiles_table.sql`
- ✅ `PROFILE_FEATURE_README.md`
- ✅ Documentation Artifact

## 🚨 Common Issues & Solutions

### Issue: "Profile not found"
**Solution:**
```sql
-- Manually create profile
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth-users',
  'email@example.com',
  'Full Name',
  'admin' -- or 'developer'
);
```

### Issue: "Permission denied for table profiles"
**Solution:**
```sql
-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: "Trigger not working"
**Solution:**
```sql
-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Issue: "updated_at not updating"
**Solution:**
```sql
-- Recreate trigger
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

## 🎯 Feature Status

### ✅ Completed
- [x] Database table structure
- [x] RLS policies
- [x] Database triggers
- [x] Admin API endpoints
- [x] Developer API endpoints
- [x] Admin UI component
- [x] Developer UI component
- [x] Password change functionality
- [x] Error handling
- [x] Loading states
- [x] Success/Error notifications
- [x] Documentation

### 🔄 Optional Enhancements
- [ ] Profile image upload
- [ ] Skills management (dynamic)
- [ ] Activity log
- [ ] Email verification on update
- [ ] Two-factor authentication

## 📊 Final Verification

Run these final checks:

```sql
-- ✅ 1. Table exists and has correct structure
\d profiles;

-- ✅ 2. Functions exist
SELECT proname FROM pg_proc WHERE proname LIKE '%profile%';

-- ✅ 3. Triggers exist
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%profile%';

-- ✅ 4. Policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';

-- ✅ 5. Test insert (should work)
-- Will be done automatically on next user signup

-- ✅ 6. Test update (should update updated_at)
UPDATE profiles 
SET full_name = 'Test Update' 
WHERE email = 'your-email@example.com'
RETURNING updated_at;

-- ✅ 7. Test RLS (should only show your profile)
SELECT * FROM profiles; -- run as authenticated user
```

## 🎉 Done!

Jika semua checklist di atas ✅, maka fitur profile sudah berhasil diimplementasikan!

### Next Steps:
1. Test di browser
2. Test dengan berbagai user roles
3. Monitor di production
4. Add enhancements jika diperlukan

---

**Note:** Simpan file ini untuk referensi troubleshooting di masa depan.
