-- ====================================================================
-- SUPABASE STORAGE SETUP FOR PRODUCT IMAGES
-- Run this in Supabase SQL Editor to enable image uploads
-- ====================================================================

-- ====================================================================
-- STEP 1: CREATE STORAGE BUCKET
-- ====================================================================
-- Go to Supabase Dashboard > Storage > Create new bucket
-- Bucket name: product-images
-- Public bucket: YES (untuk bisa diakses publik)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- Atau jalankan via SQL (jika ada akses):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true);

-- ====================================================================
-- STEP 2: SET STORAGE POLICIES
-- ====================================================================

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = 'products'
);

-- Policy: Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Policy: Allow public to view images (karena bucket public)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- ====================================================================
-- STEP 3: VERIFY SETUP
-- ====================================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'product-images';

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname LIKE '%product%';

-- ====================================================================
-- CATATAN PENTING
-- ====================================================================
-- 1. Bucket "product-images" harus dibuat terlebih dahulu via Dashboard
--    atau SQL sebelum menjalankan policies
-- 
-- 2. Pastikan bucket di-set sebagai PUBLIC agar gambar bisa diakses
--    tanpa authentication
--
-- 3. File akan diupload ke folder "products/" di dalam bucket
--    Contoh path: product-images/products/abc123-1234567890.jpg
--
-- 4. Format nama file: [random]-[timestamp].[ext]
--    Contoh: 2kf9a-1705123456789.png
--
-- 5. Max file size: 5MB (sesuai validasi di frontend)
--
-- 6. Allowed formats: JPG, PNG, GIF, WebP
--
-- 7. URL publik akan otomatis di-generate oleh Supabase
--    Format: https://[project].supabase.co/storage/v1/object/public/product-images/products/[filename]
--
-- ====================================================================
-- MANUAL SETUP VIA DASHBOARD (RECOMMENDED)
-- ====================================================================
-- Jika SQL di atas tidak bekerja, lakukan setup manual:
--
-- 1. Login ke Supabase Dashboard
-- 2. Pilih project Anda
-- 3. Navigasi ke Storage di menu kiri
-- 4. Klik "Create a new bucket"
-- 5. Isi form:
--    - Name: product-images
--    - Public bucket: Toggle ON (sangat penting!)
--    - File size limit: 5242880 (5MB dalam bytes)
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 6. Klik "Create bucket"
-- 7. Klik bucket yang baru dibuat
-- 8. Klik tab "Policies"
-- 9. Klik "New policy" dan pilih template atau buat custom
-- 10. Pastikan ada policy untuk:
--     - INSERT (authenticated users)
--     - SELECT (public)
--     - UPDATE (authenticated users)
--     - DELETE (authenticated users)
--
-- ====================================================================
-- TESTING
-- ====================================================================
-- Setelah setup selesai, test dengan:
-- 1. Login ke aplikasi sebagai developer
-- 2. Buka halaman Products
-- 3. Klik "Tambah Produk"
-- 4. Upload gambar menggunakan tombol "Upload Image"
-- 5. Pastikan gambar ter-upload dan preview muncul
-- 6. Submit form dan cek apakah URL gambar tersimpan di database
--
-- ====================================================================
-- TROUBLESHOOTING
-- ====================================================================
-- Jika upload gagal, cek:
--
-- 1. Apakah bucket sudah dibuat?
--    SELECT * FROM storage.buckets WHERE name = 'product-images';
--
-- 2. Apakah bucket public?
--    Bucket harus public agar gambar bisa diakses tanpa auth
--
-- 3. Apakah ada error di console browser?
--    Buka Developer Tools > Console untuk lihat error detail
--
-- 4. Apakah policies sudah benar?
--    Cek di Dashboard > Storage > product-images > Policies
--
-- 5. Apakah file size melebihi limit?
--    Max 5MB, cek ukuran file yang di-upload
--
-- 6. Apakah format file didukung?
--    Hanya image/* yang diperbolehkan
--
-- ====================================================================
-- ALTERNATIVE: Using Custom URL
-- ====================================================================
-- Jika tidak ingin setup storage, Anda bisa:
-- 1. Upload gambar ke layanan external (Imgur, Cloudinary, dll)
-- 2. Copy URL gambar
-- 3. Paste URL di field "Image URL" (manual input)
-- 4. Aplikasi akan tetap berfungsi normal
--
-- ====================================================================

-- END OF STORAGE SETUP
