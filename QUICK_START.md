# 🚀 Quick Start Guide - Products Feature

## ⚡ Setup Cepat (5 Menit)

### 1️⃣ Setup Supabase Storage (PENTING!)

**Opsi A: Via Dashboard (RECOMMENDED)**
```
1. Login ke https://supabase.com
2. Pilih project Anda
3. Klik "Storage" di sidebar
4. Klik "Create a new bucket"
5. Isi:
   - Name: product-images
   - Public: ON (toggle ke kanan) ⚠️ PENTING!
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
6. Klik "Create bucket"
7. Klik bucket "product-images"
8. Klik tab "Policies"
9. Klik "New Policy"
10. Pilih template atau copy dari STORAGE_SETUP.sql
```

**Opsi B: Via SQL**
```bash
# Copy isi file STORAGE_SETUP.sql
# Paste di Supabase SQL Editor
# Run query
```

### 2️⃣ Verifikasi Setup

```bash
# Test di aplikasi:
1. npm run dev
2. Login sebagai developer
3. Buka /developer/products
4. Klik "Tambah Produk"
5. Upload gambar
6. Jika berhasil = Setup OK ✅
```

## 📝 Cara Menggunakan

### ➕ Tambah Produk Baru

```
1. Klik "Tambah Produk"
2. Isi form:
   - Title: Nama produk
   - Category: Website/Web App
   - Price: Harga dalam IDR
   - Discount: 0-100%
   - URL: Link preview produk
   - Image: Upload atau paste URL
   - Description: Deskripsi produk
   - Tools: React, Next.js, dll (pisah dengan koma)
3. Klik "Simpan"
```

### ✏️ Edit Produk

```
1. Di card produk, klik tombol "Edit"
2. Update data yang perlu diubah
3. Upload gambar baru (opsional)
4. Klik "Update"
Note: Status akan kembali ke "pending" setelah update
```

### 👁️ Lihat Detail Produk

```
1. Di card produk, klik tombol "Detail"
2. Lihat informasi lengkap
3. Bisa edit/delete dari halaman detail
4. Klik "Kembali" untuk ke daftar
```

### 🗑️ Hapus Produk

```
1. Klik tombol "Hapus" di card atau detail page
2. Konfirmasi penghapusan
3. Klik "Hapus Sekarang"
```

## 🖼️ Upload Gambar

### Cara 1: Upload File
```
1. Klik "Upload Image"
2. Pilih file dari komputer
3. Tunggu upload selesai
4. Preview akan muncul otomatis
5. Bisa ganti dengan klik "Upload Image" lagi
```

### Cara 2: Manual URL
```
1. Upload gambar ke hosting (Imgur, Cloudinary, dll)
2. Copy URL gambar
3. Paste di field "Image URL"
4. Preview akan muncul
```

## ⚠️ Troubleshooting Cepat

### Upload Gagal?
```
✅ Cek: Bucket public? (ON)
✅ Cek: File < 5MB?
✅ Cek: Format JPG/PNG/GIF/WebP?
✅ Cek: Internet stabil?
```

### Detail Page 404?
```
✅ Restart server: npm run dev
✅ Clear cache: Ctrl + Shift + R
✅ Cek folder: src/app/developer/products/[id]/page.tsx
```

### Gambar Tidak Muncul?
```
✅ Cek: Bucket public? (HARUS ON!)
✅ Cek: URL valid?
✅ Cek: Format supported?
✅ Test URL di browser baru
```

## 💡 Tips & Tricks

### Image Upload
```
✅ Compress gambar dulu (TinyPNG, Squoosh)
✅ Use WebP untuk size lebih kecil
✅ Optimal size: 800x600px, < 500KB
✅ Rename file sebelum upload untuk tracking
```

### Product Management
```
✅ Isi deskripsi lengkap & menarik
✅ List semua tools yang dipakai
✅ Set preview URL yang working
✅ Review sebelum submit
✅ Update berkala untuk improvement
```

### Performance
```
✅ Upload gambar < 1MB
✅ Gunakan format modern (WebP)
✅ Lazy load untuk banyak produk
✅ Cache images di browser
```

## 🎯 Checklist Sebelum Submit Produk

```
☐ Title jelas & deskriptif
☐ Category benar
☐ Price sudah sesuai
☐ Discount (jika ada) masuk akal
☐ URL preview working
☐ Image clear & berkualitas
☐ Description lengkap & informatif
☐ Tools listed semua
☐ Preview di detail page OK
☐ Ready untuk review admin
```

## 📞 Butuh Bantuan?

```
1. Cek README_PRODUCTS.md untuk detail lengkap
2. Cek STORAGE_SETUP.sql untuk setup storage
3. Lihat console browser untuk error
4. Cek Supabase Dashboard > Logs
5. Review code di file terkait
```

## 🔗 Quick Links

```
Dashboard:       /developer/products
Add Product:     /developer/products (klik "Tambah Produk")
Product Detail:  /developer/products/[id]
API Docs:        Lihat README_PRODUCTS.md
Storage Setup:   STORAGE_SETUP.sql
```

## ✅ Status Check

Pastikan semua ini sudah:
```
☑️ Supabase Storage bucket created
☑️ Bucket set to PUBLIC
☑️ Storage policies configured
☑️ Database schema ready (schema_products.sql)
☑️ Environment variables set (.env.local)
☑️ Dependencies installed (npm install)
☑️ Development server running (npm run dev)
```

---

**Ready to go!** 🚀

Jika semua checklist di atas ✅, Anda siap untuk:
1. Login sebagai developer
2. Mulai tambah produk
3. Upload gambar
4. Manage products dengan mudah

**Happy coding!** 💻✨
