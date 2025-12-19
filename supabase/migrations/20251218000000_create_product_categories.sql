-- Create product_categories table
create table if not exists public.product_categories (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  name_ko text not null,
  name_en text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_categories enable row level security;

-- Policies
create policy "Public can view product categories" on public.product_categories
  for select using (true);

create policy "Admins can manage product categories" on public.product_categories
  for all using (public.is_admin());

-- Seed Initial Data
insert into public.product_categories (code, name_ko, name_en) values
  ('blow_molding', '브로우 성형기', 'Blow Molding Machine'),
  ('extrusion', '압출기', 'Extrusion Machine'),
  ('accessory', '주변 기기', 'Accessory'),
  ('recycling', '리사이클링', 'Recycling Machine')
on conflict (code) do nothing;

-- Add Foreign Key Constraint to products table (referencing code instead of id for backward compatibility/ease)
-- Depending on existing data, this might fail if there are other codes. 
-- But we checked ProductForm and those 4 seem to be the only ones.
alter table public.products 
  add constraint fk_products_category 
  foreign key (category_code) 
  references public.product_categories (code)
  on update cascade;
