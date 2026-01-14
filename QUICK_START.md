# 🚀 Quick Start - Login & Approval System

## ⚡ Quick Test (5 Minutes)

### 1. Register User
```bash
# Open browser
http://localhost:3000/auth/register

# Fill form
Email: test@example.com
Password: password123
Phone: +6281234567890

# Submit → Should see "Registration Successful!"
# Auto redirect to login page
```

### 2. Try Login (Should FAIL with pending)
```bash
# Login page
http://localhost:3000/auth/login

# Enter credentials
Email: test@example.com
Password: password123
Role: Developer

# Submit → Should see error:
"Your account is pending approval..."
```

### 3. Approve User
```sql
-- Open Supabase SQL Editor
-- Run this query:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{status}', 
  '"approved"'
)
WHERE email = 'test@example.com';
```

### 4. Login Again (Should SUCCESS)
```bash
# Clear browser cookies or use incognito
# Login with same credentials

# Should redirect to:
http://localhost:3000/developer/dashboard
```

---

## 🔍 Quick Debug

### Check User Status
```sql
SELECT 
  email,
  raw_user_meta_data->>'status' as status,
  raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'test@example.com';
```

### Check Console Logs
```bash
# Browser Console (F12):
Login result: { success: true/false, message: "..." }

# Server Console (Terminal):
Middleware - User status: pending/approved
```

---

## 📋 Status Meaning

| Status | Can Login? | Action Required |
|--------|-----------|----------------|
| `pending` | ❌ NO | Admin must approve via SQL |
| `approved` | ✅ YES | Can login normally |
| `rejected` | ❌ NO | Admin rejected, contact support |

---

## 🐛 Common Issues

### Issue: Phone number empty
**Fix:** Register new user with updated code

### Issue: Login still fails after approve
**Fix:** 
1. Clear browser cookies
2. Restart dev server
3. Check SQL update worked

### Issue: Redirect not working
**Fix:**
1. Check middleware logs
2. Check environment variables
3. Try `window.location.href` in code

---

## 📞 Need Help?

1. Read: `TESTING_GUIDE.md` (detailed testing)
2. Check: `SQL_HELPERS.sql` (SQL scripts)
3. Review: `SUMMARY.md` (technical details)
4. Console: Browser F12 + Terminal logs

---

## ✅ Expected Behavior

✅ Register → Logout → Login page
✅ Login (pending) → Error message
✅ Login (approved) → Dashboard
✅ Phone saved in database
✅ Middleware blocks unapproved users
