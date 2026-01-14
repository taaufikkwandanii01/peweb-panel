# 🧪 Testing Guide - Login & Approval System

## 📋 Flow yang Benar

### 1️⃣ Register Flow
```
User Register → Account Created (status: pending) → Auto Logout → Redirect to Login
```

### 2️⃣ Login Flow (PENDING User)
```
User Login → Check credentials → Check status → Status = pending → Logout + Error Message
```

### 3️⃣ Approval Flow (Manual by Admin)
```
Admin runs SQL → Update status to 'approved' → User can now login
```

### 4️⃣ Login Flow (APPROVED User)
```
User Login → Check credentials → Check status → Status = approved → Redirect to Dashboard
```

---

## 🧪 Step-by-Step Testing

### Step 1: Register New User

1. Buka: http://localhost:3000/auth/register
2. Isi form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+6281234567890`
   - Password: `password123`
   - Confirm Password: `password123`
3. Klik **Create Account**
4. ✅ Harus muncul success message: "Registration Successful!"
5. ✅ Setelah 3 detik, redirect ke `/auth/login`

**Cek di Console Browser (F12):**
```
Registration result: { success: true, message: "Registration successful!..." }
```

### Step 2: Cek di Supabase Dashboard

1. Buka Supabase Dashboard
2. Go to: **Authentication → Users**
3. Cari user dengan email: `test@example.com`
4. ✅ **Phone harus terisi**: `+6281234567890`
5. Klik user → Lihat **Raw User Meta Data**:
   ```json
   {
     "full_name": "Test User",
     "phone": "+6281234567890",
     "role": "developer",
     "status": "pending"  ← HARUS PENDING
   }
   ```

### Step 3: Test Login dengan Status PENDING

1. Buka: http://localhost:3000/auth/login
2. Login dengan:
   - Email: `test@example.com`
   - Password: `password123`
   - Role: **Developer**
3. Klik **Sign In**
4. ❌ **HARUS GAGAL** dengan error:
   > "Your account is pending approval. Please wait for admin to approve your account before you can login."

**Cek di Console Browser (F12):**
```
Login result: { 
  success: false, 
  message: "Your account is pending approval..." 
}
```

**Cek di Console Server (Terminal):**
```
Middleware - User: test@example.com (developer)
Middleware - User status: pending
Middleware - User not approved, logging out
```

### Step 4: Approve User (Manual via SQL)

Jalankan query ini di **Supabase SQL Editor**:

```sql
-- Approve user
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE email = 'test@example.com';
```

**Verify Approval:**
```sql
-- Cek status user
SELECT 
  email, 
  raw_user_meta_data->>'status' as status,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'phone' as phone
FROM auth.users 
WHERE email = 'test@example.com';
```

Expected result:
```
email              | status   | role      | phone
test@example.com   | approved | developer | +6281234567890
```

### Step 5: Test Login dengan Status APPROVED

1. Clear browser cookies (atau gunakan Incognito)
2. Buka: http://localhost:3000/auth/login
3. Login dengan:
   - Email: `test@example.com`
   - Password: `password123`
   - Role: **Developer**
4. Klik **Sign In**
5. ✅ **HARUS BERHASIL** dan redirect ke: `/developer/dashboard`

**Cek di Console Browser (F12):**
```
Login result: { 
  success: true, 
  message: "Login successful!", 
  role: "developer" 
}
Redirecting to: /developer/dashboard
```

**Cek di Console Server (Terminal):**
```
Middleware - User: test@example.com (developer)
Middleware - User status: approved
Middleware - User approved, allowing access
```

---

## 🐛 Troubleshooting

### Error: "User role is not defined"
**Cause:** `raw_user_meta_data` tidak memiliki field `role`

**Fix:**
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"developer"'
)
WHERE email = 'test@example.com';
```

### Error: "This account is registered as X, not Y"
**Cause:** Login dengan role yang salah

**Fix:** Pilih role yang sesuai dengan data di database

### Phone Number Kosong di Dashboard
**Cause:** Old registration flow

**Fix:** Delete user dan register ulang dengan code yang sudah diperbaiki

### Login Berhasil Tapi Tidak Redirect
**Cause:** Middleware tidak jalan atau session tidak tersimpan

**Fix:**
1. Restart development server
2. Clear browser cookies
3. Check environment variables
4. Check console logs

### Status Masih Pending Setelah SQL Update
**Cause:** Cache atau belum refresh

**Fix:**
1. Refresh Supabase Dashboard
2. Logout dan login lagi di aplikasi
3. Clear browser cache

---

## 📊 Status Flow Diagram

```
REGISTER
   │
   ├─► Create User (status: pending)
   ├─► Auto Logout
   └─► Redirect to Login

LOGIN (PENDING)
   │
   ├─► Enter credentials
   ├─► Check status = pending
   ├─► Logout
   └─► Show Error Message

ADMIN APPROVES
   │
   └─► SQL: UPDATE status = 'approved'

LOGIN (APPROVED)
   │
   ├─► Enter credentials
   ├─► Check status = approved ✓
   └─► Redirect to Dashboard
```

---

## ✅ Checklist

- [ ] Register berhasil dengan phone number
- [ ] Phone terisi di Supabase Dashboard
- [ ] Status default = "pending"
- [ ] Login dengan pending = error message
- [ ] SQL update status = approved
- [ ] Login dengan approved = redirect to dashboard
- [ ] Middleware block pending users
- [ ] Middleware allow approved users
- [ ] Console logs menunjukkan flow yang benar

---

## 🎯 Expected Behavior Summary

| Action | Status | Expected Result |
|--------|--------|----------------|
| Register | - | Account created (pending) → Logout → Login page |
| Login | pending | Error: "Account pending approval" |
| Login | rejected | Error: "Account rejected" |
| Login | approved | Redirect to dashboard |
| Access Dashboard | pending | Redirect to login |
| Access Dashboard | approved | Allow access |

---

## 📞 Support

Jika masih ada masalah:
1. Cek console browser (F12)
2. Cek console server (terminal)
3. Cek Supabase logs
4. Screenshot error message
5. Paste logs untuk debugging
