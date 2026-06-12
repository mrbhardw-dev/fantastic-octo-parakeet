create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  reporter_id   uuid not null references profiles (id) on delete cascade,
  content_type  text not null check (content_type in ('post', 'event', 'directory', 'help_post')),
  content_id    uuid not null,
  reason        text not null check (length(reason) between 5 and 1000),
  created_at    timestamptz not null default now()
);

alter table reports enable row level security;

-- Only admins/moderators can read reports
create policy "reports: admin read"
  on reports for select
  using (auth.role() = 'service_role');

-- Service role handles writes
create policy "reports: service role write"
  on reports for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists reports_content_idx on reports (content_type, content_id);
create index if not exists reports_reporter_idx on reports (reporter_id);
