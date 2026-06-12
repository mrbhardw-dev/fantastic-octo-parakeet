create table if not exists posts (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null check (length(title) between 3 and 200),
  body                text not null check (length(body) between 10 and 5000),
  category            text not null
    check (category in (
      'Alert', 'Recommendation', 'Lost & Found', 'Event',
      'Local Business', 'Question', 'Community Help'
    )),
  town                text not null default 'Kilcock',
  county              text not null default 'Kildare',
  image_url           text,
  status              text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_by          uuid not null references profiles (id) on delete set null,
  created_at          timestamptz not null default now(),
  stream_activity_id  text
);

alter table posts enable row level security;

-- Public can read approved posts only
create policy "posts: public read approved"
  on posts for select
  using (status = 'approved');

-- Service role handles all writes
create policy "posts: service role write"
  on posts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists posts_status_idx on posts (status);
create index if not exists posts_town_idx on posts (town);
create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists posts_created_by_idx on posts (created_by);
