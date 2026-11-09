import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ENTRANT_COOKIE,
  getActions,
  getDb,
  getEntrantByToken,
  getGiveawayBySlug,
  getScores,
  isOpen,
  rankOf,
  referralUrl,
  toLeaderboard,
} from "@/lib/giveaways";
import EntrantDashboard from "./EntrantDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Giveaway Dashboard", robots: { index: false, follow: false } };

export default async function MePage({ params }: { params: { slug: string } }) {
  const g = await getGiveawayBySlug(params.slug);
  if (!g) notFound();

  const entrant = await getEntrantByToken(g.id, cookies().get(`${ENTRANT_COOKIE}_${g.id}`)?.value);
  if (!entrant) redirect(`/giveaway/${g.slug}`);

  const [actions, scores, { data: done }] = await Promise.all([
    getActions(g.id),
    getScores(g.id),
    getDb().from("giveaway_completions").select("action_id").eq("entrant_id", entrant.id),
  ]);
  const me = scores.find((s) => s.entrant_id === entrant.id);
  const doneIds = new Set((done ?? []).map((d) => d.action_id as number));
  const codeActions = actions.filter((a) => a.kind === "code");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EntrantDashboard
        slug={g.slug}
        title={g.title}
        prize={g.prize}
        open={isOpen(g)}
        firstName={entrant.first_name}
        points={me?.total_points ?? g.points_entry}
        rank={rankOf(scores, entrant.id)}
        totalEntrants={scores.filter((s) => !s.disqualified).length}
        referralCount={me?.referral_count ?? 0}
        pointsReferral={g.points_referral}
        shareUrl={referralUrl(g.slug, entrant.referral_code)}
        linkActions={actions
          .filter((a) => a.kind === "link")
          .map((a) => ({ id: a.id, label: a.label, url: a.url ?? "#", points: a.points, done: doneIds.has(a.id) }))}
        codes={{
          total: codeActions.length,
          found: codeActions.filter((a) => doneIds.has(a.id)).length,
          points: codeActions.length ? Math.max(...codeActions.map((a) => a.points)) : 0,
        }}
        leaders={toLeaderboard(scores, 10)}
      />
      <Footer />
    </div>
  );
}
