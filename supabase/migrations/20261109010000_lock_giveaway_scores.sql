-- Views run as their owner by default, which bypasses RLS on the underlying
-- tables. giveaway_scores exposes entrant emails and IPs, so make it run as the
-- caller (RLS applies) and remove public grants. The service role still reads it.
alter view public.giveaway_scores set (security_invoker = true);
revoke all on public.giveaway_scores from anon, authenticated;
revoke all on public.giveaways, public.giveaway_actions, public.giveaway_entrants, public.giveaway_completions from anon, authenticated;
