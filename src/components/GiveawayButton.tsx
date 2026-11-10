"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

export const GIVEAWAY_HREF = "/giveaway/dazzle-brunch";
// Drawing closes Dec 16 2026; the floating button hides itself after this.
const GIVEAWAY_ENDS_AT = Date.parse("2026-12-16T18:13:00Z");
const DISMISS_KEY = "rgd-giveaway-dazzle-dismissed";

/** The playful Dazzle brunch giveaway button. `compact` shrinks it for the floating version. */
export function GiveawayButton({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <>
      <Link
        href={GIVEAWAY_HREF}
        className={`giveaway-btn group relative flex w-full items-center rounded-[1.75rem] text-gray-900 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] active:scale-[0.97] ${
          compact ? "max-w-sm gap-3 px-4 py-3" : "max-w-md gap-4 px-5 py-4"
        } ${className}`}
        style={{
          transform: "rotate(-1.5deg)",
          background: "linear-gradient(120deg, #fde047 0%, #fbbf24 35%, #fb923c 70%, #f472b6 100%)",
          backgroundSize: "200% 200%",
          animation: "giveawayShimmer 6s ease-in-out infinite",
          boxShadow: "0 6px 0 #9a3412, 0 14px 36px rgba(251,146,60,0.5)",
        }}
      >
        {/* Dashed ticket edge */}
        <span aria-hidden className="pointer-events-none absolute inset-1.5 rounded-[1.4rem] border-2 border-dashed border-white/70" />

        {/* Floating music notes */}
        <span aria-hidden className="giveaway-note absolute left-6 -top-1 text-xl text-amber-200" style={{ animationDelay: "0s" }}>♪</span>
        <span aria-hidden className="giveaway-note absolute left-12 -top-1 text-2xl text-pink-300" style={{ animationDelay: "1.1s" }}>♫</span>
        <span aria-hidden className="giveaway-note absolute left-3 -top-1 text-lg text-yellow-200" style={{ animationDelay: "2.2s" }}>♩</span>

        {/* Sparkles */}
        <span aria-hidden className="giveaway-sparkle absolute -right-2 -bottom-2 text-xl" style={{ animationDelay: "0.4s" }}>✨</span>
        <span aria-hidden className="giveaway-sparkle absolute right-24 -bottom-3 text-sm" style={{ animationDelay: "1.6s" }}>⭐</span>

        {/* "6 seats" sticker */}
        <span
          aria-hidden
          className="absolute -top-4 -right-3 rotate-12 rounded-full bg-blue-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg ring-2 ring-white transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
        >
          6 seats!
        </span>

        <span className={`giveaway-sax relative leading-none drop-shadow-sm ${compact ? "text-3xl" : "text-4xl sm:text-5xl"}`} aria-hidden>
          🎷
        </span>
        <span className="relative flex-1 min-w-0">
          <span className="block text-[11px] font-black uppercase tracking-widest text-orange-900/70">Psst… free brunch, on us</span>
          <span className={`block font-black leading-tight ${compact ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
            Win Jazz Brunch at Dazzle for you + 5 friends 🥞
          </span>
        </span>
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-full bg-gray-900 text-amber-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[-12deg] ${
            compact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          <ArrowRight className={compact ? "w-4 h-4" : "w-5 h-5"} />
        </span>
      </Link>

      <style>{`
        @keyframes giveawayShimmer {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes giveawayNote {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.6); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translate(14px, -46px) rotate(20deg) scale(1.1); }
        }
        @keyframes giveawaySax {
          0%, 100% { transform: rotate(-8deg); }
          50%      { transform: rotate(10deg) translateY(-2px); }
        }
        @keyframes giveawaySparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
          50%      { opacity: 1; transform: scale(1.15) rotate(25deg); }
        }
        @keyframes giveawayPopIn {
          0%   { opacity: 0; transform: translateY(40px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .giveaway-note { animation: giveawayNote 3.3s ease-out infinite; opacity: 0; }
        .giveaway-sax { display: inline-block; animation: giveawaySax 1.6s ease-in-out infinite; transform-origin: 60% 80%; }
        .giveaway-btn:hover .giveaway-sax { animation-duration: 0.5s; }
        .giveaway-sparkle { animation: giveawaySparkle 2.2s ease-in-out infinite; }
        .giveaway-btn:hover { transform: rotate(0deg) scale(1.04) !important; }
        .giveaway-float { animation: giveawayPopIn 0.6s cubic-bezier(.34,1.56,.64,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .giveaway-btn, .giveaway-note, .giveaway-sax, .giveaway-sparkle, .giveaway-float { animation: none !important; }
          .giveaway-note { opacity: 0.8; }
        }
      `}</style>
    </>
  );
}

/**
 * Site-wide floating version, mounted in the root layout. Hidden on the homepage
 * (the hero already has the big one), on giveaway pages, and in admin.
 * Visitors can close it for the rest of their session.
 */
export function GiveawayFloater() {
  const pathname = usePathname() ?? "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {}
    if (dismissed || Date.now() > GIVEAWAY_ENDS_AT) return;
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const hidden =
    pathname === "/" ||
    pathname.startsWith("/giveaway") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sponsor-onboarding");

  if (!show || hidden) return null;

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div className="giveaway-float fixed bottom-4 left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-6 sm:bottom-6 sm:block sm:w-96">
      <div className="relative w-full max-w-sm">
        <GiveawayButton compact />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide giveaway"
          className="absolute -top-3 -left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg ring-2 ring-white transition-transform hover:scale-110"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
