import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getDb } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

// Update one entrant: { entrantId, disqualified?, bonus_points? }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  if ("disqualified" in body) update.disqualified = !!body.disqualified;
  if ("bonus_points" in body) update.bonus_points = Math.round(Number(body.bonus_points) || 0);
  const { error } = await getDb()
    .from("giveaway_entrants")
    .update(update)
    .eq("id", String(body.entrantId))
    .eq("giveaway_id", Number(params.id));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
