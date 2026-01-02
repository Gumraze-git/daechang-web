-- Create Rate Limit Logs Table
create table if not exists public.rate_limit_logs (
    id uuid default gen_random_uuid() primary key,
    ip text not null,
    action text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for performance
create index if not exists idx_rate_limit_logs_lookup 
on public.rate_limit_logs (ip, action, created_at);

-- RLS: Enable RLS but don't add any policies. 
-- This essentially makes it private/inaccessible to the public client, 
-- which is what we want. Only Service Role (Admin Client) should access this.
alter table public.rate_limit_logs enable row level security;
