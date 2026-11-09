import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

// Server-only helpers for the giveaway system. Never import from client components.

export const SITE_URL = "https://realgooddenver.com";
export const ENTRANT_COOKIE = "rgd_giveaway";

export function getDb() {
  return createClient(
    "https://xrpbjtdbwuodfixgpapx.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export interface Giveaway {
  id: number;
  created_at: string;
  slug: string;
  title: string;
  prize: string;
  prize_value: string | null;
  description: string | null;
  sponsor_name: string | null;
  sponsor_url: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: "draft" | "active" | "ended";
  points_entry: number;
  points_referral: number;
  min_age: number;
  rules: string | null;
  winner_entrant_id: string | null;
  winner_drawn_at: string | null;
}

export interface GiveawayAction {
  id: number;
  giveaway_id: number;
  kind: "link" | "code";
  label: string;
  url: string | null;
  code: string | null;
  points: number;
  sort: number;
  active: boolean;
}

export interface EntrantScore {
  entrant_id: string;
  giveaway_id: number;
  first_name: string;
  last_name: string;
  email: string;
  zip: string;
  ip: string | null;
  created_at: string;
  disqualified: boolean;
  bonus_points: number;
  referral_code: string;
  referred_by: string | null;
  action_points: number;
  referral_count: number;
  same_ip_referrals: number;
  total_points: number;
}

export interface LeaderRow {
  rank: number;
  name: string;
  points: number;
}

/** Whether entries are currently accepted. */
export function isOpen(g: Giveaway, now = new Date()): boolean {
  if (g.status !== "active") return false;
  if (g.starts_at && new Date(g.starts_at) > now) return false;
  if (g.ends_at && new Date(g.ends_at) <= now) return false;
  return true;
}

export function displayName(first: string, last: string): string {
  const f = first.trim().split(/\s+/)[0] || "Someone";
  const l = last.trim().charAt(0).toUpperCase();
  return l ? `${f} ${l}.` : f;
}

export function newToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

// Readable referral codes: no 0/O/1/I/L confusion.
const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export function newReferralCode(len = 7): string {
  const buf = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  return out;
}

export async function getGiveawayBySlug(slug: string): Promise<Giveaway | null> {
  const { data } = await getDb().from("giveaways").select("*").eq("slug", slug).maybeSingle();
  return (data as Giveaway) ?? null;
}

export async function getCurrentGiveaway(): Promise<Giveaway | null> {
  const db = getDb();
  const { data: active } = await db
    .from("giveaways")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);
  if (active && active.length) return active[0] as Giveaway;
  const { data: ended } = await db
    .from("giveaways")
    .select("*")
    .eq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1);
  return (ended?.[0] as Giveaway) ?? null;
}

export async function getActions(giveawayId: number, includeInactive = false): Promise<GiveawayAction[]> {
  let q = getDb().from("giveaway_actions").select("*").eq("giveaway_id", giveawayId);
  if (!includeInactive) q = q.eq("active", true);
  const { data } = await q.order("sort").order("id");
  return (data as GiveawayAction[]) ?? [];
}

/** All scores for a giveaway, highest first. Ties go to the earlier entrant. */
export async function getScores(giveawayId: number): Promise<EntrantScore[]> {
  const db = getDb();
  const rows: EntrantScore[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await db
      .from("giveaway_scores")
      .select("*")
      .eq("giveaway_id", giveawayId)
      .order("total_points", { ascending: false })
      .order("created_at", { ascending: true })
      .range(from, from + page - 1);
    if (error) throw error;
    rows.push(...((data as EntrantScore[]) ?? []));
    if (!data || data.length < page) break;
  }
  return rows;
}

export function toLeaderboard(scores: EntrantScore[], limit = 25): LeaderRow[] {
  return scores
    .filter((s) => !s.disqualified)
    .slice(0, limit)
    .map((s, i) => ({ rank: i + 1, name: displayName(s.first_name, s.last_name), points: s.total_points }));
}

export function rankOf(scores: EntrantScore[], entrantId: string): number | null {
  const eligible = scores.filter((s) => !s.disqualified);
  const idx = eligible.findIndex((s) => s.entrant_id === entrantId);
  return idx === -1 ? null : idx + 1;
}

export function clientIp(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip");
}

/** Subscribe to the RGD Beehiiv publication. Returns a short status string, never throws. */
export async function subscribeToBeehiiv(email: string, firstName: string, lastName: string, giveawaySlug: string): Promise<string> {
  const pub = process.env.BEEHIIV_PUB_RGD;
  const key = process.env.BEEHIIV_KEY_RGD;
  if (!pub || !key) return "skipped:no-config";
  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "giveaway",
        utm_medium: "website",
        utm_campaign: giveawaySlug,
        referring_site: `${SITE_URL}/giveaway/${giveawaySlug}`,
        custom_fields: [
          { name: "First Name", value: firstName },
          { name: "Last Name", value: lastName },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Beehiiv subscribe failed", res.status, await res.text().catch(() => ""));
      return `error:${res.status}`;
    }
    return "subscribed";
  } catch (err) {
    console.error("Beehiiv subscribe error", err);
    return "error:network";
  }
}

export function dashboardUrl(token: string): string {
  return `${SITE_URL}/api/giveaway/access?t=${encodeURIComponent(token)}`;
}

/** Look up the signed-in entrant for a giveaway from the entrant cookie value. */
export async function getEntrantByToken(giveawayId: number, token: string | undefined) {
  if (!token) return null;
  const { data } = await getDb()
    .from("giveaway_entrants")
    .select("id, first_name, last_name, email, referral_code, disqualified")
    .eq("giveaway_id", giveawayId)
    .eq("access_token", token)
    .maybeSingle();
  return data as { id: string; first_name: string; last_name: string; email: string; referral_code: string; disqualified: boolean } | null;
}

export function referralUrl(slug: string, code: string): string {
  return `${SITE_URL}/giveaway/${slug}?ref=${code}`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Default official rules, used when a giveaway has no custom rules text. */
export function defaultRules(g: Giveaway): string {
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString("en-US", { timeZone: "America/Denver", dateStyle: "long", timeStyle: "short" }) + " MT" : "a date announced on the giveaway page";
  return `NO PURCHASE NECESSARY TO ENTER OR WIN. A purchase will not increase your chances of winning.

1. Sponsor. This giveaway is run by Real Good Denver ("RGD")${g.sponsor_name ? `, with the prize provided by ${g.sponsor_name}` : ""}. ${g.sponsor_name ? `${g.sponsor_name} is` : "Prize providers are"} not responsible for administering this giveaway.

2. Eligibility. Open to legal residents of the United States who are ${g.min_age} years of age or older at the time of entry. Employees of RGD${g.sponsor_name ? ` and ${g.sponsor_name}` : ""}, and their immediate family members, are not eligible. Void where prohibited.

3. Entry Period. The giveaway begins ${fmt(g.starts_at)} and ends ${fmt(g.ends_at)}.

4. How to Enter. Complete the entry form at realgooddenver.com/giveaway with your first name, last name, email address, and ZIP code. Each valid entry receives ${g.points_entry} point${g.points_entry === 1 ? "" : "s"}. Limit one entry per person and per email address. By entering, you agree to receive the Real Good Denver email newsletter. You may unsubscribe at any time.

5. Bonus Points. After entering, you may earn additional points by completing optional bonus actions listed on your entry dashboard, and by sharing your personal referral link. You receive ${g.points_referral} points for each eligible person who enters using your link. Bonus actions are optional and are never required to win.

6. Winner Selection. One winner will be selected in a random drawing from all eligible entries after the entry period ends. Each point equals one chance in the drawing, so more points means more chances to win. The odds of winning depend on the number of eligible entries and points received.

7. Prize. ${g.prize}${g.prize_value ? ` (approximate retail value: ${g.prize_value})` : ""}. The prize is non-transferable and no cash or substitution is offered, except at the discretion of RGD or the prize provider. Any taxes are the responsibility of the winner. Prize is subject to the provider's availability and terms.

8. Notification. The winner will be notified by email within 7 days of the drawing and must respond within 7 days, or an alternate winner may be selected.

9. Disqualification. RGD may disqualify any entry, and remove any points, it believes were obtained through fake or duplicate accounts, automated means, or any other abuse of the giveaway.

10. Privacy. Information collected is used to run the giveaway and to send the Real Good Denver newsletter. Winner's first name and last initial may be shown publicly. See realgooddenver.com/terms-and-privacy.

11. General. This giveaway is in no way sponsored, endorsed, or administered by, or associated with, Instagram, TikTok, Facebook, Spotify, Apple, or YouTube. RGD reserves the right to modify or cancel the giveaway if it cannot be run as planned.`;
}
