import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ENTRANT_COOKIE, getActions, getDb, getEntrantByToken, getGiveawayBySlug, isOpen } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

// Records a bonus action for the signed-in entrant.
// body: { slug, actionId } for link actions, or { slug, code } for code words.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const g = await getGiveawayBySlug(String(body.slug ?? ""));
  if (!g) return NextResponse.json({ error: "Giveaway not found." }, { status: 404 });
  if (!isOpen(g)) return NextResponse.json({ error: "This giveaway has closed." }, { status: 400 });

  const entrant = await getEntrantByToken(g.id, cookies().get(`${ENTRANT_COOKIE}_${g.id}`)?.value);
  if (!entrant) return NextResponse.json({ error: "Please enter the giveaway first." }, { status: 401 });

  const actions = await getActions(g.id);
  let action;
  if (body.code !== undefined) {
    const guess = String(body.code).trim().toLowerCase();
    action = actions.find((a) => a.kind === "code" && a.code && a.code.trim().toLowerCase() === guess);
    if (!guess || !action) return NextResponse.json({ error: "That code word isn't right. Try again." }, { status: 400 });
  } else {
    action = actions.find((a) => a.kind === "link" && a.id === Number(body.actionId));
    if (!action) return NextResponse.json({ error: "Action not found." }, { status: 404 });
  }

  const { error } = await getDb()
    .from("giveaway_completions")
    .insert({ entrant_id: entrant.id, action_id: action.id, points: action.points });

  if (error && error.code === "23505") {
    return NextResponse.json({ status: "already", actionId: action.id, points: 0, message: "Already counted." });
  }
  if (error) {
    console.error("Giveaway completion failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ status: "ok", actionId: action.id, points: action.points });
}
