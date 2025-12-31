-- Migration: create product_partners join table
create table product_partners (
    product_id uuid references products(id) on delete cascade,
    partner_id uuid references partners(id) on delete cascade,
    primary key (product_id, partner_id)
);

-- Enable Row Level Security
alter table product_partners enable row level security;

-- Policies
create policy "allow read" on product_partners for select using (true);
create policy "allow insert" on product_partners for insert with check (true);
create policy "allow delete" on product_partners for delete using (true);
