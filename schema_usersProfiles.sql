create table public."usersProfiles" (
  id uuid not null,
  email text null,
  full_name text null,
  phone text null,
  role text null,
  location text null,
  bio text null,
  github text null,
  linkedin text null,
  expertise text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  status text null,
  constraint usersProfiles_pkey primary key (id),
  constraint usersProfiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;