import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { defaultRules, getGiveawayBySlug } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const g = await getGiveawayBySlug(params.slug);
  return { title: g ? `Official Rules: ${g.title}` : "Official Rules", robots: { index: false } };
}

export default async function RulesPage({ params }: { params: { slug: string } }) {
  const g = await getGiveawayBySlug(params.slug);
  if (!g) notFound();
  const rules = g.rules?.trim() || defaultRules(g);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        {g.image_url && (
          <Link href={`/giveaway/${g.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image_url} alt={g.title} width={1672} height={941} className="mb-8 w-full rounded-2xl border border-border shadow-sm" />
          </Link>
        )}
        <Link href={`/giveaway/${g.slug}`} className="text-sm text-primary hover:underline">Back to the giveaway</Link>
        <h1 className="mb-2 mt-4 text-4xl font-bold">Official Rules</h1>
        <p className="mb-10 text-muted-foreground">{g.title}</p>
        <div className="space-y-4 whitespace-pre-line leading-relaxed text-foreground/90">
          {rules.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
