-- Helper function to get current user's role
create or replace function public.get_my_role()
returns text as $$
declare
  user_role text;
begin
  select role into user_role from public.admins where id = auth.uid();
  return user_role;
end;
$$ language plpgsql security definer;

-- Helper function to check if user is super_admin
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins 
    where id = auth.uid() 
    and role = 'super_admin'
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user is admin or above (super_admin, admin)
create or replace function public.is_at_least_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins 
    where id = auth.uid() 
    and role in ('super_admin', 'admin')
  );
end;
$$ language plpgsql security definer;

-- Policies for 'admins' table (Only Super Admin can manage)
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admins;
CREATE POLICY "Admins can view all profiles" ON public.admins
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Super Admins can manage admins" ON public.admins
  FOR ALL USING (public.is_super_admin());


-- Update Policies for other tables

-- Products, Facilities, History, Partners: Super Admin & Admin only (Editor cannot)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins and Super Admins can manage products" ON public.products
  FOR ALL USING (public.is_at_least_admin());

DROP POLICY IF EXISTS "Admins can manage facilities" ON public.facilities;
CREATE POLICY "Admins and Super Admins can manage facilities" ON public.facilities
  FOR ALL USING (public.is_at_least_admin());

DROP POLICY IF EXISTS "Admins can manage history" ON public.history;
CREATE POLICY "Admins and Super Admins can manage history" ON public.history
  FOR ALL USING (public.is_at_least_admin());

DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
CREATE POLICY "Admins and Super Admins can manage partners" ON public.partners
  FOR ALL USING (public.is_at_least_admin());

-- Notices: Super Admin, Admin, AND Editor
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notices;
CREATE POLICY "All Roles can manage notices" ON public.notices
  FOR ALL USING (public.is_admin()); -- is_admin() checks existence in table, so all roles
