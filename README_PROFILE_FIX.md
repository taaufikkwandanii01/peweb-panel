# 🔥 QUICK FIX - Profile "Failed to Fetch" Error

## Problem
Profile page tidak bisa load data karena approved users tidak punya entry di tabel `usersProfiles`.

## Root Cause
Ketika admin approve user → status berubah di metadata SAJA → TIDAK ada entry dibuat di tabel `usersProfiles` → Profile page error.

---

## ✅ Solution (3 Langkah)

### 1. **Code sudah diperbaiki** ✅
File `src/app/api/admin/users/update-user-status/route.ts` sudah diupdate:
- Sekarang ketika approve user → otomatis buat entry di `usersProfiles`
- Cek duplikasi sebelum create
- Error handling yang baik

### 2. **Migrasi Data Existing** (WAJIB dijalankan 1x)

**Via Supabase Dashboard** (RECOMMENDED):
```
1. Buka Supabase Dashboard
2. Masuk ke SQL Editor
3. Copy paste isi file: migration_sync_profiles.sql
4. Klik RUN
5. Lihat hasilnya (berapa profiles yang dibuat)
```

**Via API Endpoint** (Alternative):
```bash
POST /api/admin/sync-profiles
Header: Authorization: Bearer <admin-token>
```

### 3. **Test** ✅
- Login sebagai user yang sudah approved
- Buka profile page
- Data harus muncul sekarang!

---

## 🔍 Verifikasi

### Cek Database:
```sql
-- Approved users tanpa profile (harus 0)
SELECT u.id, u.email 
FROM auth.users u
LEFT JOIN public."usersProfiles" p ON u.id = p.id
WHERE u.raw_user_meta_data->>'status' = 'approved'
  AND p.id IS NULL;
```

### Test Flow Baru:
```
1. User register → status: pending
2. Admin approve user
3. Otomatis create entry di usersProfiles ✅
4. User login → bisa lihat profile ✅
```

---

## 📋 Checklist

- [ ] Code updated (already done ✅)
- [ ] Run migration script di Supabase
- [ ] Test dengan user yang baru di-approve
- [ ] Test dengan user existing yang sudah approved
- [ ] Verify semua approved users punya profile

---

## 🆘 Masih Error?

1. **Check user approved**: 
   ```sql
   SELECT raw_user_meta_data->>'status' 
   FROM auth.users WHERE email='user@email.com'
   ```

2. **Check profile exists**:
   ```sql
   SELECT * FROM "usersProfiles" 
   WHERE email='user@email.com'
   ```

3. **Run sync endpoint** manually untuk user tersebut

4. **Check browser console** untuk error message detail

---

## Files Changed

### Modified:
✏️ `src/app/api/admin/users/update-user-status/route.ts`

### Created:
📄 `migration_sync_profiles.sql` - SQL script untuk migrasi
📄 `src/app/api/admin/sync-profiles/route.ts` - API endpoint
📄 `FIX_PROFILE_DOCUMENTATION.md` - Dokumentasi lengkap

---

**Status**: ✅ FIXED  
**Priority**: 🔥 HIGH (Run migration ASAP!)  
**Impact**: All approved users dapat access profile page
