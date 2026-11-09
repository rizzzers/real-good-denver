import Link from "next/link";
import { Heart, Music2 } from "lucide-react";

// Closing thank-you band over the Denver brunch illustration.
// Subtle motion: slow background drift and a few drifting music notes.

const NOTES = [
  { left: "12%", bottom: "18%", delay: "0s", size: 22 },
  { left: "24%", bottom: "8%", delay: "2.5s", size: 16 },
  { left: "78%", bottom: "14%", delay: "1.2s", size: 20 },
  { left: "88%", bottom: "30%", delay: "3.6s", size: 14 },
];

export default function ThankYou({
  sponsorName,
  slug,
  entered,
  open,
}: {
  sponsorName: string | null;
  slug: string;
  entered: boolean;
  open: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <style>{`
        @keyframes rgd-drift { 0%,100% { transform: scale(1.06) translate(0,0) } 50% { transform: scale(1.12) translate(-1.5%,-1%) } }
        @keyframes rgd-note { 0% { transform: translateY(0) rotate(-8deg); opacity: 0 } 15% { opacity: .9 } 100% { transform: translateY(-140px) rotate(12deg); opacity: 0 } }
        @keyframes rgd-heart { 0%,100% { transform: scale(1) } 50% { transform: scale(1.18) } }
        .rgd-drift { animation: rgd-drift 28s ease-in-out infinite }
        .rgd-note { animation: rgd-note 6s ease-out infinite both }
        .rgd-heart { animation: rgd-heart 1.6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .rgd-drift, .rgd-heart { animation: none !important }
          .rgd-note { display: none }
        }
      `}</style>

      <div
        className="rgd-drift absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/giveaways/denver-brunch-bg.jpg)" }}
        aria-hidden="true"
      />
      {/* Keep the scene visible up top, darken behind the text */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10" aria-hidden="true" />

      {NOTES.map((n, i) => (
        <Music2
          key={i}
          className="rgd-note absolute text-amber-200/80 drop-shadow"
          style={{ left: n.left, bottom: n.bottom, width: n.size, height: n.size, animationDelay: n.delay }}
          aria-hidden="true"
        />
      ))}

      <div className="mx-auto flex min-h-[520px] max-w-3xl flex-col items-center justify-end px-6 pb-16 pt-40 text-center text-white md:min-h-[600px]">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm backdrop-blur-sm">
          <Heart className="rgd-heart h-4 w-4 fill-rose-400 text-rose-400" />
          From all of us at Real Good Denver
        </div>
        <h2 className="text-4xl font-bold leading-tight tracking-tight drop-shadow-lg md:text-6xl">
          Thanks for brunching with us.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/85 drop-shadow">
          Real Good Denver runs on locals who show up, share the good stuff, and cheer on the spots that make this city great.
          {sponsorName ? ` Huge thanks to ${sponsorName} for the jazz, the eggs benny, and the six seats.` : ""} Good luck, and save us a mimosa.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {open &&
            (entered ? (
              <Link href={`/giveaway/${slug}/me`} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]">
                Share my link
              </Link>
            ) : (
              <a href="#enter" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]">
                Enter the giveaway
              </a>
            ))}
          <Link href="/newsletter" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            Read the newsletter
          </Link>
        </div>
      </div>
    </section>
  );
}
