CREATE TABLE public.usersProfiles (
  id UUID PRIMARY KEY,                    -- FK ke auth.users(id)
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,                     -- 'admin' atau 'developer'
  location TEXT,
  bio TEXT,
  github TEXT,                            -- untuk developer
  linkedin TEXT,
  expertise TEXT,                         -- untuk developer
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);