create table if not exists directory_listings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(name) between 2 and 200),
  category    text not null
    check (category in (
      'Food & Drink', 'Shops', 'Trades', 'Health',
      'Schools & Childcare', 'Clubs & Sports', 'Transport', 'Community Groups'
    )),
  description text,
  website     text,
  phone       text,
  email       text,
  town        text not null default 'Kilcock',
  county      text not null default 'Kildare',
  status      text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_by  uuid not null references profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table directory_listings enable row level security;

create policy "directory_listings: public read approved"
  on directory_listings for select
  using (status = 'approved');

create policy "directory_listings: service role write"
  on directory_listings for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists directory_listings_status_idx on directory_listings (status);
create index if not exists directory_listings_category_idx on directory_listings (category);
create index if not exists directory_listings_town_idx on directory_listings (town);
