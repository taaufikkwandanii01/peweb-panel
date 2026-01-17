create table public.products (
  id uuid not null default gen_random_uuid (),
  developer_id uuid not null,
  title text not null,
  category text not null,
  price numeric(10, 2) not null,
  discount integer null default 0,
  href text not null,
  image text not null,
  description text not null,
  tools text[] null default '{}'::text[],
  status text not null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  admin_notes text null,
  constraint products_pkey primary key (id),
  constraint fk_developer foreign KEY (developer_id) references auth.users (id) on delete CASCADE,
  constraint products_category_check check (
    (
      category = any (array['Website'::text, 'Web App'::text])
    )
  ),
  constraint products_discount_check check (
    (
      (discount >= 0)
      and (discount <= 100)
    )
  ),
  constraint products_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'approved'::text,
          'rejected'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_products_developer_id on public.products using btree (developer_id) TABLESPACE pg_default;

create index IF not exists idx_products_status on public.products using btree (status) TABLESPACE pg_default;

create index IF not exists idx_products_category on public.products using btree (category) TABLESPACE pg_default;

create index IF not exists idx_products_admin_notes on public.products using btree (admin_notes) TABLESPACE pg_default
where
  (admin_notes is not null);

create trigger update_products_updated_at BEFORE
update on products for EACH row
execute FUNCTION update_updated_at_column ();