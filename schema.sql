-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL,
  title text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['Website'::text, 'Web App'::text])),
  price numeric NOT NULL,
  discount integer DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  href text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  tools ARRAY DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  admin_notes text,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT fk_developer FOREIGN KEY (developer_id) REFERENCES auth.users(id)
);
CREATE TABLE public.usersProfiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  phone text,
  role text,
  location text,
  bio text,
  github text,
  linkedin text,
  expertise text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status text,
  CONSTRAINT usersProfiles_pkey PRIMARY KEY (id),
  CONSTRAINT usersProfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);