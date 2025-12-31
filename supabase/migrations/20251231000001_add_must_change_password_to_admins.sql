-- Add must_change_password column to admins table
ALTER TABLE public.admins 
ADD COLUMN must_change_password BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.admins.must_change_password IS 'Flag to force password change on next login';
