-- Create notice_categories table
create table if not exists notice_categories (
    id uuid not null default gen_random_uuid(),
    name_ko text not null,
    name_en text,
    is_active boolean default true,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint notice_categories_pkey primary key (id)
);

-- Insert default categories (matching what seems to be used or requested)
insert into notice_categories (name_ko, name_en, sort_order) values
('뉴스', 'News', 1),
('공지사항', 'Notice', 2),
('전시회', 'Exhibition', 3),
('기타', 'Other', 4);

-- Add RLS policies (Open for now as per project style, or restricted to admin if auth enabled)
alter table notice_categories enable row level security;

-- Allow read access to everyone (public)
create policy "Allow public read access" on notice_categories
  for select using (true);

-- Allow all access to authenticated users (admin)
create policy "Allow authenticated full access" on notice_categories
  for all using (auth.role() = 'authenticated');
