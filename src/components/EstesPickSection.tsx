"use client";

interface Props {
  html: string;
}

export default function EstesPickSection({ html }: Props) {
  // Split heading (h3 or first bold paragraph) from body copy
  const h3End = html.indexOf("</h3>");
  const pEnd = html.indexOf("</p>");
  const splitAt = h3End !== -1 ? h3End + 5 : pEnd !== -1 ? pEnd + 4 : -1;
  const headingHtml = splitAt !== -1 ? html.slice(0, splitAt) : "";
  const bodyHtml = splitAt !== -1 ? html.slice(splitAt) : html;

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
      {/* Warm glow behind left column */}
      <div
        className="absolute top-0 left-0 bottom-0 w-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.14) 0%, transparent 65%)",
        }}
      />

      <div className="relative p-6 md:p-8">
        {/* Header row: graphic left, badge + restaurant name right */}
        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          {/* Left: graphic */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
            <img
              src="/images/estes-picks.png"
              alt="Estes Picks"
              className="w-44 h-44 md:w-52 md:h-52 rounded-full object-cover"
              style={{
                boxShadow:
                  "0 0 0 3px #f97316, 0 0 32px rgba(249,115,22,0.4), 0 8px 30px rgba(0,0,0,0.6)",
              }}
            />
          </div>

          {/* Right: badge + h3 heading */}
          <div className="flex flex-col justify-center min-w-0">
            <div
              className="inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{
                background: "linear-gradient(90deg, #f97316, #f59e0b)",
                color: "#0a1628",
              }}
            >
              #1 Pick
            </div>
            <div
              className="post-content estes-pick-content"
              dangerouslySetInnerHTML={{ __html: headingHtml }}
            />
          </div>
        </div>

        {/* Body copy: full width, same margins as rest of post */}
        <div
          className="post-content estes-pick-content"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
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
