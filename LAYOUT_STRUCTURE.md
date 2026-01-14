# 📐 Layout Structure - Explained

## 🤔 Kenapa Ada AuthProvider di Root Layout?

**AuthProvider** di `app/layout.tsx` berfungsi sebagai **global state provider** untuk authentication. Ini adalah best practice dalam Next.js App Router.

### ✅ Manfaat AuthProvider di Root:

1. **Global User State** - User session tersedia di seluruh aplikasi
2. **Centralized Auth Logic** - Satu tempat untuk handle auth state
3. **Automatic Session Updates** - Listen ke perubahan auth (login/logout)
4. **Easy Access** - Bisa pakai `useAuth()` hook di mana saja

---

## 🏗️ Struktur Layout yang Benar

```
app/layout.tsx (Root Layout)
   │
   └─► AuthProvider (Global Auth State)
        │
        ├─► /auth/* pages (No MainLayouts)
        │   ├─ Login Page
        │   └─ Register Page
        │
        └─► Protected pages (WITH MainLayouts)
            ├─ /admin/dashboard (MainLayouts userRole="admin")
            ├─ /admin/profile (MainLayouts userRole="admin")
            ├─ /developer/dashboard (MainLayouts userRole="developer")
            └─ /developer/profile (MainLayouts userRole="developer")
```

---

## 📦 Component Hierarchy

### 1. Root Layout (`app/layout.tsx`)
```tsx
<html>
  <body>
    <AuthProvider>  ← Membungkus seluruh app
      {children}     ← Semua pages render di sini
    </AuthProvider>
  </body>
</html>
```

**Fungsi:**
- Setup global styles (Tailwind, fonts)
- Provide auth context ke seluruh app
- Tidak ada UI components (navbar/sidebar)

---

### 2. Auth Pages (Login/Register)
```tsx
// app/auth/login/page.tsx
<LoginView />  ← Langsung render view, NO MainLayouts
```

**Kenapa tidak pakai MainLayouts?**
- Auth pages tidak butuh navbar/sidebar
- Auth pages adalah public pages
- Design berbeda dengan dashboard

---

### 3. Dashboard Pages
```tsx
// app/admin/dashboard/page.tsx
<AdminDashboard />

// AdminDashboard component
<MainLayouts userRole="admin">  ← Membungkus content
  <div>Dashboard content...</div>
</MainLayouts>
```

**Kenapa pakai MainLayouts?**
- Butuh navbar dengan user info & logout button
- Butuh sidebar dengan navigation menu
- Butuh footer
- Consistent layout untuk semua protected pages

---

### 4. MainLayouts Component

```tsx
<MainLayouts userRole="admin">
  │
  ├─► Navbar (user info, logout button)
  ├─► Sidebar (navigation menu by role)
  ├─► Main Content (children dari props)
  └─► Footer
</MainLayouts>
```

**Props:**
- `userRole` - "admin" atau "developer" (untuk conditional rendering)
- `children` - Content yang di-render di dalam layout
- `showSidebar` - Optional, default true
- `showFooter` - Optional, default true

---

## 🔄 Data Flow

```
1. User Login
   ↓
2. Supabase creates session
   ↓
3. AuthProvider detects session (via onAuthStateChange)
   ↓
4. User state tersedia via useAuth() hook
   ↓
5. MainLayouts menggunakan useAuth() untuk:
   - Display user name di Navbar
   - Handle logout via signOut()
   - Get user metadata
```

---

## 💡 Kenapa Struktur Ini Lebih Baik?

### ❌ Struktur Lama (Masalah):
```tsx
// app/layout.tsx
<MainLayouts>  ← SALAH! Semua pages termasuk auth
  {children}
</MainLayouts>

Problem:
- Login page juga punya navbar/sidebar (tidak seharusnya)
- Auth pages terbungkus MainLayouts (tidak perlu)
- Tidak flexible
```

### ✅ Struktur Baru (Solusi):
```tsx
// app/layout.tsx
<AuthProvider>  ← Hanya global state
  {children}
</AuthProvider>

// Protected pages
<MainLayouts>  ← Hanya untuk protected pages
  <Dashboard />
</MainLayouts>

Benefits:
- Auth pages clean tanpa navbar/sidebar
- Protected pages konsisten dengan MainLayouts
- Flexible - bisa customize per page
- Clear separation of concerns
```

---

## 📝 Example Usage

### Auth Page (No Layout):
```tsx
// app/auth/login/page.tsx
export default function LoginPage() {
  return <LoginView />; // No MainLayouts!
}
```

### Dashboard Page (With Layout):
```tsx
// app/admin/dashboard/page.tsx
export default function AdminDashboardPage() {
  return (
    <MainLayouts userRole="admin">  {/* ← Add MainLayouts here */}
      <AdminDashboard />
    </MainLayouts>
  );
}
```

### Profile Page (With Layout):
```tsx
// app/admin/profile/page.tsx
export default function AdminProfilePage() {
  return (
    <MainLayouts userRole="admin">
      <AdminProfile />
    </MainLayouts>
  );
}
```

---

## 🎯 Best Practices

### 1. AuthProvider - Root Level Only
```tsx
// ✅ CORRECT - app/layout.tsx
<AuthProvider>
  {children}
</AuthProvider>

// ❌ WRONG - Jangan di nested layouts
<AuthProvider>
  <AuthProvider>  // Double provider = error!
    {children}
  </AuthProvider>
</AuthProvider>
```

### 2. MainLayouts - Protected Pages Only
```tsx
// ✅ CORRECT - Dashboard pages
<MainLayouts userRole="admin">
  <Dashboard />
</MainLayouts>

// ❌ WRONG - Auth pages
<MainLayouts userRole="admin">
  <LoginPage />  // Login tidak butuh navbar/sidebar!
</MainLayouts>
```

### 3. useAuth Hook - Anywhere
```tsx
// ✅ CORRECT - Use dalam any component
function MyComponent() {
  const { user, signOut } = useAuth();
  // ...
}

// ❌ WRONG - Jangan destructure AuthContext langsung
import { AuthContext } from '@/contexts/AuthContext';
// Better use useAuth() hook
```

---

## 🔧 Integration dengan Middleware

```
1. User akses protected page
   ↓
2. Middleware check session
   ↓
3. If NO session → Redirect to /auth/login
   ↓
4. If HAS session → Allow access
   ↓
5. Page renders dengan MainLayouts
   ↓
6. MainLayouts uses useAuth() untuk get user data
   ↓
7. Display user info di Navbar
```

---

## 📚 File Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root Layout (AuthProvider)
│   ├── auth/
│   │   ├── login/page.tsx      ← No MainLayouts
│   │   └── register/page.tsx   ← No MainLayouts
│   ├── admin/
│   │   ├── dashboard/page.tsx  ← Uses MainLayouts
│   │   └── profile/page.tsx    ← Uses MainLayouts
│   └── developer/
│       ├── dashboard/page.tsx  ← Uses MainLayouts
│       └── profile/page.tsx    ← Uses MainLayouts
│
├── components/
│   ├── layouts/
│   │   └── MainLayouts.tsx     ← Layout component
│   ├── fragments/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── views/
│       ├── Auth/               ← View components (no layout)
│       ├── Admin/              ← Content only
│       └── Developer/          ← Content only
│
└── contexts/
    └── AuthContext.tsx         ← Global auth state
```

---

## ✅ Summary

| Component | Location | Purpose | Has MainLayouts? |
|-----------|----------|---------|------------------|
| AuthProvider | `app/layout.tsx` | Global auth state | - |
| Login Page | `app/auth/login` | Public auth page | ❌ No |
| Register Page | `app/auth/register` | Public auth page | ❌ No |
| Admin Dashboard | `app/admin/dashboard` | Protected page | ✅ Yes |
| Admin Profile | `app/admin/profile` | Protected page | ✅ Yes |
| Developer Dashboard | `app/developer/dashboard` | Protected page | ✅ Yes |
| Developer Profile | `app/developer/profile` | Protected page | ✅ Yes |

---

## 🎉 Result

**Sekarang struktur sudah proper:**

1. ✅ **AuthProvider** di root untuk global state
2. ✅ **Auth pages** clean tanpa navbar/sidebar
3. ✅ **Protected pages** consistent dengan MainLayouts
4. ✅ **MainLayouts** integrate dengan useAuth()
5. ✅ **Clear separation** antara public dan protected pages

---

## 🚀 Next Steps

Jika ingin menambah page baru:

**Public Page (Auth):**
```tsx
// Just render view component
export default function Page() {
  return <ViewComponent />;
}
```

**Protected Page (Dashboard):**
```tsx
// Wrap dengan MainLayouts
export default function Page() {
  return (
    <MainLayouts userRole="admin">
      <ViewComponent />
    </MainLayouts>
  );
}
```

Simple kan? 😊
