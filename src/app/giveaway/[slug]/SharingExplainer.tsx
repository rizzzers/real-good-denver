import { MessageCircle, Send, Ticket, UserPlus } from "lucide-react";

// Explains the referral mechanic on the dark hero: you in the middle, friends
// popping in around you, each one floating "+N" tickets up to your total.
// Pure CSS animation, disabled for prefers-reduced-motion.

// Six friends in a ring around "You", joining one at a time.
const FRIENDS = [
  { id: 1, x: 16, y: 28 },
  { id: 2, x: 50, y: 11 },
  { id: 3, x: 84, y: 28 },
  { id: 4, x: 84, y: 72 },
  { id: 5, x: 50, y: 89 },
  { id: 6, x: 16, y: 72 },
].map((f, i) => ({ ...f, delay: i * 1.1, src: `/giveaways/friends/friend-${f.id}.jpg` }));
const CYCLE = 7.5; // seconds for the whole loop

export default function SharingExplainer({ pointsReferral, pointsEntry }: { pointsReferral: number; pointsEntry: number }) {
  const per = pointsReferral.toLocaleString();
  const withSquad = (pointsEntry + pointsReferral * 5).toLocaleString();

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-background/10 bg-background/5 p-6 text-background backdrop-blur-sm md:p-8">
      <style>{`
        @keyframes rgd-pop { 0%,8% { transform: translate(-50%,-50%) scale(0); opacity: 0 } 16%,88% { transform: translate(-50%,-50%) scale(1); opacity: 1 } 100% { transform: translate(-50%,-50%) scale(0.6); opacity: 0 } }
        @keyframes rgd-line { 0%,10% { opacity: 0 } 18%,88% { opacity: .6 } 100% { opacity: 0 } }
        @keyframes rgd-march { to { stroke-dashoffset: -20 } }
        @keyframes rgd-float { 0%,16% { transform: translate(-50%,0); opacity: 0 } 22% { opacity: 1 } 40% { transform: translate(-50%,-28px); opacity: 0 } 100% { opacity: 0 } }
        @keyframes rgd-pulse { 0%,100% { box-shadow: 0 0 0 0 hsl(var(--primary) / .45) } 50% { box-shadow: 0 0 0 14px hsl(var(--primary) / 0) } }
        @keyframes rgd-tick { 0%,100% { transform: rotate(-6deg) } 50% { transform: rotate(6deg) } }
        @keyframes rgd-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
        .rgd-bob { animation: rgd-bob 3.2s ease-in-out infinite }
        .rgd-friend { animation: rgd-pop ${CYCLE}s ease-out infinite both }
        .rgd-line { stroke-dasharray: 2 8; animation: rgd-line ${CYCLE}s ease-out infinite both, rgd-march 1s linear infinite }
        .rgd-plus { animation: rgd-float ${CYCLE}s ease-out infinite both }
        .rgd-you { animation: rgd-pulse 2.4s ease-in-out infinite }
        .rgd-ticket { animation: rgd-tick 3s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .rgd-friend, .rgd-line, .rgd-plus, .rgd-you, .rgd-ticket, .rgd-bob { animation: none !important; opacity: 1 !important }
          .rgd-plus { display: none }
          .rgd-friend { transform: translate(-50%,-50%) !important }
        }
      `}</style>

      <div className="mb-1 flex items-center gap-2">
        <Ticket className="rgd-ticket h-5 w-5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">More friends, more chances</span>
      </div>
      <h2 className="text-2xl font-bold">Bring the squad, stack the odds</h2>
      <p className="mt-2 text-sm text-background/60">
        After you enter, you get your own link. Every friend who enters with it adds <strong className="text-background">{per} points</strong> to your total, and every point is another ticket in the drawing.
      </p>

      {/* Graphic */}
      <div className="relative mx-auto my-8 aspect-[4/3] w-full max-w-sm" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {FRIENDS.map((f) => (
            <line
              key={f.id}
              x1={f.x}
              y1={f.y}
              x2="50"
              y2="50"
              className="rgd-line"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${f.delay}s` }}
            />
          ))}
        </svg>

        {FRIENDS.map((f) => (
          <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            <div className="rgd-friend absolute left-0 top-0" style={{ animationDelay: `${f.delay}s` }}>
              <div className="rgd-bob h-14 w-14 overflow-hidden rounded-full border-2 border-background/80 bg-foreground shadow-lg md:h-16 md:w-16" style={{ animationDelay: `${f.id * -0.5}s` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt="" width={96} height={96} loading="lazy" className="h-full w-full scale-[1.12] object-cover" />
              </div>
            </div>
            <div
              className="rgd-plus absolute -top-9 left-0 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground"
              style={{ animationDelay: `${f.delay}s` }}
            >
              +{per}
            </div>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rgd-you flex h-16 w-16 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl">
            <span className="text-sm font-bold leading-none">You</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: UserPlus, title: "Enter", body: `Start with ${pointsEntry.toLocaleString()} point${pointsEntry === 1 ? "" : "s"}.` },
          { icon: MessageCircle, title: "Share your link", body: "Drop it in the group chat, your story, anywhere." },
          { icon: Send, title: "Friends enter", body: `+${per} for each one. No limit.` },
        ].map((s, i) => (
          <li key={s.title} className="rounded-xl border border-background/10 bg-background/5 p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{i + 1}</span>
              <s.icon className="h-4 w-4 text-background/60" />
            </div>
            <div className="text-sm font-semibold">{s.title}</div>
            <div className="text-xs text-background/50">{s.body}</div>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-center text-sm text-background/80">
        Bring your 5 brunch buddies and you&apos;re holding <strong className="text-primary">{withSquad} tickets</strong> instead of {pointsEntry.toLocaleString()}.
      </p>
    </div>
  );
}
