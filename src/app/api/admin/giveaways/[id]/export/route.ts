import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getDb, getScores } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  // Guard against spreadsheet formula injection from user-entered names.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const id = Number(params.id);
  const { data: g } = await getDb().from("giveaways").select("slug").eq("id", id).maybeSingle();
  const scores = await getScores(id);
  const byId = new Map(scores.map((s) => [s.entrant_id, s]));
  const header = ["rank", "first_name", "last_name", "email", "zip", "total_points", "action_points", "referrals", "same_ip_referrals", "bonus_points", "referred_by_email", "disqualified", "ip", "entered_at"];
  let rank = 0;
  const lines = scores.map((s) => {
    if (!s.disqualified) rank++;
    return [
      s.disqualified ? "" : rank, s.first_name, s.last_name, s.email, s.zip, s.total_points, s.action_points, s.referral_count,
      s.same_ip_referrals, s.bonus_points, s.referred_by ? byId.get(s.referred_by)?.email ?? "" : "", s.disqualified, s.ip, s.created_at,
    ].map(csvCell).join(",");
  });
  return new NextResponse([header.join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="giveaway-${g?.slug ?? id}-entrants.csv"`,
    },
  });
}
