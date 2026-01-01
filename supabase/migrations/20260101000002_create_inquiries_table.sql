-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT,
    person_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    inquiry_type TEXT NOT NULL, -- 'general', 'product', 'tech', 'quote', 'other'
    product_category TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow public to insert (anyone can submit an inquiry)
CREATE POLICY "Enable insert for everyone" 
ON public.inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Allow authenticated users (admins) to select/view
CREATE POLICY "Enable select for authenticated users only" 
ON public.inquiries 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Allow authenticated users (admins) to update (e.g., change status)
CREATE POLICY "Enable update for authenticated users only" 
ON public.inquiries 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. Allow authenticated users (admins) to delete
CREATE POLICY "Enable delete for authenticated users only" 
ON public.inquiries 
FOR DELETE 
TO authenticated 
USING (true);
