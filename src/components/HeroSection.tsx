"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
      const { error } = await supabase.functions.invoke("newsletter-signup", {
        body: { name: name.trim(), email: email.trim(), source: "homepage-hero" },
      });
      if (error) throw error;
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
            <p className="text-white font-semibold">Check your inbox — you&apos;re in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="drop your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-28 sm:h-[52px] px-5 rounded-2xl bg-white/12 border-2 border-white/20 text-white placeholder:text-gray-400 text-base outline-none focus:border-blue-500 focus:bg-white/14 transition-all"
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

      <style>{`
        @keyframes heroFade {
          0%   { opacity: 0; }
          5%   { opacity: 1; }
          15%  { opacity: 1; }
          20%  { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
