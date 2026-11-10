"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const slides = [
  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/4.jpg",
  "/hero/5.jpg",
  "/hero/6.jpg",
  "/hero/7.jpg",
  "/hero/8.jpg",
  "/hero/9.jpg",
  "/hero/10.jpg",
];

const HeroSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter_signup", name: name.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setName("");
      setEmail("");
      toast({ title: "You're in!", description: "Welcome to Real Good Denver." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Crossfade carousel */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
            style={{
              opacity: 0,
              animation: `heroFade 60s infinite`,
              animationDelay: `${i * 6}s`,
              animationFillMode: "both",
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(23,23,23,1) 0%, rgba(23,23,23,.7) 30%, rgba(23,23,23,.15) 65%, transparent 100%), linear-gradient(to right, rgba(23,23,23,.75) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 pt-28 pb-20 md:pt-0 md:pb-0 max-w-3xl">
        {/* Giveaway promo */}
        <Link
          href="/giveaway/dazzle-brunch"
          className="giveaway-btn group relative mb-10 mt-2 flex w-full max-w-md items-center gap-4 rounded-[1.75rem] px-5 py-4 text-gray-900 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.04] hover:rotate-0 active:scale-[0.97]"
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

          <span className="giveaway-sax relative text-4xl sm:text-5xl leading-none drop-shadow-sm" aria-hidden>🎷</span>
          <span className="relative flex-1 min-w-0">
            <span className="block text-[11px] font-black uppercase tracking-widest text-orange-900/70">Psst… free brunch, on us</span>
            <span className="block text-lg sm:text-xl font-black leading-tight">Win Jazz Brunch at Dazzle for you + 5 friends 🥞</span>
          </span>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-amber-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[-12deg]">
            <ArrowRight className="w-5 h-5" />
          </span>
        </Link>

        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-300 tracking-wide">New issue every Wednesday · Free</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-[-0.045em] text-white mb-7">
          Denver.<br />
          <span className="text-blue-400">Sunny.</span><br />
          <span className="text-white/25 italic font-light">Real Good.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-md mb-8">
          The newsletter <strong className="text-white font-semibold">37,000 Denverites</strong> read instead of doom-scrolling every Wednesday. Events, news, restaurants, jobs. The city, unfiltered.
        </p>

        {/* Form */}
        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-semibold">Check your inbox. You&apos;re in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="drop your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-28 sm:h-[52px] px-5 rounded-2xl bg-white/90 border-2 border-white/20 text-gray-900 placeholder:text-gray-400 text-base outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-28 sm:h-[52px] px-8 bg-blue-500 hover:bg-blue-400 text-white font-bold text-base rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 whitespace-nowrap shadow-[0_6px_24px_rgba(25,113,255,0.5)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>I live here <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        <p className="text-xs text-white mt-3">Free forever. No Fort Collins coverage. Unsubscribe anytime.</p>
      </div>

      {/* Floating picks badges, hop over to Best of Denver */}
      <div className="hidden lg:block absolute inset-0 z-20 pointer-events-none">
        <Link
          href="/best-of-denver"
          aria-label="See Ryan's Best of Denver picks"
          className="group pointer-events-auto absolute right-[16%] top-[22%]"
        >
          <div style={{ animation: "heroFloat1 7s ease-in-out infinite" }}>
            <img
              src="/images/estes-picks.png"
              alt="Ryan's Picks"
              className="w-32 xl:w-40 h-auto rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              style={{ filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.55))" }}
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white bg-blue-500 shadow-lg opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              Ryan&rsquo;s Picks
            </span>
          </div>
        </Link>

        <Link
          href="/best-of-denver"
          aria-label="See Tom's Best of Denver picks"
          className="group pointer-events-auto absolute right-[5%] top-[52%]"
        >
          <div style={{ animation: "heroFloat2 8s ease-in-out infinite", animationDelay: "0.6s" }}>
            <img
              src="/images/toms-picks.png"
              alt="Tom's Picks"
              className="w-28 xl:w-36 h-auto rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.55))" }}
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white bg-blue-500 shadow-lg opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              Tom&rsquo;s Picks
            </span>
          </div>
        </Link>
      </div>

      <style>{`
        @keyframes heroFade {
          0%   { opacity: 0; }
          5%   { opacity: 1; }
          15%  { opacity: 1; }
          20%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes heroFloat1 {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%      { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes heroFloat2 {
          0%, 100% { transform: translateY(0) rotate(4deg); }
          50%      { transform: translateY(-22px) rotate(-3deg); }
        }
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
        .giveaway-note { animation: giveawayNote 3.3s ease-out infinite; opacity: 0; }
        .giveaway-sax { display: inline-block; animation: giveawaySax 1.6s ease-in-out infinite; transform-origin: 60% 80%; }
        .giveaway-btn:hover .giveaway-sax { animation-duration: 0.5s; }
        .giveaway-sparkle { animation: giveawaySparkle 2.2s ease-in-out infinite; }
        .giveaway-btn:hover { transform: rotate(0deg) scale(1.04) !important; }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroFloat1"], [style*="heroFloat2"] { animation: none !important; }
          .giveaway-btn, .giveaway-note, .giveaway-sax, .giveaway-sparkle { animation: none !important; }
          .giveaway-note { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
