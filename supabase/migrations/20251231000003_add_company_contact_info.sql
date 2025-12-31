-- Add contact info columns to company_settings table
ALTER TABLE public.company_settings 
ADD COLUMN IF NOT EXISTS representative_email TEXT,
ADD COLUMN IF NOT EXISTS representative_phone TEXT,
ADD COLUMN IF NOT EXISTS business_registration_number TEXT;

COMMENT ON COLUMN public.company_settings.representative_email IS 'Representative contact email for footer/site info';
COMMENT ON COLUMN public.company_settings.representative_phone IS 'Representative phone number';
COMMENT ON COLUMN public.company_settings.business_registration_number IS 'Business registration number (license no)';
