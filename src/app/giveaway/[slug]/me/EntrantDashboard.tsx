"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Facebook, Mail, MessageCircle, Share2, KeyRound, Loader2 } from "lucide-react";
import { Leaderboard, type LeaderRowView } from "../shared";

const FOLLOW_SECONDS = 15;

interface LinkAction {
  id: number;
  label: string;
  url: string;
  points: number;
  done: boolean;
}

interface Props {
  slug: string;
  title: string;
  imageUrl: string | null;
  prize: string;
  open: boolean;
  firstName: string;
  points: number;
  rank: number | null;
  totalEntrants: number;
  referralCount: number;
  pointsReferral: number;
  shareUrl: string;
  linkActions: LinkAction[];
  codes: { total: number; found: number; points: number };
  leaders: LeaderRowView[];
}

export default function EntrantDashboard(p: Props) {
  const router = useRouter();
  const [points, setPoints] = useState(p.points);
  const [actions, setActions] = useState(p.linkActions);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [found, setFound] = useState(p.codes.found);
  const [pending, setPending] = useState<Record<number, number>>({});

  const shareText = `I just entered to win ${p.prize} from Real Good Denver. Enter here:`;
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(p.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the link is visible to copy by hand */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: p.title, text: shareText, url: p.shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  }

  function complete(a: LinkAction) {
    // Open the link right away (inside the click, so popup blockers allow it).
    window.open(a.url, "_blank", "noopener,noreferrer");
    if (a.done || !p.open || pending[a.id] !== undefined) return;
    // Give them time to actually follow before the points land.
    setPending((prev) => ({ ...prev, [a.id]: FOLLOW_SECONDS }));
    const tick = setInterval(() => {
      setPending((prev) => (prev[a.id] > 1 ? { ...prev, [a.id]: prev[a.id] - 1 } : prev));
    }, 1000);
    setTimeout(() => {
      clearInterval(tick);
      setPending((prev) => {
        const next = { ...prev };
        delete next[a.id];
        return next;
      });
      record(a);
    }, FOLLOW_SECONDS * 1000);
  }

  async function record(a: LinkAction) {
    setActions((prev) => prev.map((x) => (x.id === a.id ? { ...x, done: true } : x)));
    const res = await fetch("/api/giveaway/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug, actionId: a.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      if (data.points) setPoints((n) => n + data.points);
      router.refresh();
    } else {
      setActions((prev) => prev.map((x) => (x.id === a.id ? { ...x, done: false } : x)));
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeLoading(true);
    setCodeMsg(null);
    const res = await fetch("/api/giveaway/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug, code }),
    });
    const data = await res.json().catch(() => ({}));
    setCodeLoading(false);
    if (!res.ok) return setCodeMsg({ ok: false, text: data.error || "Try again." });
    if (data.status === "already") return setCodeMsg({ ok: true, text: "You already used that one." });
    setPoints((n) => n + data.points);
    setFound((n) => n + 1);
    setCode("");
    setCodeMsg({ ok: true, text: `Nice! +${data.points} points.` });
    router.refresh();
  }

  const shareBtn = "flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium hover:bg-muted";

  return (
    <>
      <section className="bg-foreground pb-12 pt-28">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-[1fr_400px]">
          <div>
          <p className="mb-2 text-sm text-background/50">
            <Link href={`/giveaway/${p.slug}`} className="hover:underline">{p.title}</Link>
          </p>
          <h1 className="text-4xl font-bold text-background md:text-5xl">You&apos;re in, {p.firstName}.</h1>
          <div className="mt-8 grid grid-cols-2 gap-4 md:max-w-md">
            <div className="rounded-xl border border-background/10 bg-background/5 p-4">
              <div className="text-3xl font-bold tabular-nums text-primary">{points}</div>
              <div className="text-xs uppercase tracking-wider text-background/50">Your points</div>
            </div>
            <div className="rounded-xl border border-background/10 bg-background/5 p-4">
              <div className="text-3xl font-bold tabular-nums text-background">{p.rank ? `#${p.rank}` : "-"}</div>
              <div className="text-xs uppercase tracking-wider text-background/50">of {p.totalEntrants.toLocaleString()} entrants</div>
            </div>
          </div>
          {!p.open && <p className="mt-6 text-sm text-background/60">Entries are closed. Thanks for playing!</p>}
          </div>
          {p.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imageUrl} alt={p.title} width={1672} height={941} className="w-full rounded-2xl border border-background/10 shadow-2xl" />
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-6">
            <div className="mb-1 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Share your link: +{p.pointsReferral} per friend</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Drop it in your group chats. Every friend who enters through your link earns you {p.pointsReferral} points.
              {p.referralCount > 0 && <strong className="text-foreground"> {p.referralCount} so far!</strong>}
            </p>
            <div className="flex gap-2">
              <input readOnly value={p.shareUrl} className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm" onFocus={(e) => e.target.select()} />
              <button onClick={copy} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button onClick={nativeShare} className={shareBtn}><Share2 className="h-4 w-4" /> Share</button>
              <a className={shareBtn} href={`sms:?&body=${enc(`${shareText} ${p.shareUrl}`)}`}><MessageCircle className="h-4 w-4" /> Text</a>
              <a className={shareBtn} target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(p.shareUrl)}`}><Facebook className="h-4 w-4" /> Facebook</a>
              <a className={shareBtn} href={`mailto:?subject=${enc(p.title)}&body=${enc(`${shareText} ${p.shareUrl}`)}`}><Mail className="h-4 w-4" /> Email</a>
            </div>
          </div>

          {actions.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold">Bonus points</h2>
              <ul className="space-y-3">
                {actions.map((a) => {
                  const left = pending[a.id];
                  const waiting = left !== undefined;
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => complete(a)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                          a.done ? "border-border bg-muted/50" : waiting ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {a.done ? (
                            <Check className="h-5 w-5 shrink-0 text-green-600" />
                          ) : waiting ? (
                            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
                          ) : (
                            <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
                          )}
                          <span className="flex flex-col">
                            <span className={a.done ? "text-muted-foreground" : ""}>{a.label}</span>
                            {waiting && <span className="text-sm text-primary">Open the new tab and follow</span>}
                          </span>
                        </span>
                        <span className={`shrink-0 font-semibold tabular-nums ${a.done ? "text-green-600" : "text-primary"}`}>
                          {a.done ? "Done" : waiting ? `${left}s` : `+${a.points}`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {p.codes.total > 0 && (
            <form onSubmit={submitCode} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-1 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Secret code words: +{p.codes.points} each</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                We hide code words in the newsletter and on the podcast. You&apos;ve found {found} of {p.codes.total}.
              </p>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter a code word" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5" disabled={!p.open} />
                <button disabled={codeLoading || !p.open} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {codeLoading && <Loader2 className="h-4 w-4 animate-spin" />} Submit
                </button>
              </div>
              {codeMsg && <p className={`mt-2 text-sm ${codeMsg.ok ? "text-green-600" : "text-red-500"}`}>{codeMsg.text}</p>}
            </form>
          )}
        </div>

        <Leaderboard rows={p.leaders} highlightRank={p.rank} />
      </section>
    </>
  );
}
