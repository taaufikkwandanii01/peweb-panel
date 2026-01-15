# Profile Feature Implementation

## 🚀 Quick Start

### 1. Setup Database

Jalankan migration di Supabase SQL Editor:

```bash
# File location: migrations/create_profiles_table.sql
```

Buka Supabase Dashboard → SQL Editor → Paste & Run

### 2. Verify Setup

```sql
-- Check table exists
SELECT * FROM public.profiles LIMIT 5;

-- Check triggers
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%profile%';
```

### 3. Test API

```bash
# Admin Profile
GET    /api/admin/profile
PUT    /api/admin/profile
POST   /api/admin/profile/change-password

# Developer Profile
GET    /api/developer/profile
PUT    /api/developer/profile
POST   /api/developer/profile/change-password
```

## 📁 Structure

```
src/
├── app/api/
│   ├── admin/profile/
│   │   ├── route.ts
│   │   └── change-password/route.ts
│   └── developer/profile/
│       ├── route.ts
│       └── change-password/route.ts
├── components/views/
│   ├── Admin/Profile/Index.tsx
│   └── Developer/Profile/Index.tsx
└── migrations/
    └── create_profiles_table.sql
```

## 🔑 Key Features

### Admin
- Full name, phone, location, bio, linkedin
- Password change
- Auto-save to database

### Developer
- All admin fields + github & expertise
- Skills display
- Password change
- Auto-save to database

## 🛡️ Security

- ✅ Authentication required
- ✅ Role-based authorization
- ✅ Row Level Security (RLS)
- ✅ Password verification
- ✅ Auto-create profile on signup

## 📊 Database Schema

```sql
profiles (
  id UUID PRIMARY KEY → auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'developer')),
  location TEXT,
  bio TEXT,
  github TEXT,
  linkedin TEXT,
  expertise TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🔄 Auto Features

- Profile created on user signup (trigger)
- Updated_at auto-update (trigger)
- RLS policies active
- Indexes for performance

## ⚠️ Important Notes

1. **Email tidak bisa diubah** - readonly field
2. **Password** dikelola oleh Supabase Auth, tidak di tabel profiles
3. **Role** ditentukan saat signup, tidak bisa diubah dari profile
4. Pastikan **RLS enabled** di Supabase Dashboard

## 🧪 Testing

```sql
-- View your profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check last updates
SELECT email, updated_at 
FROM profiles 
ORDER BY updated_at DESC 
LIMIT 10;
```

## 📞 Support

Jika ada masalah:
1. Check Supabase logs
2. Verify RLS policies
3. Check trigger functions
4. Review API response errors

## 📚 Full Documentation

Lihat artifact untuk dokumentasi lengkap dengan:
- Complete API specs
- Security details
- Troubleshooting guide
- Enhancement ideas
