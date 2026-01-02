-- 1. Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.admins;

-- 2. Create strict policy for self-viewing (Applies to everyone)
CREATE POLICY "Admins can view their own profile" ON public.admins
  FOR SELECT USING (auth.uid() = id);

-- 3. Create policy for Super Admins to view all profiles
-- check if is_super_admin function exists, if not relying on direct check or ensuring the function is part of previous migrations which it is.
CREATE POLICY "Super Admins can view all profiles" ON public.admins
  FOR SELECT USING (public.is_super_admin());
