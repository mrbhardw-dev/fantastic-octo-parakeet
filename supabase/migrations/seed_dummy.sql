-- Dummy data seed for baile.fyi — realistic content across all features
-- Covers: health directory, posts, events, help posts
-- Run AFTER seed_community.sql (requires admin profile to exist).
-- Replace YOUR_CLERK_USER_ID with your actual Clerk user ID.

-- ─────────────────────────────────────────────
-- 1. Health services directory
-- ─────────────────────────────────────────────
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into directory_listings (name, category, description, website, phone, email, town, county, status, created_by)
select name, category, description, website, phone, email, town, county, 'approved', (select id from admin)
from (values
  (
    'Kilcock Medical Centre',
    'Health & Wellbeing',
    'GP practice serving Kilcock and surrounding areas. Appointment required. Out-of-hours cover via Midlands GP Out of Hours Service.',
    null,
    '(01) 628 7100',
    null,
    'Kilcock', 'Kildare'
  ),
  (
    'Connolly Hospital Blanchardstown',
    'Health & Wellbeing',
    'Acute general hospital serving North Kildare and West Dublin. A&E open 24 hours. Approximately 20 km from Kilcock.',
    'https://www.connollyhospital.ie',
    '(01) 646 5000',
    null,
    'Blanchardstown', 'Dublin'
  ),
  (
    'Naas General Hospital',
    'Health & Wellbeing',
    'Acute hospital serving Co. Kildare. A&E, maternity, and specialist services. Approximately 21 km from Kilcock.',
    'https://www.naasgeneralhospital.ie',
    '(045) 849 300',
    null,
    'Naas', 'Kildare'
  ),
  (
    'Kilcock Pharmacy',
    'Health & Wellbeing',
    'Community pharmacy on Main Street offering prescriptions, OTC medicines, blood pressure monitoring, and flu vaccines in season.',
    null,
    '(01) 628 7430',
    null,
    'Kilcock', 'Kildare'
  ),
  (
    'Maynooth Medical Centre',
    'Health & Wellbeing',
    'GP practice in nearby Maynooth accepting new patients from the North Kildare area. Online booking available.',
    'https://www.maynoothmedical.ie',
    '(01) 628 6100',
    'reception@maynoothmedical.ie',
    'Maynooth', 'Kildare'
  ),
  (
    'HSE Midlands GP Out of Hours',
    'Health & Wellbeing',
    'For urgent but non-emergency medical care outside normal GP hours — evenings, weekends, and bank holidays. Call to be triaged before attending.',
    'https://www.hse.ie',
    '1850 335 999',
    null,
    'Kilcock', 'Kildare'
  )
) as t(name, category, description, website, phone, email, town, county);

-- ─────────────────────────────────────────────
-- 2. Community posts (approved, varied categories)
-- ─────────────────────────────────────────────
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into posts (title, body, category, town, county, status, created_by, created_at)
select title, body, category, town, county, 'approved', (select id from admin), created_at
from (values
  (
    'New café open on Main Street — worth a visit',
    'Just popped into The Millstone Café that opened last week on Main Street. Really lovely spot — great coffee, homemade scones, and the staff are friendly. Nice to see a new independent business in the town. They''re open Mon–Sat 8am–5pm.',
    'Recommendation',
    'Kilcock', 'Kildare',
    now() - interval '5 days'
  ),
  (
    'Lost: black Labrador near the canal — please help',
    'Our dog Biscuit went missing yesterday evening near the canal walk behind Kilcock. He''s a 3-year-old black Labrador, wearing a red collar with a tag. Very friendly but might be scared. If you spot him please call or text 087 123 4567. We''re heartbroken and the kids are devastated.',
    'Lost & Found',
    'Kilcock', 'Kildare',
    now() - interval '1 day'
  ),
  (
    'Anyone know if the 115 bus timetable has changed?',
    'I noticed the morning 115 Dublin Bus service seems to have shifted by about 10 minutes this week — was it just late or has there been a schedule change? Couldn''t find anything on the Dublin Bus website. Would appreciate if anyone has info.',
    'Question',
    'Kilcock', 'Kildare',
    now() - interval '3 days'
  ),
  (
    'Community litter pick — Saturday 28th June',
    'Kilcock Tidy Towns are organising a litter pick this Saturday 28th June starting at 10am at the Market Square. Bags and gloves provided. All welcome — the more the merrier. Great way to spend an hour and make a real difference to the town. Kids welcome too!',
    'Community Help',
    'Kilcock', 'Kildare',
    now() - interval '2 days'
  ),
  (
    'Found: set of keys near St. Coca''s church',
    'Found a set of keys (house keys + a car key fob) on the path near St. Coca''s church this morning. Drop me a message to describe them and I''ll arrange to hand them back.',
    'Lost & Found',
    'Kilcock', 'Kildare',
    now() - interval '4 hours'
  ),
  (
    'Shoutout to Kilcock GAA — Feile weekend was brilliant',
    'Just wanted to say well done to everyone at Kilcock GAA who organised the Feile weekend. The pitch looked immaculate, the catering was excellent and the kids had an amazing time. A huge amount of work goes on behind the scenes and it really shows.',
    'Recommendation',
    'Kilcock', 'Kildare',
    now() - interval '6 days'
  )
) as t(title, body, category, town, county, created_at);

-- ─────────────────────────────────────────────
-- 3. Local events (upcoming, approved)
-- ─────────────────────────────────────────────
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into events (title, description, starts_at, ends_at, venue_name, town, county, status, created_by)
select title, description, starts_at, ends_at, venue_name, town, county, 'approved', (select id from admin)
from (values
  (
    'Kilcock Summer Fair 2026',
    'The annual Kilcock Summer Fair returns to Market Square with stalls, live music, food trucks, and activities for all ages. Free entry. Proceeds support local charities.',
    '2026-07-05 11:00:00+01'::timestamptz,
    '2026-07-05 18:00:00+01'::timestamptz,
    'Market Square',
    'Kilcock', 'Kildare'
  ),
  (
    'Tidy Towns Litter Pick',
    'Join Kilcock Tidy Towns for a community litter pick around the town and canal. Bags and gloves provided. Meet at Market Square. All welcome.',
    '2026-06-28 10:00:00+01'::timestamptz,
    '2026-06-28 12:00:00+01'::timestamptz,
    'Market Square',
    'Kilcock', 'Kildare'
  ),
  (
    'Kilcock GAA Senior Championship Match',
    'Kilcock GAA Senior Football team take on Sarsfields in the opening round of the Kildare Senior Championship. Come down and support the lads!',
    '2026-06-22 14:00:00+01'::timestamptz,
    '2026-06-22 16:00:00+01'::timestamptz,
    'Kilcock GAA Grounds',
    'Kilcock', 'Kildare'
  ),
  (
    'St. Coca''s Parish Fundraising Quiz Night',
    'Monthly table quiz in aid of St. Coca''s parish fund. Teams of 4, €10 per person. Light supper included. Great craic — book your table in advance.',
    '2026-06-20 19:30:00+01'::timestamptz,
    '2026-06-20 22:00:00+01'::timestamptz,
    'Kilcock Parish Hall',
    'Kilcock', 'Kildare'
  ),
  (
    'First Communion Mass — Scoil Choca Naofa',
    'First Communion ceremony for 2nd class pupils of Scoil Choca Naofa. Families welcome.',
    '2026-06-14 11:00:00+01'::timestamptz,
    null,
    'St. Coca''s Church',
    'Kilcock', 'Kildare'
  )
) as t(title, description, starts_at, ends_at, venue_name, town, county);

-- ─────────────────────────────────────────────
-- 4. Help posts (needs & offers, approved)
-- ─────────────────────────────────────────────
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into help_posts (type, title, body, town, county, status, created_by)
select type, title, body, town, county, 'approved', (select id from admin)
from (values
  (
    'offer',
    'Happy to give lifts to Maynooth train station — mornings',
    'I drive to Maynooth station every weekday morning leaving Kilcock around 7:45am. Happy to take 1–2 passengers if it helps. No charge, just be on time! Drop me a message if interested.',
    'Kilcock', 'Kildare'
  ),
  (
    'need',
    'Looking for a reliable babysitter for occasional evenings',
    'We have two kids (ages 4 and 7) and are looking for a local babysitter for occasional Friday or Saturday evenings. Ideally someone with experience and references. Happy to pay the going rate.',
    'Kilcock', 'Kildare'
  ),
  (
    'offer',
    'Free garden furniture — good condition, needs a new home',
    'Clearing out the garden and have a 4-seater patio table and 4 chairs going free. Metal frame, glass top, some surface wear but structurally solid. You collect. Located near the train station.',
    'Kilcock', 'Kildare'
  ),
  (
    'need',
    'Can anyone recommend a good local plumber?',
    'Had a slow leak under the kitchen sink for a while and finally need to get it sorted properly. Looking for a reliable local plumber — ideally someone who has done work for neighbours in Kilcock. PM me if you have a recommendation.',
    'Kilcock', 'Kildare'
  ),
  (
    'offer',
    'Lawn mowing — free for elderly or disabled neighbours',
    'Retired and happy to mow the lawn for any elderly or disabled neighbours in Kilcock who need a hand. No charge at all. Just send a message and we''ll sort a time.',
    'Kilcock', 'Kildare'
  )
) as t(type, title, body, town, county);
