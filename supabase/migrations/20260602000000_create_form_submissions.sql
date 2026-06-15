create table if not exists public.form_submissions (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  type        text not null,
  name        text,
  email       text,
  subject     text,
  body        jsonb,
  email_sent  boolean not null default false
);

-- Index for querying by type and date
create index on public.form_submissions (type, created_at desc);
create index on public.form_submissions (email);

-- Only service role can read/write (no public access)
alter table public.form_submissions enable row level security;
