"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

export interface LeaderRowView {
  rank: number;
  name: string;
  points: number;
}

// Big ring-tile countdown: each unit sits inside a progress ring that drains as
// time passes, digits drop in when they change, colons blink, and the seconds
// tile pulses. Under 24 hours the whole thing warms up to signal urgency.
export function Countdown({ endsAt, startsAt }: { endsAt: string; startsAt?: string | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return <div className="h-[112px] md:h-[132px]" aria-hidden="true" />;
  const end = new Date(endsAt).getTime();
  const ms = Math.max(0, end - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const start = startsAt ? new Date(startsAt).getTime() : NaN;
  const totalDays = Number.isFinite(start) && end > start ? Math.max(1, Math.ceil((end - start) / 86400000)) : Math.max(1, d);
  const urgent = ms < 86400000;
  const parts = [
    { v: d, l: d === 1 ? "day" : "days", frac: Math.min(1, d / totalDays) },
    { v: h, l: h === 1 ? "hour" : "hours", frac: h / 24 },
    { v: m, l: "min", frac: m / 60 },
    { v: s, l: "sec", frac: s / 60 },
  ];
  const R = 44;
  const C = 2 * Math.PI * R;
  const ring = urgent ? "#fb7185" : "hsl(var(--primary))";

  return (
    <div className="w-full max-w-[480px]" role="timer" aria-label={`${d} days, ${h} hours, ${m} minutes left to enter`}>
      <style>{`
        @keyframes rgd-drop { 0% { transform: translateY(-40%); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
        @keyframes rgd-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: .25 } }
        @keyframes rgd-glow { 0%,100% { box-shadow: 0 0 0 0 var(--rgd-glow) } 50% { box-shadow: 0 0 28px 2px var(--rgd-glow) } }
        .rgd-drop { animation: rgd-drop .35s cubic-bezier(.2,.8,.2,1) both }
        .rgd-blink { animation: rgd-blink 1s steps(1) infinite }
        .rgd-glow { animation: rgd-glow 2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .rgd-drop, .rgd-blink, .rgd-glow { animation: none !important }
        }
      `}</style>
      <div className="flex items-center gap-1.5 md:gap-2" aria-hidden="true">
        {parts.map((p, i) => (
          <div key={p.l} className="contents">
            {i > 0 && <span className="rgd-blink -mt-5 text-2xl font-bold text-background/40 md:text-3xl">:</span>}
            <div
              className={`relative aspect-square flex-1 rounded-2xl border bg-gradient-to-b from-background/10 to-background/[0.02] ${
                urgent ? "border-rose-400/40" : "border-background/15"
              } ${i === 3 ? "rgd-glow" : ""}`}
              style={{ ["--rgd-glow" as string]: urgent ? "rgba(251,113,133,.35)" : "hsl(var(--primary) / .35)" }}
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="3" className="text-background/10" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={ring}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - p.frac)}
                  style={{ transition: "stroke-dashoffset .6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="overflow-hidden">
                  <div key={p.v} className="rgd-drop text-3xl font-black tabular-nums leading-none text-background md:text-[2.6rem]">
                    {String(p.v).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/50 md:text-[11px]">{p.l}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {urgent && ms > 0 && (
        <p className="mt-3 text-sm font-semibold text-rose-300">Final day! Last call for entries and referrals.</p>
      )}
    </div>
  );
}

export function Leaderboard({ rows, highlightRank }: { rows: LeaderRowView[]; highlightRank?: number | null }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Leaderboard</h2>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">No entries yet. Be the first.</p>
      ) : (
        <ol className="divide-y divide-border">
          {rows.map((r) => (
            <li
              key={r.rank}
              className={`flex items-center justify-between px-5 py-3 text-sm ${r.rank === highlightRank ? "bg-primary/10 font-semibold" : ""}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 text-right tabular-nums ${r.rank <= 3 ? "font-bold text-primary" : "text-muted-foreground"}`}>{r.rank}</span>
                <span>{r.name}</span>
              </span>
              <span className="tabular-nums font-semibold">{r.points} pts</span>
            </li>
          ))}
        </ol>
      )}
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Winner is drawn at random. Every point is one more chance to win.
      </p>
    </div>
  );
}
