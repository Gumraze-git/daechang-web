-- Add image_urls column to notices table
alter table public.notices 
add column if not exists image_urls text[] default '{}';

-- Migrate existing image_url data to image_urls
-- Only migrate if image_url is present and image_urls is empty
update public.notices 
set image_urls = array[image_url] 
where image_url is not null and (image_urls is null or cardinality(image_urls) = 0);

-- Note: We keep image_url column for now to prevent breaking existing code immediately, 
-- but will switch to using image_urls in the application logic.
