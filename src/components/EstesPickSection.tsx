"use client";

interface Props {
  html: string;
}

export default function EstesPickSection({ html }: Props) {
  return (
    <div className="relative mb-10 rounded-2xl overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0a1628 0%, #142044 45%, #1a2d5a 70%, #0a1628 100%)",
        }}
      />
      {/* Orange top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #f97316 25%, #f59e0b 50%, #f97316 75%, transparent)",
        }}
      />
      {/* Warm glow behind image area */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.15) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex flex-col p-6 md:p-8">
        {/* Top: image + badge stacked */}
        <div className="flex flex-col items-start gap-3 mb-6">
          <img
            src="/images/estes-picks.png"
            alt="Estes Picks"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover"
            style={{
              boxShadow:
                "0 0 0 3px #f97316, 0 0 32px rgba(249,115,22,0.4), 0 8px 30px rgba(0,0,0,0.6)",
            }}
          />
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "linear-gradient(90deg, #f97316, #f59e0b)",
              color: "#0a1628",
            }}
          >
            #1 Pick
          </div>
        </div>

        {/* Content at same margins as the rest of the post */}
        <div
          className="post-content estes-pick-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(249,115,22,0.4) 25%, rgba(245,158,11,0.4) 50%, rgba(249,115,22,0.4) 75%, transparent)",
        }}
      />
    </div>
  );
}
