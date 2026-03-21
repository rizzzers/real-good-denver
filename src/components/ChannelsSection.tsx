import Link from "next/link";

const channels = [
  {
    tag: "Newsletter",
    title: "Your Wednesday morning reason to be late to standup",
    desc: "Events, news, restaurants, jobs. In your inbox at 7am. Every week. Whether Denver deserves it or not.",
    href: "/newsletter",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&auto=format&fit=crop&q=82&crop=faces,center",
    cta: "Subscribe free",
  },
  {
    tag: "Podcast",
    title: "Interesting Coloradans saying things their PR team wouldn't approve",
    desc: "Founders, chefs, weirdos, athletes. No scripts. No talking points. Just Denver people being honest.",
    href: "/podcast",
    photo: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=700&auto=format&fit=crop&q=82&crop=faces,center",
    cta: "Listen now",
  },
  {
    tag: "Best of Denver",
    title: "Opinionated guides from someone who actually eats here",
    desc: "Deep, been-there-twice guides. Best ramen, bars, neighborhoods. Updated constantly because Denver keeps changing.",
    href: "/best-of-denver",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&auto=format&fit=crop&q=82",
    cta: "Explore guides",
  },
];

const ChannelsSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#171717]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-3">What we make</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Everything Denver. Nothing you didn&apos;t ask for.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {channels.map((ch) => (
            <Link
              key={ch.href}
              href={ch.href}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end cursor-pointer"
            >
              {/* Photo */}
              <img
                src={ch.photo}
                alt={ch.tag}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 brightness-50 saturate-110"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-7">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-2">{ch.tag}</p>
                <h3 className="text-lg md:text-xl font-bold leading-snug text-white mb-2.5">{ch.title}</h3>
                <p className="text-sm text-white/48 leading-relaxed mb-4">{ch.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-full px-3 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {ch.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChannelsSection;
