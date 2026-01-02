-- Harden Storage Policies (Only Admins can modify, Read is Public)

-- 1. Drop existing permissive policies (that relied on 'authenticated' role only)
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- 2. Re-create policies using strict admin check (public.is_at_least_admin())
-- Ensure the helper function is available to storage policies (security definer in public schema is usually accessible)

CREATE POLICY "Admin Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('products', 'notices', 'partners', 'facilities') 
    AND (
      (auth.role() = 'authenticated' AND public.is_admin()) 
    )
  );

CREATE POLICY "Admin Update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('products', 'notices', 'partners', 'facilities') 
    AND (
       (auth.role() = 'authenticated' AND public.is_admin())
    )
  );

CREATE POLICY "Admin Delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('products', 'notices', 'partners', 'facilities') 
    AND (
       (auth.role() = 'authenticated' AND public.is_admin())
    )
  );
