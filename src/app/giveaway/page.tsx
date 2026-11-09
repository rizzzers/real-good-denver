import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getCurrentGiveaway } from "@/lib/giveaways";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Giveaways",
  description: "Win free stuff from Denver's best local spots, courtesy of Real Good Denver.",
};

// /giveaway always points at the current giveaway, keeping any ?ref= referral code.
export default async function GiveawayIndex({ searchParams }: { searchParams: { ref?: string } }) {
  const g = await getCurrentGiveaway();
  if (g) {
    const ref = searchParams.ref ? `?ref=${encodeURIComponent(searchParams.ref)}` : "";
    redirect(`/giveaway/${g.slug}${ref}`);
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-36 text-center">
        <h1 className="mb-4 text-4xl font-bold">No giveaway running right now</h1>
        <p className="mb-8 text-muted-foreground">We run giveaways with our favorite Denver spots. Newsletter readers hear about them first.</p>
        <Link href="/newsletter" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">Get the newsletter</Link>
      </main>
      <Footer />
    </div>
  );
}
