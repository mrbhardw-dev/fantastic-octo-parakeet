create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (length(title) between 3 and 200),
  description  text,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  venue_name   text,
  town         text not null default 'Kilcock',
  county       text not null default 'Kildare',
  source_url   text,
  status       text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_by   uuid not null references profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

alter table events enable row level security;

create policy "events: public read approved"
  on events for select
  using (status = 'approved');

create policy "events: service role write"
  on events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists events_status_idx on events (status);
create index if not exists events_starts_at_idx on events (starts_at);
create index if not exists events_town_idx on events (town);
