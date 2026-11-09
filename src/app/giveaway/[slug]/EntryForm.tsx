"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EntryForm({ slug, refCode, minAge }: { slug: string; refCode: string | null; minAge: number }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", zip: "", website: "" });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const res = await fetch("/api/giveaway/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, ref: refCode, ageConfirmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (data.status === "entered") {
        router.push(data.redirect);
        router.refresh();
        return;
      }
      setNotice(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-background/15 bg-background/10 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:outline-none";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-background/10 bg-background/5 p-6 backdrop-blur-sm md:p-8">
      <h2 className="mb-1 text-2xl font-bold text-background">Enter to win</h2>
      <p className="mb-6 text-sm text-background/60">
        {refCode ? "A friend sent you. Enter and you both earn points." : "Takes 20 seconds. Then earn bonus points."}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input className={input} placeholder="First name" value={form.firstName} onChange={set("firstName")} required autoComplete="given-name" />
        <input className={input} placeholder="Last name" value={form.lastName} onChange={set("lastName")} required autoComplete="family-name" />
      </div>
      <input className={`${input} mt-3`} type="email" placeholder="Email" value={form.email} onChange={set("email")} required autoComplete="email" />
      <input
        className={`${input} mt-3`}
        placeholder="ZIP code"
        inputMode="numeric"
        pattern="\d{5}"
        maxLength={5}
        value={form.zip}
        onChange={set("zip")}
        required
        autoComplete="postal-code"
      />
      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />
      <label className="mt-4 flex items-start gap-3 text-sm text-background/70">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} required />
        <span>I am {minAge} or older and agree to the <Link href={`/giveaway/${slug}/rules`} className="underline" target="_blank">official rules</Link>.</span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Enter the giveaway
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {notice && <p className="mt-3 text-sm text-primary">{notice}</p>}
      <p className="mt-4 text-xs text-background/40">
        By entering, you&apos;ll get the Real Good Denver newsletter every Wednesday. Unsubscribe anytime. No purchase necessary.
      </p>
    </form>
  );
}
