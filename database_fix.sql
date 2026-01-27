-- ====================================================================
-- DATABASE FIX untuk Update Profile & Add Products
-- File: database_fix.sql
-- 
-- INSTRUKSI:
-- 1. Buka Supabase Dashboard
-- 2. Pergi ke SQL Editor
-- 3. Copy-paste seluruh isi file ini
-- 4. Klik RUN untuk mengeksekusi
-- ====================================================================

-- ====================================================================
-- SECTION 1: VERIFIKASI STRUKTUR TABLE usersProfiles
-- ====================================================================

-- Cek kolom yang ada di table usersProfiles
-- Jika kolom github, linkedin, expertise, dan status belum ada, akan ditambahkan

DO $$
BEGIN
    -- Tambah kolom github jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usersProfiles' 
        AND column_name = 'github'
    ) THEN
        ALTER TABLE public."usersProfiles" 
        ADD COLUMN github text NULL;
        
        RAISE NOTICE 'Column github added successfully';
    ELSE
        RAISE NOTICE 'Column github already exists';
    END IF;

    -- Tambah kolom linkedin jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usersProfiles' 
        AND column_name = 'linkedin'
    ) THEN
        ALTER TABLE public."usersProfiles" 
        ADD COLUMN linkedin text NULL;
        
        RAISE NOTICE 'Column linkedin added successfully';
    ELSE
        RAISE NOTICE 'Column linkedin already exists';
    END IF;

    -- Tambah kolom expertise jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usersProfiles' 
        AND column_name = 'expertise'
    ) THEN
        ALTER TABLE public."usersProfiles" 
        ADD COLUMN expertise text NULL;
        
        RAISE NOTICE 'Column expertise added successfully';
    ELSE
        RAISE NOTICE 'Column expertise already exists';
    END IF;

    -- Tambah kolom status jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usersProfiles' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public."usersProfiles" 
        ADD COLUMN status text NULL;
        
        RAISE NOTICE 'Column status added successfully';
    ELSE
        RAISE NOTICE 'Column status already exists';
    END IF;
END $$;

-- ====================================================================
-- SECTION 2: VERIFIKASI STRUKTUR TABLE products
-- ====================================================================

-- Cek apakah semua kolom yang dibutuhkan sudah ada
DO $$
BEGIN
    -- Cek kolom admin_notes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'admin_notes'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN admin_notes text NULL;
        
        RAISE NOTICE 'Column admin_notes added successfully';
    ELSE
        RAISE NOTICE 'Column admin_notes already exists';
    END IF;

    -- Cek kolom tools (array)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'tools'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN tools text[] NULL DEFAULT '{}'::text[];
        
        RAISE NOTICE 'Column tools added successfully';
    ELSE
        RAISE NOTICE 'Column tools already exists';
    END IF;

    -- Cek kolom status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN status text NOT NULL DEFAULT 'pending'::text;
        
        RAISE NOTICE 'Column status added successfully';
    ELSE
        RAISE NOTICE 'Column status already exists';
    END IF;

    -- Cek kolom discount
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'discount'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN discount integer NULL DEFAULT 0;
        
        RAISE NOTICE 'Column discount added successfully';
    ELSE
        RAISE NOTICE 'Column discount already exists';
    END IF;
END $$;

-- ====================================================================
-- SECTION 3: VERIFIKASI DAN PERBAIKI CONSTRAINTS
-- ====================================================================

-- Drop constraint lama jika ada, lalu buat yang baru
DO $$
BEGIN
    -- Constraint untuk products.status
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'products' 
        AND constraint_name = 'products_status_check'
    ) THEN
        ALTER TABLE public.products 
        DROP CONSTRAINT products_status_check;
        
        RAISE NOTICE 'Old status constraint dropped';
    END IF;
    
    ALTER TABLE public.products 
    ADD CONSTRAINT products_status_check 
    CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]));
    
    RAISE NOTICE 'New status constraint added';

    -- Constraint untuk products.discount
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'products' 
        AND constraint_name = 'products_discount_check'
    ) THEN
        ALTER TABLE public.products 
        DROP CONSTRAINT products_discount_check;
        
        RAISE NOTICE 'Old discount constraint dropped';
    END IF;
    
    ALTER TABLE public.products 
    ADD CONSTRAINT products_discount_check 
    CHECK ((discount >= 0) AND (discount <= 100));
    
    RAISE NOTICE 'New discount constraint added';

    -- Constraint untuk products.category
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'products' 
        AND constraint_name = 'products_category_check'
    ) THEN
        ALTER TABLE public.products 
        DROP CONSTRAINT products_category_check;
        
        RAISE NOTICE 'Old category constraint dropped';
    END IF;
    
    ALTER TABLE public.products 
    ADD CONSTRAINT products_category_check 
    CHECK (category = ANY (ARRAY['Website'::text, 'Web App'::text]));
    
    RAISE NOTICE 'New category constraint added';
END $$;

-- ====================================================================
-- SECTION 4: VERIFIKASI INDEXES
-- ====================================================================

-- Buat indexes jika belum ada
CREATE INDEX IF NOT EXISTS idx_products_developer_id 
ON public.products USING btree (developer_id);

CREATE INDEX IF NOT EXISTS idx_products_status 
ON public.products USING btree (status);

CREATE INDEX IF NOT EXISTS idx_products_category 
ON public.products USING btree (category);

CREATE INDEX IF NOT EXISTS idx_products_admin_notes 
ON public.products USING btree (admin_notes) 
WHERE (admin_notes IS NOT NULL);

-- ====================================================================
-- SECTION 5: VERIFIKASI TRIGGERS
-- ====================================================================

-- Pastikan function update_updated_at_column ada
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop trigger lama jika ada
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_usersProfiles_updated_at ON public."usersProfiles";

-- Buat trigger baru
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usersProfiles_updated_at 
BEFORE UPDATE ON public."usersProfiles"
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- SECTION 6: VERIFIKASI RLS POLICIES
-- ====================================================================

-- Pastikan RLS enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."usersProfiles" ENABLE ROW LEVEL SECURITY;

-- Recreate policies untuk products (drop dulu jika ada)
DROP POLICY IF EXISTS "Developer can view own products" ON public.products;
DROP POLICY IF EXISTS "Developer can insert own products" ON public.products;
DROP POLICY IF EXISTS "Developer can update own products" ON public.products;
DROP POLICY IF EXISTS "Developer can delete own products" ON public.products;
DROP POLICY IF EXISTS "Admin can update all products" ON public.products;

-- Developer policies untuk products
CREATE POLICY "Developer can view own products"
ON public.products
FOR SELECT
TO authenticated
USING (developer_id = auth.uid());

CREATE POLICY "Developer can insert own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  developer_id = auth.uid()
  AND public.is_developer()
);

CREATE POLICY "Developer can update own products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  developer_id = auth.uid()
  AND public.is_developer()
)
WITH CHECK (
  developer_id = auth.uid()
);

CREATE POLICY "Developer can delete own products"
ON public.products
FOR DELETE
TO authenticated
USING (
  developer_id = auth.uid()
  AND public.is_developer()
);

-- Admin policy untuk products
CREATE POLICY "Admin can update all products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Recreate policies untuk usersProfiles (drop dulu jika ada)
DROP POLICY IF EXISTS "Developer can view own profile" ON public."usersProfiles";
DROP POLICY IF EXISTS "Developer can update own profile" ON public."usersProfiles";
DROP POLICY IF EXISTS "Admin can view all profiles" ON public."usersProfiles";
DROP POLICY IF EXISTS "Admin can update all profiles" ON public."usersProfiles";
DROP POLICY IF EXISTS "Admin can delete profiles" ON public."usersProfiles";

-- Developer policies untuk usersProfiles
CREATE POLICY "Developer can view own profile"
ON public."usersProfiles"
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Developer can update own profile"
ON public."usersProfiles"
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  AND public.is_developer()
)
WITH CHECK (id = auth.uid());

-- Admin policies untuk usersProfiles
CREATE POLICY "Admin can view all profiles"
ON public."usersProfiles"
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin can update all profiles"
ON public."usersProfiles"
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete profiles"
ON public."usersProfiles"
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ====================================================================
-- SECTION 7: VERIFIKASI HELPER FUNCTIONS
-- ====================================================================

-- Pastikan helper functions ada
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT raw_user_meta_data->>'role'
  FROM auth.users
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.current_user_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.current_user_role() = 'developer';
$$;

-- ====================================================================
-- SECTION 8: VERIFIKASI AUTO USER PROFILE CREATION
-- ====================================================================

-- Function untuk auto create profile saat user register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public."usersProfiles" (
    id,
    email,
    full_name,
    phone,
    role,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'developer'),
    COALESCE(NEW.raw_user_meta_data->>'status', 'pending'),
    now(),
    now()
  );

  RETURN NEW;
END;
$$;

-- Function untuk sync profile saat user update
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public."usersProfiles"
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', phone),
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),
    status = COALESCE(NEW.raw_user_meta_data->>'status', status),
    updated_at = now()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Drop trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Buat trigger baru
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_profile();

-- ====================================================================
-- SECTION 9: VERIFIKASI DATA INTEGRITY
-- ====================================================================

-- Update existing products yang belum punya status
UPDATE public.products 
SET status = 'pending' 
WHERE status IS NULL;

-- Update existing products yang belum punya discount
UPDATE public.products 
SET discount = 0 
WHERE discount IS NULL;

-- Update existing products yang belum punya tools
UPDATE public.products 
SET tools = '{}'::text[] 
WHERE tools IS NULL;

-- ====================================================================
-- SECTION 10: FINAL VERIFICATION
-- ====================================================================

-- Tampilkan struktur table usersProfiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'usersProfiles'
ORDER BY ordinal_position;

-- Tampilkan struktur table products
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products'
ORDER BY ordinal_position;

-- ====================================================================
-- SELESAI!
-- ====================================================================
-- Jika semua berhasil dijalankan tanpa error, maka:
-- ✅ Update Profile akan berfungsi dengan baik
-- ✅ Tambah Products akan berfungsi dengan baik
-- ✅ Semua field yang dibutuhkan sudah tersedia
-- ✅ RLS policies sudah benar
-- ✅ Triggers sudah aktif
-- 
-- NEXT STEPS:
-- 1. Test update profile (developer & admin)
-- 2. Test tambah products
-- 3. Jika masih ada error, cek console browser dan server logs
-- ====================================================================