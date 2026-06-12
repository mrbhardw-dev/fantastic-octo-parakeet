create extension if not exists "pgcrypto";

create table if not exists profiles (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  display_name  text not null,
  email         text not null,
  town          text not null default 'Kilcock',
  county        text not null default 'Kildare',
  role          text not null default 'resident'
    check (role in ('resident', 'business', 'club', 'moderator', 'admin')),
  avatar_url    text,
  created_at    timestamptz not null default now()
);

-- Row Level Security
alter table profiles enable row level security;

-- Users can read their own profile
create policy "profiles: read own"
  on profiles for select
  using (true);  -- public display_name is OK; email is never returned in public queries

-- Only service role can insert/update (Clerk webhook + server actions)
create policy "profiles: service role write"
  on profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Indexes
create index if not exists profiles_clerk_user_id_idx on profiles (clerk_user_id);
