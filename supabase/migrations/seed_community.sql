-- Community seed data for baile.fyi — Kilcock, Co. Kildare
-- Run AFTER migrations 001-006 and after you have signed up.
-- Replace YOUR_CLERK_USER_ID with your actual Clerk user ID (user_...).

-- 1. Create your admin profile (safe to re-run)
insert into profiles (clerk_user_id, display_name, email, town, county, role)
values (
  'YOUR_CLERK_USER_ID',
  'baile.fyi Admin',
  'admin@baile.fyi',
  'Kilcock',
  'Kildare',
  'admin'
)
on conflict (clerk_user_id) do update set role = 'admin';

-- 2. Schools
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into directory_listings (name, category, description, website, phone, email, town, county, status, created_by)
select name, category, description, website, phone, email, town, county, 'approved', (select id from admin)
from (values
  ('Scoil Choca Naofa',    'Schools & Childcare', 'Catholic primary school on Church Street, Kilcock.',           'https://scoilchoca.ie',          '(01) 628 7967', 'office@scoilchoca.ie',          'Kilcock',  'Kildare'),
  ('St Joseph''s B.N.S.',  'Schools & Childcare', 'Boys'' national school in Highfield, Kilcock.',                'https://stjosephskilcock.com',   '(01) 628 7628', 'office@stjosephskilcock.com',   'Kilcock',  'Kildare'),
  ('Scoil Uí Riada',       'Schools & Childcare', 'Primary school in Brayton Park, Kilcock.',                    'https://scoiluiriada.ie',        '(01) 628 7906', 'eolas@scoiluiriada.ie',         'Kilcock',  'Kildare'),
  ('Scoil Dara',           'Schools & Childcare', 'Secondary school serving Kilcock and surrounding areas.',     'https://scoildara.ie',           '(01) 628 7258', 'scoildara@eircom.net',           'Kilcock',  'Kildare'),
  ('Newtown N.S.',         'Schools & Childcare', 'National school serving Newtown, Enfield area.',              null,                             '(046) 954 1122', null,                            'Newtown',  'Meath'),
  ('Tiermohan N.S.',       'Schools & Childcare', 'National school in Donadea, Co. Kildare.',                   null,                             '(045) 869 442', 'office@tiermohanns.ie',          'Donadea',  'Kildare')
) as t(name, category, description, website, phone, email, town, county);

-- 3. Essential local services
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into directory_listings (name, category, description, website, phone, town, county, status, created_by)
select name, category, description, website, phone, town, county, 'approved', (select id from admin)
from (values
  ('Kildare County Council',  'Community Groups', 'Your local authority. Out-of-hours emergency line: 1800 500 444 (free). Services include roads, planning, housing, and waste.',                           'https://www.kildarecoco.ie',       '045 980200',     'Kilcock', 'Kildare'),
  ('An Garda Síochána',       'Community Groups', 'Irish national police service. For emergencies dial 999 or 112. Local Kildare division covers Kilcock and surrounding area.',                            'https://www.garda.ie',             '999 / 112',      'Kilcock', 'Kildare'),
  ('ESB Networks',            'Community Groups', 'Report power outages and electrical network faults. 24-hour freephone. Essential contact during storms or blackouts.',                                   'https://www.esbnetworks.ie',       '1800 372 999',   'Kilcock', 'Kildare'),
  ('Gas Networks Ireland',    'Community Groups', 'Report gas leaks or network emergencies. 24-hour freephone. If you smell gas, call immediately and leave the building.',                                 'https://www.gasnetworks.ie',       '1800 20 50 50',  'Kilcock', 'Kildare'),
  ('Irish Water',             'Community Groups', 'Report water supply issues, burst mains, or sewage problems. 24-hour freephone.',                                                                        'https://www.water.ie',             '1800 278 278',   'Kilcock', 'Kildare'),
  ('Dublin Bus',              'Transport',        'Bus services connecting Kilcock to Dublin city and surrounding areas. Check real-time departures on the Dublin Bus app or website.',                     'https://www.dublinbus.ie',         '(01) 873 4222',  'Kilcock', 'Kildare'),
  ('Iarnród Éireann',         'Transport',        'Train services from Kilcock station on the Dublin–Maynooth commuter line. Regular services to Dublin Connolly and Heuston.',                            'https://www.irishrail.ie',         '1850 366 222',   'Kilcock', 'Kildare'),
  ('Met Éireann',             'Community Groups', 'Ireland''s national meteorological service. Check the Kildare county forecast for up-to-date weather, wind, and rainfall warnings.',                    'https://www.met.ie',               null,             'Kilcock', 'Kildare'),
  ('Kildare MapAlerter',      'Community Groups', 'Sign up to receive free emergency alerts from Kildare County Council directly to your phone — floods, road closures, severe weather, and more.',        'https://kildare.mapalerter.com',   null,             'Kilcock', 'Kildare')
) as t(name, category, description, website, phone, town, county);

-- 4. Pinned feed posts
with admin as (select id from profiles where clerk_user_id = 'YOUR_CLERK_USER_ID')
insert into posts (title, body, category, town, county, status, created_by)
select title, body, category, town, county, 'approved', (select id from admin)
from (values
  (
    'Key Emergency Contacts for Kilcock & Co. Kildare',
    'Keep these numbers handy for emergencies in Kilcock and Co. Kildare:

🚨 Emergency services: 999 or 112
🏛 Kildare County Council (out of hours): 1800 500 444 (free)
⚡ ESB Networks (power outages): 1800 372 999 (free)
🔥 Gas Networks Ireland (gas leaks): 1800 20 50 50 (free)
💧 Irish Water (burst mains/sewage): 1800 278 278 (free)
👮 An Garda Síochána: 999 or 112

For non-emergency Garda matters, visit garda.ie to find your local station.
For council services (roads, planning, housing), visit kildarecoco.ie or call 045 980200.',
    'Alert',
    'Kilcock',
    'Kildare'
  ),
  (
    'Weather, Roads & Flooding Resources for Co. Kildare',
    'Useful links for staying on top of local conditions — especially during autumn and winter:

🌦 Weather forecast: met.ie — check the Kildare county forecast for up-to-date conditions and warnings.

🚗 Road conditions: aaroadwatch.ie — live traffic and road condition updates across Ireland.

🌊 Flooding information: flooding.ie — national flood maps and river level data.

❄️ Winter preparedness: winterready.ie — tips and resources for staying safe in severe weather.

📱 Emergency alerts: Sign up at kildare.mapalerter.com to receive free alerts from Kildare County Council directly to your phone when emergencies occur locally.',
    'Alert',
    'Kilcock',
    'Kildare'
  )
) as t(title, body, category, town, county);
