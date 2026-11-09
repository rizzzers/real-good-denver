"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

export interface LeaderRowView {
  rank: number;
  name: string;
  points: number;
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return null;
  const ms = Math.max(0, new Date(endsAt).getTime() - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const parts = [
    { v: d, l: "days" },
    { v: h, l: "hrs" },
    { v: m, l: "min" },
    { v: s, l: "sec" },
  ];
  return (
    <div className="flex gap-3" aria-label="Time left to enter">
      {parts.map((p) => (
        <div key={p.l} className="min-w-[64px] rounded-xl border border-background/10 bg-background/5 px-3 py-2 text-center">
          <div className="text-2xl font-bold tabular-nums text-background">{String(p.v).padStart(2, "0")}</div>
          <div className="text-[11px] uppercase tracking-wider text-background/50">{p.l}</div>
        </div>
      ))}
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
