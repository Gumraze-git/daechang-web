-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Admins Table
create table if not exists public.admins (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admins enable row level security;

create policy "Admins can view their own profile" on public.admins
  for select using (auth.uid() = id);

-- 2. Partners Table (Must be created before products for FK)
create table if not exists public.partners (
  id uuid default gen_random_uuid() primary key,
  name_ko text not null,
  name_en text,
  logo_url text,
  website_url text,
  type text default 'client', -- 'client', 'supplier', 'manufacturer'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.partners enable row level security;

-- 3. Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name_ko text not null,
  name_en text not null,
  desc_ko text,
  desc_en text,
  category_code text not null,
  model_no text,
  capacity text,
  specs jsonb default '[]'::jsonb,
  status text default 'draft', -- 'active', 'draft', 'hidden'
  images text[] default '{}',
  partner_id uuid references public.partners(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- 4. Notices Table
create table if not exists public.notices (
  id uuid default gen_random_uuid() primary key,
  title_ko text not null,
  title_en text,
  body_ko text,
  body_en text,
  category text default 'news',
  status text default 'draft', -- 'draft', 'published', 'archived'
  is_pinned boolean default false,
  published_at date default CURRENT_DATE,
  image_url text,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notices enable row level security;

-- 5. Facilities Table
create table if not exists public.facilities (
  id uuid default gen_random_uuid() primary key,
  name_ko text not null,
  name_en text,
  type text,
  specs text,
  status text default 'active',
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.facilities enable row level security;

-- 6. History Table
create table if not exists public.history (
  id uuid default gen_random_uuid() primary key,
  year text not null,
  month text not null,
  content_ko text not null,
  content_en text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.history enable row level security;

-- 7. Product Notices Junction Table
create table if not exists public.product_notices (
  product_id uuid references public.products(id) on delete cascade not null,
  notice_id uuid references public.notices(id) on delete cascade not null,
  primary key (product_id, notice_id)
);

alter table public.product_notices enable row level security;

-- Helper function to check if user is admin exists
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- RLS Policies (Generic)

-- Public Read Policies
create policy "Public can view active products" on public.products
  for select using (status = 'active' or public.is_admin());

create policy "Public can view published notices" on public.notices
  for select using (status = 'published' or public.is_admin());

create policy "Public can view active facilities" on public.facilities
  for select using (status = 'active' or public.is_admin());

create policy "Public can view history" on public.history
  for select using (true);

create policy "Public can view partners" on public.partners
  for select using (true);
  
create policy "Public can view product_notices" on public.product_notices
  for select using (true);

-- Admin Write Policies (Insert, Update, Delete)
-- Applies to: products, notices, facilities, history, partners, product_notices

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

create policy "Admins can manage notices" on public.notices
  for all using (public.is_admin());

create policy "Admins can manage facilities" on public.facilities
  for all using (public.is_admin());

create policy "Admins can manage history" on public.history
  for all using (public.is_admin());

create policy "Admins can manage partners" on public.partners
  for all using (public.is_admin());
  
create policy "Admins can manage product_notices" on public.product_notices
  for all using (public.is_admin());

-- Insert Initial Admin (Optional: You can uncomment and replace with your UID if strict RLS blocks you initially)
-- insert into public.admins (id, email) values ('YOUR_USER_UID', 'admin@daechang.com');
