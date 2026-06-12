-- Seed data for baile.fyi — Kilcock, Co. Kildare
-- Run this after all migrations are applied.
-- Replace 'YOUR_CLERK_ADMIN_USER_ID' with your actual Clerk user ID.

-- Admin profile
insert into profiles (clerk_user_id, display_name, email, town, county, role)
values (
  'YOUR_CLERK_ADMIN_USER_ID',
  'baile.fyi Admin',
  'admin@baile.fyi',
  'Kilcock',
  'Kildare',
  'admin'
)
on conflict (clerk_user_id) do nothing;

-- Sample approved posts
insert into posts (title, body, category, town, county, status, created_by)
select
  'Welcome to baile.fyi — Kilcock''s community noticeboard!',
  'We''re excited to launch baile.fyi for the people of Kilcock, Co. Kildare. This is your community noticeboard — a place to share local news, find events, discover businesses, and help each other out. All posts are moderated to keep the community safe and useful. Get started by creating your free account!',
  'Community Help',
  'Kilcock',
  'Kildare',
  'approved',
  id
from profiles
where clerk_user_id = 'YOUR_CLERK_ADMIN_USER_ID'
limit 1;

-- Sample directory listings
insert into directory_listings (name, category, description, town, county, status, created_by)
select
  'Kilcock GAA Club',
  'Clubs & Sports',
  'Ardclough and Kilcock GAA clubs serving the local community in Gaelic football and hurling. Training sessions weekly. All ages welcome.',
  'Kilcock',
  'Kildare',
  'approved',
  id
from profiles
where clerk_user_id = 'YOUR_CLERK_ADMIN_USER_ID'
limit 1;

insert into directory_listings (name, category, description, website, town, county, status, created_by)
select
  'Kilcock Train Station',
  'Transport',
  'Kilcock railway station on the Dublin-Maynooth line. Commuter rail to Dublin Connolly and Heuston stations. Regular services throughout the day.',
  'https://www.irishrail.ie',
  'Kilcock',
  'Kildare',
  'approved',
  id
from profiles
where clerk_user_id = 'YOUR_CLERK_ADMIN_USER_ID'
limit 1;

-- Sample events
insert into events (title, description, starts_at, venue_name, town, county, status, created_by)
select
  'Kilcock Community Meeting',
  'Monthly community meeting for residents of Kilcock. All are welcome to attend. Agenda items can be submitted in advance.',
  now() + interval '7 days',
  'Kilcock Community Centre',
  'Kilcock',
  'Kildare',
  'approved',
  id
from profiles
where clerk_user_id = 'YOUR_CLERK_ADMIN_USER_ID'
limit 1;
