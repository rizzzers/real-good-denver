"use client";

interface Props {
  html: string;
}

export default function EstesPickSection({ html }: Props) {
  return (
    <div className="relative mb-10 rounded-2xl overflow-hidden">
      {/* Background: deep navy gradient matching the graphic */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a1628 0%, #142044 40%, #1a2d5a 60%, #0a1628 100%)",
        }}
      />
      {/* Subtle orange top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #f97316 30%, #f59e0b 50%, #f97316 70%, transparent)",
        }}
      />
      {/* Subtle warm haze behind the graphic */}
      <div
        className="absolute left-0 top-0 bottom-0 w-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at left center, rgba(249,115,22,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start gap-0 sm:gap-6 p-6 md:p-8">
        {/* Left: badge + image */}
        <div className="flex-shrink-0 flex flex-row sm:flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-0">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background:
                "linear-gradient(90deg, #f97316, #f59e0b)",
              color: "#0a1628",
            }}
          >
            <span>#1 Pick</span>
          </div>
          <img
            src="/images/estes-picks.png"
            alt="Estes Picks"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover flex-shrink-0"
            style={{
              boxShadow:
                "0 0 0 2px #f97316, 0 0 24px rgba(249,115,22,0.35), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Right: content */}
        <div
          className="flex-1 min-w-0 post-content estes-pick-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(249,115,22,0.4) 30%, rgba(245,158,11,0.4) 50%, rgba(249,115,22,0.4) 70%, transparent)",
        }}
      />
    </div>
  );
}
