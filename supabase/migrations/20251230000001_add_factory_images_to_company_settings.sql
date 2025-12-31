ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS factory_images JSONB DEFAULT '[]'::jsonb;
