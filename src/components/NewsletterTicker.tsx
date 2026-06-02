import Link from "next/link";

const ITEMS = [
  "Free events every week",
  "Ticket giveaways",
  "Exclusive Denver opportunities",
  "Local news that actually matters",
  "Hidden gems you haven't found yet",
  "The best eats, drinks, and things to do",
  "Weekly reads worth your time",
  "Concerts, markets, pop-ups, and more",
  "Denver culture, straight to your inbox",
];

const SEP = "✦";

export default function NewsletterTicker() {
  const track = ITEMS.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-5 whitespace-nowrap">
      <span className="text-primary text-xs">{SEP}</span>
      <span>{item}</span>
    </span>
  ));

  return (
    <div className="relative bg-foreground border-y border-background/10 overflow-hidden flex items-center h-12">
      {/* Fixed left label */}
      <Link
        href="/newsletter"
        className="relative z-10 flex-shrink-0 flex items-center gap-2 pl-5 pr-6 h-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)" }}
      >
        Free Newsletter
      </Link>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-10 text-sm text-background/60 font-medium animate-ticker">
          {track}
          {/* Duplicate for seamless loop */}
          {track}
          {track}
        </div>
      </div>
    </div>
  );
}
