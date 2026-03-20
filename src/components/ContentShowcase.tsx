"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface ShowcaseItem {
  title: string;
  hook: string;
  emoji: string;
}

const items: ShowcaseItem[] = [
  { emoji: "📅", title: "Events", hook: "The wildest, weirdest, most \"only in Denver\" things to do this week." },
  { emoji: "📰", title: "News", hook: "What happened. Why it matters. Whether it makes Denver better or worse." },
  { emoji: "🏆", title: "Sports", hook: "Five can't-miss games. Broncos heartbreak. Nuggets magic. The whole deal." },
  { emoji: "✨", title: "Hidden Gems", hook: "Secret shows. Tiny markets. Weird art. The stuff no one tells you about." },
  { emoji: "🎙️", title: "Podcast", hook: "Founders, chefs, creatives, and characters shaping the city, every week." },
  { emoji: "🎁", title: "Giveaways", hook: "Local prizes, holiday surprises, and community shout-outs." },
  { emoji: "📖", title: "Book Club", hook: "Real meetups for people who want to meet Denver humans in real life." },
  { emoji: "💼", title: "Jobs", hook: "The most-clicked section. Curated local roles. Zero nonsense." },
  { emoji: "🏪", title: "Local Brands", hook: "Ads that don't suck. Denver makers and services worth knowing." },
  { emoji: "⭐", title: "Special Drops", hook: "Holiday issues, Denver secrets, neighborhood guides, and surprises." },
];

const ShowcaseCard = ({ item, index }: { item: ShowcaseItem; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)] h-full">
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
          <div>
            <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.hook}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentShowcase = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">Every Wednesday</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Everything Denver,<br />
            <span className="text-muted-foreground">nothing you don&apos;t need.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each issue is packed with Denver-only content curated by people who actually live here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item, index) => (
            <ShowcaseCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentShowcase;
