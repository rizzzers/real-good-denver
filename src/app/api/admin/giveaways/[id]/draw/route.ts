import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getDb, getScores } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

// Weighted random draw: each point is one ticket. Disqualified entrants and
// anyone in body.exclude (e.g. a winner who didn't respond) are skipped.
// body: { exclude?: string[] } or { clear: true } to remove the winner.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const id = Number(params.id);
  const body = await req.json().catch(() => ({}));
  const db = getDb();

  if (body.clear) {
    await db.from("giveaways").update({ winner_entrant_id: null, winner_drawn_at: null }).eq("id", id);
    return NextResponse.json({ success: true });
  }

  const exclude = new Set<string>(Array.isArray(body.exclude) ? body.exclude : []);
  const pool = (await getScores(id)).filter((s) => !s.disqualified && !exclude.has(s.entrant_id) && s.total_points > 0);
  const tickets = pool.reduce((n, s) => n + s.total_points, 0);
  if (!tickets) return NextResponse.json({ error: "No eligible entrants." }, { status: 400 });

  let pick = randomInt(tickets);
  const winner = pool.find((s) => (pick -= s.total_points) < 0)!;

  await db.from("giveaways").update({ winner_entrant_id: winner.entrant_id, winner_drawn_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({
    winner: { id: winner.entrant_id, name: `${winner.first_name} ${winner.last_name}`, email: winner.email, points: winner.total_points },
    odds: `${winner.total_points} of ${tickets} tickets (${((winner.total_points / tickets) * 100).toFixed(2)}%)`,
    pool: pool.length,
  });
}
