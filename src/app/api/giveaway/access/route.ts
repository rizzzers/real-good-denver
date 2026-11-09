import { NextRequest, NextResponse } from "next/server";
import { ENTRANT_COOKIE, getDb } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

// Magic link from the entry email: sets the entrant cookie, then sends them to their dashboard.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t") ?? "";
  const base = new URL("/giveaway", req.url);
  if (!token) return NextResponse.redirect(base);

  const { data: entrant } = await getDb()
    .from("giveaway_entrants")
    .select("giveaway_id, giveaways(slug)")
    .eq("access_token", token)
    .maybeSingle();
  if (!entrant) return NextResponse.redirect(base);

  const slug = (entrant.giveaways as unknown as { slug: string }).slug;
  const res = NextResponse.redirect(new URL(`/giveaway/${slug}/me`, req.url));
  res.cookies.set(`${ENTRANT_COOKIE}_${entrant.giveaway_id}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
