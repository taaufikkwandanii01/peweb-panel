# 🔧 FIX: Profile Data Not Showing (Failed to Fetch)

## 📋 Problem Summary

**Symptom**: Profile page shows "Failed to fetch" error
**Root Cause**: Approved users don't have corresponding entries in the `usersProfiles` table

### Why This Happened:
1. When users register → Data saved to `auth.users` with metadata only
2. When admin approves → Only `status` in metadata is updated
3. **MISSING STEP**: No entry created in `usersProfiles` table
4. Profile page tries to fetch from `usersProfiles` → Returns nothing → "Failed to fetch"

---

## ✅ Solution Implemented

### 1. **Updated Approval Endpoint** ⭐ PRIMARY FIX
**File**: `src/app/api/admin/users/update-user-status/route.ts`

**What Changed**:
- When admin approves a user (status = "approved"), automatically create entry in `usersProfiles`
- Check if profile already exists before creating (prevents duplicates)
- Graceful error handling (approval still succeeds even if profile creation fails)

**Code Added** (lines ~75-110):
```typescript
// Create usersProfiles entry when approved
if (status === "approved" && updatedUser.user) {
  const userMetadata = updatedUser.user.user_metadata;
  
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("usersProfiles")
    .select("id")
    .eq("id", userId)
    .single();

  // Only create if profile doesn't exist
  if (!existingProfile) {
    const { error: profileError } = await supabase
      .from("usersProfiles")
      .insert({
        id: userId,
        email: updatedUser.user.email || "",
        full_name: userMetadata.full_name || "",
        phone: userMetadata.phone || null,
        role: userMetadata.role || "developer",
        // ... other fields
      });
  }
}
```

### 2. **Created Migration Script** 🔄 FOR EXISTING DATA
**File**: `migration_sync_profiles.sql`

**Purpose**: Fix existing approved users that don't have profiles yet

**How to Use**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire script
3. Run the script (only needs to run ONCE)
4. Check the output to see how many profiles were created

**What It Does**:
- Finds all approved users without profiles
- Creates profile entries for each
- Prevents duplicates with `ON CONFLICT DO NOTHING`
- Reports how many profiles were created

### 3. **Created Manual Sync API** 🛠️ BACKUP SOLUTION
**File**: `src/app/api/admin/sync-profiles/route.ts`

**Purpose**: Manual sync endpoint for admins

**How to Use**:
```bash
# Via curl or Postman
POST /api/admin/sync-profiles
Authorization: Bearer <admin-token>
```

**Response Example**:
```json
{
  "message": "Profile sync completed",
  "totalApprovedUsers": 10,
  "synced": 5,
  "skipped": 3,
  "failed": 2,
  "errors": [...]
}
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Code Changes
```bash
git add .
git commit -m "fix: auto-create usersProfiles on user approval"
git push
```

### Step 2: Run Migration (ONE TIME ONLY)
**Option A: Via Supabase Dashboard (Recommended)**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Paste content from `migration_sync_profiles.sql`
5. Run query
6. Check results

**Option B: Via API Endpoint**
1. Login as admin
2. Call sync endpoint:
```bash
curl -X POST https://your-domain.com/api/admin/sync-profiles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Step 3: Test
1. Login as an approved user (admin or developer)
2. Go to Profile page
3. Data should now display correctly ✅

---

## 🔍 How to Verify It's Working

### Test New Approvals:
1. Have a user register (status = pending)
2. Admin approves the user
3. Check Supabase:
   ```sql
   SELECT * FROM public."usersProfiles" 
   WHERE id = 'USER_ID_HERE';
   ```
4. Profile entry should exist ✅

### Test Existing Users:
1. Login as approved user
2. Navigate to `/admin/profile` or `/developer/profile`
3. Profile data loads without errors ✅

### Check Database:
```sql
-- Count approved users
SELECT COUNT(*) 
FROM auth.users 
WHERE raw_user_meta_data->>'status' = 'approved';

-- Count profiles
SELECT COUNT(*) FROM public."usersProfiles";

-- These numbers should match!

-- Find any approved users without profiles
SELECT u.id, u.email, u.raw_user_meta_data->>'full_name' as name
FROM auth.users u
LEFT JOIN public."usersProfiles" p ON u.id = p.id
WHERE u.raw_user_meta_data->>'status' = 'approved'
  AND p.id IS NULL;
-- This should return 0 rows after migration
```

---

## 📊 Data Flow (After Fix)

### Before (BROKEN):
```
Register → auth.users (with metadata)
            ↓
Admin Approve → Update metadata.status = "approved"
            ↓
Profile Page → Query usersProfiles → EMPTY → ❌ "Failed to fetch"
```

### After (FIXED):
```
Register → auth.users (with metadata)
            ↓
Admin Approve → Update metadata.status = "approved"
            ↓
            Create entry in usersProfiles ✅
            ↓
Profile Page → Query usersProfiles → DATA FOUND → ✅ Display Profile
```

---

## 🆘 Troubleshooting

### Issue: Still seeing "Failed to fetch"
**Check**:
1. User is actually approved: `SELECT raw_user_meta_data->>'status' FROM auth.users WHERE id='USER_ID'`
2. Profile exists: `SELECT * FROM "usersProfiles" WHERE id='USER_ID'`
3. User is logged in with correct role
4. Run sync endpoint or migration script

### Issue: Profile exists but data is incomplete
**Solution**: User can edit profile to fill in missing data
- Bio, Location, LinkedIn, GitHub can be edited
- Email and role are locked (from auth metadata)

### Issue: Multiple profiles for same user
**Should not happen** - code checks for existing profile before creating
**If it does**:
```sql
-- Remove duplicate (keep the oldest one)
DELETE FROM public."usersProfiles"
WHERE id IN (
  SELECT id 
  FROM public."usersProfiles" 
  GROUP BY id 
  HAVING COUNT(*) > 1
)
AND created_at NOT IN (
  SELECT MIN(created_at) 
  FROM public."usersProfiles" 
  GROUP BY id
);
```

---

## 🔐 Security Notes

- ✅ Only admins can approve users
- ✅ Only admins can run sync endpoint
- ✅ Profile creation uses secure Supabase client
- ✅ No sensitive data exposed in errors
- ✅ Graceful error handling prevents partial failures

---

## 📁 Files Modified/Created

### Modified:
- `src/app/api/admin/users/update-user-status/route.ts` - Added auto-create logic

### Created:
- `migration_sync_profiles.sql` - One-time migration script
- `src/app/api/admin/sync-profiles/route.ts` - Manual sync endpoint
- `FIX_PROFILE_DOCUMENTATION.md` - This documentation

---

## ✨ Future Improvements

1. **Database Trigger** (Advanced):
   Create Supabase trigger to auto-sync on status change
   ```sql
   -- Example trigger (not implemented yet)
   CREATE OR REPLACE FUNCTION sync_user_profile()
   RETURNS TRIGGER AS $$
   BEGIN
     IF NEW.raw_user_meta_data->>'status' = 'approved' THEN
       INSERT INTO public."usersProfiles" (...)
       VALUES (...) ON CONFLICT DO NOTHING;
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Webhook Integration**:
   Use Supabase webhooks to trigger profile creation

3. **Scheduled Sync Job**:
   Daily cron job to ensure consistency

---

## 📞 Support

If issues persist:
1. Check Supabase logs for errors
2. Verify RLS policies on `usersProfiles` table
3. Ensure service role key has proper permissions
4. Contact system administrator

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: ✅ FIXED
