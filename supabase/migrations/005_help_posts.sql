create table if not exists help_posts (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('need', 'offer')),
  title       text not null check (length(title) between 3 and 200),
  body        text not null check (length(body) between 10 and 2000),
  town        text not null default 'Kilcock',
  county      text not null default 'Kildare',
  status      text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_by  uuid not null references profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table help_posts enable row level security;

create policy "help_posts: public read approved"
  on help_posts for select
  using (status = 'approved');

create policy "help_posts: service role write"
  on help_posts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists help_posts_status_idx on help_posts (status);
create index if not exists help_posts_type_idx on help_posts (type);
create index if not exists help_posts_town_idx on help_posts (town);
