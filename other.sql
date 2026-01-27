ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."usersProfiles" ENABLE ROW LEVEL SECURITY;

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


CREATE POLICY "Developer can view own products"
ON public.products
FOR SELECT
TO authenticated
USING (
  developer_id = auth.uid()
);


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


CREATE POLICY "Admin can update all products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);


CREATE POLICY "Developer can view own profile"
ON public."usersProfiles"
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);


CREATE POLICY "Developer can update own profile"
ON public."usersProfiles"
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  AND public.is_developer()
)
WITH CHECK (
  id = auth.uid()
);


CREATE POLICY "Admin can view all profiles"
ON public."usersProfiles"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
);


CREATE POLICY "Admin can update all profiles"
ON public."usersProfiles"
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);


CREATE POLICY "Admin can delete profiles"
ON public."usersProfiles"
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);


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


CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


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


CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_profile();


CREATE TRIGGER update_usersProfiles_updated_at
BEFORE UPDATE ON public."usersProfiles"
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

