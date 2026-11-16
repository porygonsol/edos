-- Run this once in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/hzrthntphlqkkyqiorjg/sql

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  role        text,
  joined_at   timestamptz not null default now(),
  source      text default 'website'
);

-- Index for fast lookup by email
create index if not exists waitlist_email_idx on public.waitlist (email);
-- Index for analytics by date
create index if not exists waitlist_joined_at_idx on public.waitlist (joined_at desc);

-- Row Level Security: service_role can do everything (used server-side only)
-- anon role can only INSERT (for the form) — no reading other people's data
alter table public.waitlist enable row level security;

create policy "Anyone can join waitlist"
  on public.waitlist for insert
  to anon
  with check (true);

create policy "Service role has full access"
  on public.waitlist for all
  to service_role
  using (true)
  with check (true);

-- Analytics view: total signups by day
create or replace view public.waitlist_daily_signups as
  select
    date_trunc('day', joined_at) as day,
    count(*) as signups
  from public.waitlist
  group by 1
  order by 1 desc;

-- Analytics view: signups by role
create or replace view public.waitlist_by_role as
  select
    coalesce(role, 'not specified') as role,
    count(*) as count,
    round(count(*) * 100.0 / sum(count(*)) over (), 1) as percentage
  from public.waitlist
  group by 1
  order by 2 desc;
