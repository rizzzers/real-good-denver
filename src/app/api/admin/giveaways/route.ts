import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getDb } from "@/lib/giveaways";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const db = getDb();
  const { data: giveaways, error } = await db.from("giveaways").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const counts: Record<number, number> = {};
  await Promise.all(
    (giveaways ?? []).map(async (g) => {
      const { count } = await db.from("giveaway_entrants").select("id", { count: "exact", head: true }).eq("giveaway_id", g.id);
      counts[g.id] = count ?? 0;
    })
  );
  return NextResponse.json((giveaways ?? []).map((g) => ({ ...g, entrant_count: counts[g.id] })));
}

export async function POST(req: NextRequest) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const prize = String(body.prize ?? "").trim();
  if (!title || !prize) return NextResponse.json({ error: "Title and prize are required." }, { status: 400 });
  const slug = slugify(String(body.slug || title));
  const { data, error } = await getDb().from("giveaways").insert({ title, prize, slug }).select("id").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is taken." : error.message }, { status: 400 });
  return NextResponse.json(data);
}
