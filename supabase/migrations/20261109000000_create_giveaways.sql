-- Giveaways: reusable sweepstakes with entry form, bonus actions, referrals,
-- public leaderboard, and weighted random winner draw.
-- All access goes through Next.js API routes using the service role key,
-- so RLS is enabled with no public policies.

create table if not exists public.giveaways (
  id               bigserial primary key,
  created_at       timestamptz not null default now(),
  slug             text not null unique,
  title            text not null,
  prize            text not null,
  prize_value      text,
  description      text,
  sponsor_name     text,
  sponsor_url      text,
  image_url        text,
  starts_at        timestamptz,
  ends_at          timestamptz,
  status           text not null default 'draft' check (status in ('draft', 'active', 'ended')),
  points_entry     int not null default 1,
  points_referral  int not null default 5,
  min_age          int not null default 18,
  rules            text,
  winner_entrant_id uuid,
  winner_drawn_at  timestamptz
);

create table if not exists public.giveaway_actions (
  id           bigserial primary key,
  giveaway_id  bigint not null references public.giveaways(id) on delete cascade,
  kind         text not null check (kind in ('link', 'code')),
  label        text not null,
  url          text,
  code         text,
  points       int not null default 2,
  sort         int not null default 0,
  active       boolean not null default true
);
create index on public.giveaway_actions (giveaway_id, sort);

create table if not exists public.giveaway_entrants (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  giveaway_id   bigint not null references public.giveaways(id) on delete cascade,
  email         text not null,
  first_name    text not null,
  last_name     text not null,
  zip           text not null,
  referral_code text not null unique,
  referred_by   uuid references public.giveaway_entrants(id) on delete set null,
  access_token  text not null unique,
  ip            text,
  user_agent    text,
  bonus_points  int not null default 0,
  disqualified  boolean not null default false,
  beehiiv_status text,
  unique (giveaway_id, email)
);
create index on public.giveaway_entrants (giveaway_id, created_at desc);
create index on public.giveaway_entrants (referred_by);
create index on public.giveaway_entrants (giveaway_id, ip);

create table if not exists public.giveaway_completions (
  entrant_id  uuid not null references public.giveaway_entrants(id) on delete cascade,
  action_id   bigint not null references public.giveaway_actions(id) on delete cascade,
  points      int not null,
  created_at  timestamptz not null default now(),
  primary key (entrant_id, action_id)
);

-- Total points per entrant. Referrals only count from non-disqualified friends.
create or replace view public.giveaway_scores as
select
  e.id as entrant_id,
  e.giveaway_id,
  e.first_name,
  e.last_name,
  e.email,
  e.zip,
  e.ip,
  e.created_at,
  e.disqualified,
  e.bonus_points,
  e.referral_code,
  e.referred_by,
  coalesce(c.action_points, 0) as action_points,
  coalesce(r.referral_count, 0) as referral_count,
  coalesce(r.same_ip_referrals, 0) as same_ip_referrals,
  g.points_entry
    + coalesce(c.action_points, 0)
    + coalesce(r.referral_count, 0) * g.points_referral
    + e.bonus_points as total_points
from public.giveaway_entrants e
join public.giveaways g on g.id = e.giveaway_id
left join (
  select entrant_id, sum(points)::int as action_points
  from public.giveaway_completions group by entrant_id
) c on c.entrant_id = e.id
left join (
  select f.referred_by,
         count(*)::int as referral_count,
         count(*) filter (where f.ip is not null and f.ip = p.ip)::int as same_ip_referrals
  from public.giveaway_entrants f
  join public.giveaway_entrants p on p.id = f.referred_by
  where not f.disqualified
  group by f.referred_by
) r on r.referred_by = e.id;

alter table public.giveaways enable row level security;
alter table public.giveaway_actions enable row level security;
alter table public.giveaway_entrants enable row level security;
alter table public.giveaway_completions enable row level security;

-- Seed the first giveaway as a draft so admin can finish it.
insert into public.giveaways (slug, title, prize, prize_value, description, sponsor_name, sponsor_url, status, ends_at)
values (
  'dazzle-jazz-brunch',
  'Win Jazz Brunch for Six at Dazzle',
  '6 tickets to Jazz Brunch at Dazzle Denver',
  null,
  'Bring five friends to Sunday jazz brunch at Dazzle, on us. Enter below, then rack up bonus entries by following along and sharing your link. More points means more chances to win.',
  'Dazzle Denver',
  'https://dazzledenver.com/',
  'draft',
  null
) on conflict (slug) do nothing;

insert into public.giveaway_actions (giveaway_id, kind, label, url, points, sort)
select g.id, a.kind, a.label, a.url, a.points, a.sort
from public.giveaways g,
(values
  ('link', 'Follow Dazzle on Instagram', 'https://www.instagram.com/dazzle_denver/', 2, 10),
  ('link', 'Follow Dazzle on Facebook', 'https://www.facebook.com/DazzleDenver', 2, 15),
  ('link', 'Follow Real Good Denver on TikTok', 'https://www.tiktok.com/@realgooddenver', 2, 20),
  ('link', 'Follow the Real Good Denver podcast on Spotify', 'https://open.spotify.com/show/27VuIWVn2CfSGliuKNXkt7', 2, 30),
  ('link', 'Follow the Real Good Denver podcast on Apple Podcasts', 'https://podcasts.apple.com/us/podcast/real-good-denver/id602890961', 2, 40),
  ('link', 'Subscribe to Real Good Denver on YouTube', 'https://www.youtube.com/@RealGoodDenver', 2, 50)
) as a(kind, label, url, points, sort)
where g.slug = 'dazzle-jazz-brunch'
  and not exists (select 1 from public.giveaway_actions x where x.giveaway_id = g.id);
