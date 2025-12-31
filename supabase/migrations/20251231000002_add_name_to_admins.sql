-- Add name column to admins table
ALTER TABLE public.admins 
ADD COLUMN name TEXT;

-- Add comment
COMMENT ON COLUMN public.admins.name IS 'Name of the admin user';
