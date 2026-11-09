import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ENTRANT_COOKIE,
  clientIp,
  dashboardUrl,
  escapeHtml,
  getDb,
  getGiveawayBySlug,
  isOpen,
  newReferralCode,
  newToken,
  referralUrl,
  subscribeToBeehiiv,
  type Giveaway,
} from "@/lib/giveaways";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_ENTRIES_PER_IP_PER_HOUR = 6;

async function sendDashboardEmail(g: Giveaway, to: string, firstName: string, token: string, code: string, returning: boolean) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dash = dashboardUrl(token);
  const share = referralUrl(g.slug, code);
  const intro = returning
    ? "You're already entered. Here is your private link to check your points and share again."
    : `You're entered to win ${escapeHtml(g.prize)}.`;
  try {
    await resend.emails.send({
      from: "Real Good Denver <noreply@ryanestes.info>",
      to: [to],
      subject: returning ? `Your link: ${g.title}` : `You're in: ${g.title}`,
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#111">
          <p>Hey ${escapeHtml(firstName)},</p>
          <p>${intro}</p>
          <p>Every point is another chance in the drawing. Share your link and get <strong>${g.points_referral} points</strong> for every friend who enters:</p>
          <p style="background:#f4f4f5;padding:12px;border-radius:8px;font-family:monospace;word-break:break-all">${share}</p>
          <p><a href="${dash}" style="display:inline-block;background:#1a6dff;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Open my giveaway dashboard</a></p>
          <p style="font-size:13px;color:#666">Keep this email. The button above is your private link to your points and bonus entries. Don't share it; share the link in the gray box instead.</p>
          <p style="font-size:13px;color:#666">Real Good Denver</p>
        </div>`,
    });
  } catch (err) {
    console.error("Giveaway email failed", err);
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  const slug = String(body.slug ?? "");
  const firstName = String(body.firstName ?? "").trim().slice(0, 60);
  const lastName = String(body.lastName ?? "").trim().slice(0, 60);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const zip = String(body.zip ?? "").trim();
  const ref = String(body.ref ?? "").trim().toLowerCase().slice(0, 20);

  if (!firstName || !lastName) return NextResponse.json({ error: "Please enter your first and last name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!/^\d{5}$/.test(zip)) return NextResponse.json({ error: "Please enter a 5-digit ZIP code." }, { status: 400 });
  if (body.ageConfirmed !== true) return NextResponse.json({ error: "You must confirm you meet the age requirement." }, { status: 400 });

  const g = await getGiveawayBySlug(slug);
  if (!g || !isOpen(g)) return NextResponse.json({ error: "This giveaway isn't accepting entries right now." }, { status: 400 });

  const db = getDb();
  const ip = clientIp(req.headers);

  const { data: existing } = await db
    .from("giveaway_entrants")
    .select("id, first_name, access_token, referral_code")
    .eq("giveaway_id", g.id)
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    // Don't log them in from the form (anyone could type their email). Email the link instead.
    await sendDashboardEmail(g, email, existing.first_name, existing.access_token, existing.referral_code, true);
    return NextResponse.json({
      status: "exists",
      message: "You're already entered! We just emailed you a link to your dashboard.",
    });
  }

  if (ip) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await db
      .from("giveaway_entrants")
      .select("id", { count: "exact", head: true })
      .eq("giveaway_id", g.id)
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_ENTRIES_PER_IP_PER_HOUR) {
      return NextResponse.json({ error: "Too many entries from this network. Please try again later." }, { status: 429 });
    }
  }

  let referredBy: string | null = null;
  if (ref) {
    const { data: referrer } = await db
      .from("giveaway_entrants")
      .select("id")
      .eq("giveaway_id", g.id)
      .eq("referral_code", ref)
      .maybeSingle();
    referredBy = referrer?.id ?? null;
  }

  const accessToken = newToken();
  let entrant: { id: string; referral_code: string } | null = null;
  for (let attempt = 0; attempt < 4 && !entrant; attempt++) {
    const { data, error } = await db
      .from("giveaway_entrants")
      .insert({
        giveaway_id: g.id,
        email,
        first_name: firstName,
        last_name: lastName,
        zip,
        referral_code: newReferralCode(),
        referred_by: referredBy,
        access_token: accessToken,
        ip,
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      })
      .select("id, referral_code")
      .single();
    if (!error) {
      entrant = data;
    } else if (error.code === "23505" && error.message.includes("giveaway_id")) {
      // Same email raced in twice.
      return NextResponse.json({ status: "exists", message: "You're already entered! Check your email for your dashboard link." });
    } else if (error.code !== "23505") {
      console.error("Giveaway insert failed", error);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }
  if (!entrant) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });

  const [beehiiv] = await Promise.all([
    subscribeToBeehiiv(email, firstName, lastName, g.slug),
    sendDashboardEmail(g, email, firstName, accessToken, entrant.referral_code, false),
  ]);
  await db.from("giveaway_entrants").update({ beehiiv_status: beehiiv }).eq("id", entrant.id);

  const res = NextResponse.json({ status: "entered", redirect: `/giveaway/${g.slug}/me` });
  res.cookies.set(`${ENTRANT_COOKIE}_${g.id}`, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
