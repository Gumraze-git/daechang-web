-- Create storage buckets
insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('notices', 'notices', true),
  ('partners', 'partners', true),
  ('facilities', 'facilities', true)
on conflict (id) do nothing;

-- RLS Policies for Storage
-- Allow public read access to all buckets
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('products', 'notices', 'partners', 'facilities') );

-- Allow authenticated users (admins) to upload/update/delete
create policy "Admin Upload"
  on storage.objects for insert
  with check ( bucket_id in ('products', 'notices', 'partners', 'facilities') and auth.role() = 'authenticated' );

create policy "Admin Update"
  on storage.objects for update
  using ( bucket_id in ('products', 'notices', 'partners', 'facilities') and auth.role() = 'authenticated' );

create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id in ('products', 'notices', 'partners', 'facilities') and auth.role() = 'authenticated' );
