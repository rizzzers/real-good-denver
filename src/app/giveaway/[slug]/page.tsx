import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Gift, Share2, Sparkles, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ENTRANT_COOKIE,
  SITE_URL,
  getActions,
  getEntrantByToken,
  getGiveawayBySlug,
  getScores,
  isOpen,
  toLeaderboard,
  type Giveaway,
} from "@/lib/giveaways";
import EntryForm from "./EntryForm";
import SharingExplainer from "./SharingExplainer";
import ThankYou from "./ThankYou";
import { Countdown, Leaderboard } from "./shared";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string }; searchParams: { ref?: string } };

function isAdmin() {
  const s = cookies().get("admin_session")?.value;
  return !!s && s === process.env.ADMIN_SECRET;
}

async function load(slug: string): Promise<Giveaway | null> {
  const g = await getGiveawayBySlug(slug);
  if (!g) return null;
  if (g.status === "draft" && !isAdmin()) return null;
  return g;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getGiveawayBySlug(params.slug);
  if (!g || g.status === "draft") return { title: "Giveaway", robots: { index: false } };
  const description = g.description ?? `Enter to win ${g.prize}.`;
  const url = `${SITE_URL}/giveaway/${g.slug}`;
  const images = g.image_url ? [{ url: g.image_url, alt: g.title }] : [{ url: "/og-image.jpg", width: 1200, height: 630 }];
  return {
    title: g.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: g.title, description, url, images },
    twitter: { card: "summary_large_image", site: "@realgooddenver", title: g.title, description, images: images.map((i) => i.url) },
  };
}

export default async function GiveawayPage({ params, searchParams }: Props) {
  const g = await load(params.slug);
  if (!g) notFound();

  const [actions, scores, entrant] = await Promise.all([
    getActions(g.id),
    getScores(g.id),
    getEntrantByToken(g.id, cookies().get(`${ENTRANT_COOKIE}_${g.id}`)?.value),
  ]);
  const open = isOpen(g);
  const leaders = toLeaderboard(scores);
  const entrantCount = scores.filter((s) => !s.disqualified).length;
  const refCode = searchParams.ref?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) || null;
  const winner = g.winner_entrant_id ? scores.find((s) => s.entrant_id === g.winner_entrant_id) : null;

  const linkActions = actions.filter((a) => a.kind === "link");
  const codeActions = actions.filter((a) => a.kind === "code");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative overflow-hidden bg-foreground pb-16 pt-28 md:pb-20">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            {g.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={g.image_url}
                alt={g.title}
                width={1672}
                height={941}
                className="mb-8 w-full rounded-2xl border border-background/10 shadow-2xl"
              />
            )}
            {g.status === "draft" && (
              <div className="mb-4 inline-block rounded bg-yellow-400 px-3 py-1 text-xs font-bold text-black">DRAFT PREVIEW (admins only)</div>
            )}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/5 px-4 py-2 backdrop-blur-sm">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium tracking-wide text-background/70">
                Giveaway{g.sponsor_name ? ` with ${g.sponsor_name}` : ""}
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight text-background md:text-6xl">{g.title}</h1>
            {g.description && <p className="mb-8 max-w-xl text-lg text-background/60">{g.description}</p>}
            <div className="mb-8 rounded-xl border border-primary/30 bg-primary/10 p-4 text-background">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">The prize</div>
              <div className="mt-1 text-lg font-semibold">{g.prize}</div>
            </div>
            {open && g.ends_at && (
              <div className="mb-8">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Entries close in</div>
                <Countdown endsAt={g.ends_at} startsAt={g.starts_at} />
              </div>
            )}
            {entrantCount > 0 && (
              <p className="flex items-center gap-2 text-sm text-background/50">
                <Users className="h-4 w-4" /> {entrantCount.toLocaleString()} {entrantCount === 1 ? "person has" : "people have"} entered
              </p>
            )}
          </div>

          <div id="enter" className="scroll-mt-24">
            {winner ? (
              <div className="rounded-2xl border border-background/10 bg-background/5 p-8 text-background">
                <Sparkles className="mb-3 h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">We have a winner!</h2>
                <p className="mt-2 text-background/60">
                  Congrats to {winner.first_name} {winner.last_name.charAt(0)}. Thanks to everyone who entered. Stay tuned for the next giveaway in the newsletter.
                </p>
              </div>
            ) : !open ? (
              <div className="rounded-2xl border border-background/10 bg-background/5 p-8 text-background">
                <h2 className="text-2xl font-bold">{g.status === "ended" || (g.ends_at && new Date(g.ends_at) <= new Date()) ? "Entries are closed" : "Opening soon"}</h2>
                <p className="mt-2 text-background/60">Get the newsletter to hear about the next one first.</p>
                <Link href="/newsletter" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  Get the newsletter
                </Link>
              </div>
            ) : entrant ? (
              <div className="rounded-2xl border border-background/10 bg-background/5 p-8 text-background">
                <h2 className="text-2xl font-bold">You&apos;re in, {entrant.first_name}!</h2>
                <p className="mt-2 text-background/60">Earn more points by sharing your link and finishing bonus actions.</p>
                <Link href={`/giveaway/${g.slug}/me`} className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  Go to my dashboard
                </Link>
              </div>
            ) : (
              <EntryForm slug={g.slug} refCode={refCode} minAge={g.min_age} />
            )}
            {open && !winner && <SharingExplainer pointsReferral={g.points_referral} pointsEntry={g.points_entry} />}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_400px]">
        <div>
          <h2 className="mb-2 text-3xl font-bold">How to earn points</h2>
          <p className="mb-8 text-muted-foreground">More points, more chances. The winner is drawn at random, weighted by points.</p>
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <span className="flex items-center gap-3"><Gift className="h-5 w-5 text-primary" /> Enter the giveaway</span>
              <span className="font-semibold text-primary">+{g.points_entry.toLocaleString()}</span>
            </li>
            {/* Biggest opportunities first, right under the entry row. Referrals win ties. */}
            {[
              { key: "ref", label: "Each friend who enters with your link", points: g.points_referral, suffix: " each", share: true, rank: 0 },
              ...linkActions.map((a) => ({ key: `a${a.id}`, label: a.label, points: a.points, suffix: "", share: false, rank: 1 })),
              ...(codeActions.length
                ? [{ key: "codes", label: "Secret code words hidden in the newsletter and podcast", points: Math.max(...codeActions.map((a) => a.points)), suffix: " each", share: false, rank: 2 }]
                : []),
            ]
              .sort((a, b) => b.points - a.points || a.rank - b.rank)
              .map((r) => (
                <li key={r.key} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <span className="flex items-center gap-3">
                    {r.share ? <Share2 className="h-5 w-5 text-primary" /> : <Sparkles className="h-5 w-5 text-primary" />} {r.label}
                  </span>
                  <span className="whitespace-nowrap font-semibold text-primary">+{r.points.toLocaleString()}{r.suffix}</span>
                </li>
              ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            No purchase necessary. Open to US residents {g.min_age}+. See the <Link href={`/giveaway/${g.slug}/rules`} className="underline">official rules</Link>.
          </p>
        </div>
        <Leaderboard rows={leaders} />
      </section>

      <ThankYou sponsorName={g.sponsor_name} slug={g.slug} entered={!!entrant} open={open && !winner} />

      <Footer />
    </div>
  );
}
