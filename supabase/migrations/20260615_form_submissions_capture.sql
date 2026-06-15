-- Durable capture for all website form submissions.
-- Non-destructive: ensures the tables and the columns the edge functions write
-- to exist, without dropping or altering existing data.
--
-- Background: the edge functions previously only emailed submissions (and the
-- email was sent from Resend's sandbox sender, so it never delivered). Nothing
-- was ever persisted. These tables are the new source of truth.

-- ---------------------------------------------------------------------------
-- form_submissions: one row per submission for every form type.
-- `data` holds the complete raw payload so no field is ever lost, regardless
-- of form type. The top-level columns are for quick scanning / filtering.
-- ---------------------------------------------------------------------------
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.form_submissions add column if not exists type    text;
alter table public.form_submissions add column if not exists name    text;
alter table public.form_submissions add column if not exists email   text;
alter table public.form_submissions add column if not exists phone   text;
alter table public.form_submissions add column if not exists company text;
alter table public.form_submissions add column if not exists message text;
alter table public.form_submissions add column if not exists source  text;
alter table public.form_submissions add column if not exists data    jsonb;

create index if not exists form_submissions_created_at_idx on public.form_submissions (created_at desc);
create index if not exists form_submissions_type_idx       on public.form_submissions (type);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers: the mailing list (deduped by email).
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers add column if not exists name   text;
alter table public.newsletter_subscribers add column if not exists email  text;
alter table public.newsletter_subscribers add column if not exists source text;

-- Dedupe by lower(email) so the same address can't subscribe twice.
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- ---------------------------------------------------------------------------
-- RLS: keep these tables private. The edge functions write with the
-- service-role key, which bypasses RLS. No anon/public policies are added,
-- so the data is not readable from the browser. View rows in the Supabase
-- dashboard or via a service-role query.
-- ---------------------------------------------------------------------------
alter table public.form_submissions     enable row level security;
alter table public.newsletter_subscribers enable row level security;
