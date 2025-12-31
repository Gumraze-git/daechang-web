-- 1. Create system_settings table
create table if not exists public.system_settings (
    id integer primary key generated always as identity,
    password_expiration_enabled boolean default false,
    password_expiration_days integer default 90,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Policies for system_settings
-- Everyone (logged in) can read settings (for middleware check)
create policy "Authenticated users can view system settings" on public.system_settings
    for select using (auth.role() = 'authenticated');

-- Only Super Admin can update settings
create policy "Super Admins can update system settings" on public.system_settings
    for update using (public.is_super_admin());

-- Insert default setting row (ensure only one row exists)
insert into public.system_settings (password_expiration_enabled, password_expiration_days)
select false, 90
where not exists (select 1 from public.system_settings);


-- 2. Add password_changed_at to admins table
alter table public.admins 
add column if not exists password_changed_at timestamp with time zone default timezone('utc'::text, now());

-- Update existing admins to have password_changed_at set to their created_at or now if null, to prevent immediate lockout
update public.admins 
set password_changed_at = created_at 
where password_changed_at is null;
