"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useRef, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const testimonials = [
  { quote: "The only Denver newsletter I actually open every week.", name: "Sarah K.", detail: "Capitol Hill" },
  { quote: "I found my favorite restaurant, my job, AND my book club through RGD.", name: "Marcus T.", detail: "RiNo" },
  { quote: "It's like having a friend who knows everything about Denver.", name: "Jenny L.", detail: "Wash Park" },
  { quote: "Moved here last year and this newsletter made Denver feel like home.", name: "David R.", detail: "Baker" },
  { quote: "Better than any local news app. Actual useful stuff every single week.", name: "Priya M.", detail: "Highlands" },
  { quote: "My coworkers thought I was a Denver native after three months of reading this.", name: "Alex W.", detail: "LoDo" },
  { quote: "The events section alone is worth the subscribe. Never miss a thing now.", name: "Rosa C.", detail: "Sunnyside" },
  { quote: "Finally, someone who writes about Denver without the corporate PR spin.", name: "Theo N.", detail: "Five Points" },
  { quote: "I literally plan my weekends around the Friday edition.", name: "Kim H.", detail: "Sloan's Lake" },
  { quote: "Sent the jobs issue to my sister and she got hired within two weeks.", name: "Jordan B.", detail: "Park Hill" },
];

const stats = [
  { value: "20K+", label: "Weekly readers" },
  { value: "52", label: "Issues per year" },
  { value: "100%", label: "Free, always" },
];

const SocialProofSection = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal();
  const { ref: quotesRef, isVisible: quotesVisible } = useScrollReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();
  const isPaused = useRef(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    isPaused.current = true;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(() => { isPaused.current = false; }, 3000);
  };

  const animate = useCallback(() => {
    if (scrollRef.current && !isPaused.current) {
      const el = scrollRef.current;
      el.scrollLeft += 0.5;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft = 0;
      }
    }
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [animate]);

  return (
    <section className="py-24 md:py-32 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={statsRef}
          className={`flex flex-col sm:flex-row items-center justify-center gap-12 md:gap-20 mb-20 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <div
          ref={quotesRef}
          className={`transition-all duration-700 ${quotesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.15s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">What readers say</p>
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors" aria-label="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors" aria-label="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
            className="flex gap-4 overflow-x-auto pb-4 mb-16 -mx-6 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-[300px] max-w-[320px] flex-shrink-0 snap-start bg-card border border-border rounded-2xl p-8 flex flex-col justify-between">
                <p className="text-foreground text-lg leading-relaxed mb-6 font-medium italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { label: "Browse past issues", href: "/newsletter" },
            { label: "Listen to the podcast", href: "/podcast" },
            { label: "Best of Denver", href: "/best-of-denver" },
            { label: "Find a job", href: "/jobs" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              {link.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
