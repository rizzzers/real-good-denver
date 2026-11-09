import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getDb } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

function clean(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if ("kind" in body) out.kind = body.kind === "code" ? "code" : "link";
  if ("label" in body) out.label = String(body.label ?? "").replace(/\u2014/g, ",").trim();
  if ("url" in body) out.url = String(body.url ?? "").trim() || null;
  if ("code" in body) out.code = String(body.code ?? "").trim() || null;
  if ("points" in body) out.points = Math.max(0, Math.round(Number(body.points) || 0));
  if ("sort" in body) out.sort = Math.round(Number(body.sort) || 0);
  if ("active" in body) out.active = !!body.active;
  return out;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const row = clean(await req.json().catch(() => ({})));
  if (!row.label) return NextResponse.json({ error: "Label is required." }, { status: 400 });
  if (row.kind === "code" && !row.code) return NextResponse.json({ error: "Code word is required." }, { status: 400 });
  if (row.kind !== "code" && !row.url) return NextResponse.json({ error: "URL is required." }, { status: 400 });
  const { error } = await getDb().from("giveaway_actions").insert({ ...row, giveaway_id: Number(params.id) });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const { error } = await getDb()
    .from("giveaway_actions")
    .update(clean(body))
    .eq("id", Number(body.id))
    .eq("giveaway_id", Number(params.id));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

// Deleting an action also removes the points people earned from it, so the UI asks
// admins to deactivate instead when it already has completions.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = checkAdminAuth();
  if (unauth) return unauth;
  const actionId = Number(req.nextUrl.searchParams.get("actionId"));
  const { error } = await getDb().from("giveaway_actions").delete().eq("id", actionId).eq("giveaway_id", Number(params.id));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
