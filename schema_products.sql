-- ====================================================================
-- COMPLETE FIX FOR PRODUCTS FEATURE
-- Run this script in Supabase SQL Editor
-- ====================================================================

-- ====================================================================
-- STEP 1: DROP OLD TABLE (OPTIONAL - BACKUP DATA FIRST!)
-- ====================================================================
-- UNCOMMENT JIKA INGIN RESET DARI AWAL
-- DROP TABLE IF EXISTS public.products CASCADE;

-- ====================================================================
-- STEP 2: CREATE TABLE PRODUCTS (SKIP IF EXISTS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Website', 'Web App')),
  price DECIMAL(10, 2) NOT NULL,
  discount INTEGER DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  href TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  tools TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_developer
    FOREIGN KEY (developer_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- ====================================================================
-- STEP 3: CREATE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_developer_id ON public.products(developer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- ====================================================================
-- STEP 4: ENABLE RLS
-- ====================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- STEP 5: DROP OLD POLICIES
-- ====================================================================
DROP POLICY IF EXISTS "Developer can view own products" ON public.products;
DROP POLICY IF EXISTS "Developer can insert own products" ON public.products;
DROP POLICY IF EXISTS "Developer can update own products" ON public.products;
DROP POLICY IF EXISTS "Developer can delete own products" ON public.products;
DROP POLICY IF EXISTS "Admin can view all products" ON public.products;
DROP POLICY IF EXISTS "Admin can update all products" ON public.products;
DROP POLICY IF EXISTS "Public can view approved products" ON public.products;

-- ====================================================================
-- STEP 6: CREATE NEW POLICIES
-- ====================================================================

-- Developer: View own products
CREATE POLICY "Developer can view own products"
  ON public.products
  FOR SELECT
  USING (auth.uid() = developer_id);

-- Developer: Insert own products
CREATE POLICY "Developer can insert own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = developer_id);

-- Developer: Update own products
CREATE POLICY "Developer can update own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = developer_id);

-- Developer: Delete own products
CREATE POLICY "Developer can delete own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = developer_id);

-- Admin: View all products
CREATE POLICY "Admin can view all products"
  ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public."usersProfiles"
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin: Update all products
CREATE POLICY "Admin can update all products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM public."usersProfiles"
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (true);

-- Public: View approved products
CREATE POLICY "Public can view approved products"
  ON public.products
  FOR SELECT
  USING (status = 'approved');

-- ====================================================================
-- STEP 7: CREATE/REPLACE TRIGGER FUNCTION
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- STEP 8: CREATE TRIGGER
-- ====================================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- STEP 9: GRANT PERMISSIONS
-- ====================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;

-- ====================================================================
-- STEP 10: VERIFY SETUP
-- ====================================================================

-- Check if table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'products';

-- Check foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'products' 
  AND tc.constraint_type = 'FOREIGN KEY';

-- ====================================================================
-- STEP 11: VERIFY USER ROLE (IMPORTANT!)
-- ====================================================================

-- Check your user role (GANTI EMAIL DENGAN EMAIL ANDA!)
SELECT id, email, full_name, role, status
FROM public."usersProfiles"
WHERE email = 'YOUR_EMAIL@example.com';

-- If role is not 'developer', update it:
-- UPDATE public."usersProfiles" 
-- SET role = 'developer' 
-- WHERE email = 'YOUR_EMAIL@example.com';

-- ====================================================================
-- STEP 12: INSERT SAMPLE DATA (OPTIONAL)
-- ====================================================================

-- Get your user ID first
-- SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- Then insert sample product (GANTI YOUR_USER_ID!)
/*
INSERT INTO public.products (
  developer_id,
  title,
  category,
  price,
  discount,
  href,
  image,
  description,
  tools,
  status
) VALUES (
  'YOUR_USER_ID',
  'Landing Page Modern',
  'Website',
  150000,
  15,
  'https://example.com',
  '/images/Product/001.png',
  'Landing page dengan design modern dan responsive',
  ARRAY['React.js', 'Tailwind CSS', 'Next.js'],
  'pending'
);
*/

-- ====================================================================
-- COMPLETE! 
-- ====================================================================
-- Now you can:
-- 1. Restart your development server: npm run dev
-- 2. Clear browser cache or use incognito mode
-- 3. Login as developer
-- 4. Test at: http://localhost:3000/developer/products
-- ====================================================================
