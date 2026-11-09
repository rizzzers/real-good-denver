import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getActions, getDb, getScores } from "@/lib/giveaways";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

const EDITABLE = [
  "slug", "title", "prize", "prize_value", "description", "sponsor_name", "sponsor_url", "image_url",
  "starts_at", "ends_at", "status", "points_entry", "points_referral", "min_age", "rules",
] as const;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const id = Number(params.id);
  const { data: giveaway } = await getDb().from("giveaways").select("*").eq("id", id).maybeSingle();
  if (!giveaway) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [actions, scores] = await Promise.all([getActions(id, true), getScores(id)]);
  return NextResponse.json({ giveaway, actions, scores });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  for (const k of EDITABLE) {
    if (!(k in body)) continue;
    let v = body[k];
    if (typeof v === "string") v = v.replace(/\u2014/g, ",").trim();
    if (v === "") v = null;
    if (k === "slug" && typeof v === "string") v = slugify(v);
    if (["points_entry", "points_referral", "min_age"].includes(k)) v = Math.max(0, Math.round(Number(v) || 0));
    if (k === "status" && !["draft", "active", "ended"].includes(String(v))) continue;
    update[k] = v;
  }
  if (!update.title && "title" in update) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const { error } = await getDb().from("giveaways").update(update).eq("id", Number(params.id));
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is taken." : error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
