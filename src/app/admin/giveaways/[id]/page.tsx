"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BLUE = "#1a6dff";

interface Giveaway {
  id: number;
  slug: string;
  title: string;
  prize: string;
  prize_value: string | null;
  description: string | null;
  sponsor_name: string | null;
  sponsor_url: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  points_entry: number;
  points_referral: number;
  min_age: number;
  rules: string | null;
  winner_entrant_id: string | null;
  winner_drawn_at: string | null;
}

interface Action {
  id: number;
  kind: "link" | "code";
  label: string;
  url: string | null;
  code: string | null;
  points: number;
  sort: number;
  active: boolean;
}

interface Score {
  entrant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  zip: string;
  ip: string | null;
  created_at: string;
  disqualified: boolean;
  bonus_points: number;
  referred_by: string | null;
  action_points: number;
  referral_count: number;
  same_ip_referrals: number;
  total_points: number;
}

// datetime-local <-> ISO, in the admin's browser timezone.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string): string | null {
  return v ? new Date(v).toISOString() : null;
}

const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm";
const label = "mb-1 block text-xs font-medium text-gray-500";
const card = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

export default function AdminGiveawayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [g, setG] = useState<Giveaway | null>(null);
  const [form, setForm] = useState<Giveaway | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [drawResult, setDrawResult] = useState("");
  const [newAction, setNewAction] = useState({ kind: "link", label: "", url: "", code: "", points: 2 });

  const api = `/api/admin/giveaways/${params.id}`;

  const load = useCallback(async () => {
    const res = await fetch(api);
    if (res.status === 401) return router.push("/admin/login");
    const data = await res.json();
    setG(data.giveaway);
    setForm(data.giveaway);
    setActions(data.actions);
    setScores(data.scores);
  }, [api, router]);

  useEffect(() => {
    load();
  }, [load]);

  const byId = useMemo(() => new Map(scores.map((s) => [s.entrant_id, s])), [scores]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? scores.filter((s) => `${s.first_name} ${s.last_name} ${s.email} ${s.zip}`.toLowerCase().includes(q)) : scores;
  }, [scores, search]);
  const stats = useMemo(() => {
    const ok = scores.filter((s) => !s.disqualified);
    return {
      entrants: ok.length,
      referred: ok.filter((s) => s.referred_by).length,
      points: ok.reduce((n, s) => n + s.total_points, 0),
      flagged: ok.filter((s) => s.same_ip_referrals > 0).length,
    };
  }, [scores]);

  if (!g || !form) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>;
  const winner = g.winner_entrant_id ? byId.get(g.winner_entrant_id) : null;

  const set = (k: keyof Giveaway) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value } as Giveaway);

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  }

  async function send(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      flash(`Error: ${data.error || res.status}`);
      return null;
    }
    return data;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const ok = await send(api, "PATCH", {
      ...form,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
    });
    if (ok) {
      flash("Saved");
      load();
    }
  }

  async function addAction(e: React.FormEvent) {
    e.preventDefault();
    const ok = await send(`${api}/actions`, "POST", { ...newAction, sort: (actions[actions.length - 1]?.sort ?? 0) + 10 });
    if (ok) {
      setNewAction({ kind: newAction.kind, label: "", url: "", code: "", points: newAction.points });
      load();
    }
  }

  async function updateAction(a: Action, patch: Partial<Action>) {
    if (await send(`${api}/actions`, "PATCH", { id: a.id, ...patch })) load();
  }

  async function deleteAction(a: Action) {
    if (!confirm(`Delete "${a.label}"? Anyone who earned points from it will lose them. To keep their points, turn it off instead.`)) return;
    if (await send(`${api}/actions?actionId=${a.id}`, "DELETE")) load();
  }

  async function updateEntrant(s: Score, patch: { disqualified?: boolean; bonus_points?: number }) {
    if (await send(`${api}/entrants`, "PATCH", { entrantId: s.entrant_id, ...patch })) load();
  }

  async function draw(excludeCurrent: boolean) {
    const msg = excludeCurrent ? "Redraw, skipping the current winner?" : "Draw a winner now? This is a weighted random draw.";
    if (!confirm(msg)) return;
    const exclude = excludeCurrent && g?.winner_entrant_id ? [g.winner_entrant_id] : [];
    const data = await send(`${api}/draw`, "POST", { exclude });
    if (data) {
      setDrawResult(`${data.winner.name} (${data.winner.email}) won with ${data.odds}, from ${data.pool} eligible entrants.`);
      load();
    }
  }

  async function clearWinner() {
    if (!confirm("Clear the winner?")) return;
    if (await send(`${api}/draw`, "POST", { clear: true })) {
      setDrawResult("");
      load();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/admin/giveaways" className="text-xs text-gray-500 hover:underline">All giveaways</Link>
            <h1 className="truncate text-xl font-bold text-gray-900">{g.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
            <a href={`/giveaway/${g.slug}`} target="_blank" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
              {g.status === "draft" ? "Preview" : "View page"}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Entrants", stats.entrants],
            ["Via referral", stats.referred],
            ["Total points", stats.points],
            ["Same-IP referral flags", stats.flagged],
          ].map(([l, v]) => (
            <div key={l} className={card}>
              <div className="text-2xl font-bold text-gray-900">{v}</div>
              <div className="text-xs text-gray-500">{l}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <form onSubmit={save} className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Settings</h2>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BLUE }}>Save</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label}>Status</label>
              <select className={input} value={form.status} onChange={set("status")}>
                <option value="draft">Draft (hidden, admins can preview)</option>
                <option value="active">Active (live, accepting entries between start and end)</option>
                <option value="ended">Ended (closed)</option>
              </select>
            </div>
            <div>
              <label className={label}>URL slug: realgooddenver.com/giveaway/{form.slug}</label>
              <input className={input} value={form.slug} onChange={set("slug")} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Title</label>
              <input className={input} value={form.title} onChange={set("title")} />
            </div>
            <div>
              <label className={label}>Prize</label>
              <input className={input} value={form.prize} onChange={set("prize")} />
            </div>
            <div>
              <label className={label}>Approximate prize value (for rules)</label>
              <input className={input} value={form.prize_value ?? ""} onChange={set("prize_value")} placeholder="$300" />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Description</label>
              <textarea className={input} rows={3} value={form.description ?? ""} onChange={set("description")} />
            </div>
            <div>
              <label className={label}>Sponsor name</label>
              <input className={input} value={form.sponsor_name ?? ""} onChange={set("sponsor_name")} />
            </div>
            <div>
              <label className={label}>Sponsor URL</label>
              <input className={input} value={form.sponsor_url ?? ""} onChange={set("sponsor_url")} />
            </div>
            <div>
              <label className={label}>Starts (your local time; blank = as soon as Active)</label>
              <input type="datetime-local" className={input} value={toLocalInput(form.starts_at)} onChange={(e) => setForm({ ...form, starts_at: fromLocalInput(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Ends (your local time)</label>
              <input type="datetime-local" className={input} value={toLocalInput(form.ends_at)} onChange={(e) => setForm({ ...form, ends_at: fromLocalInput(e.target.value) })} />
            </div>
            <div className="grid grid-cols-3 gap-3 md:col-span-2">
              <div>
                <label className={label}>Points for entering</label>
                <input type="number" className={input} value={form.points_entry} onChange={set("points_entry")} />
              </div>
              <div>
                <label className={label}>Points per referral</label>
                <input type="number" className={input} value={form.points_referral} onChange={set("points_referral")} />
              </div>
              <div>
                <label className={label}>Minimum age</label>
                <input type="number" className={input} value={form.min_age} onChange={set("min_age")} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={label}>Social share image URL (optional, 1200x630)</label>
              <input className={input} value={form.image_url ?? ""} onChange={set("image_url")} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>
                Official rules (leave blank to use the auto-generated template, <a className="underline" href={`/giveaway/${g.slug}/rules`} target="_blank">view current rules</a>)
              </label>
              <textarea className={`${input} font-mono text-xs`} rows={6} value={form.rules ?? ""} onChange={set("rules")} />
            </div>
          </div>
        </form>

        {/* Bonus actions */}
        <div className={card}>
          <h2 className="mb-1 font-semibold text-gray-900">Bonus actions</h2>
          <p className="mb-4 text-xs text-gray-500">
            Link actions award points when clicked. Code words award points when the code is typed in (hide them in the newsletter or podcast). Codes are never shown publicly.
          </p>
          <table className="mb-4 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2">Type</th>
                <th className="py-2">Label</th>
                <th className="py-2">URL / Code</th>
                <th className="py-2">Pts</th>
                <th className="py-2">On</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {actions.map((a) => (
                <ActionRow key={a.id} a={a} onSave={(p) => updateAction(a, p)} onDelete={() => deleteAction(a)} />
              ))}
            </tbody>
          </table>
          <form onSubmit={addAction} className="grid gap-2 md:grid-cols-[110px_1fr_1fr_80px_auto]">
            <select className={input} value={newAction.kind} onChange={(e) => setNewAction({ ...newAction, kind: e.target.value })}>
              <option value="link">Link</option>
              <option value="code">Code word</option>
            </select>
            <input className={input} placeholder={newAction.kind === "code" ? "Label, e.g. Code word from the Nov 12 newsletter" : "Label, e.g. Follow Dazzle on Instagram"} value={newAction.label} onChange={(e) => setNewAction({ ...newAction, label: e.target.value })} required />
            {newAction.kind === "code" ? (
              <input className={input} placeholder="Code word" value={newAction.code} onChange={(e) => setNewAction({ ...newAction, code: e.target.value })} required />
            ) : (
              <input className={input} placeholder="https://..." value={newAction.url} onChange={(e) => setNewAction({ ...newAction, url: e.target.value })} required />
            )}
            <input type="number" className={input} value={newAction.points} onChange={(e) => setNewAction({ ...newAction, points: Number(e.target.value) })} />
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BLUE }}>Add</button>
          </form>
        </div>

        {/* Winner */}
        <div className={card}>
          <h2 className="mb-1 font-semibold text-gray-900">Winner</h2>
          <p className="mb-4 text-xs text-gray-500">Weighted random draw: every point is one ticket. Disqualified entrants are excluded.</p>
          {winner ? (
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-900">
              <strong>{winner.first_name} {winner.last_name}</strong> ({winner.email}, ZIP {winner.zip}), {winner.total_points} points. Drawn {new Date(g.winner_drawn_at!).toLocaleString()}.
              <div className="mt-1 text-xs">Shown publicly as &quot;{winner.first_name} {winner.last_name.charAt(0)}.&quot; on the giveaway page.</div>
            </div>
          ) : (
            <p className="mb-4 text-sm text-gray-500">No winner drawn yet.</p>
          )}
          {drawResult && <p className="mb-4 text-sm text-gray-700">{drawResult}</p>}
          <div className="flex flex-wrap gap-2">
            {!winner && <button onClick={() => draw(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BLUE }}>Draw winner</button>}
            {winner && <button onClick={() => draw(true)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm">Redraw (skip current winner)</button>}
            {winner && <button onClick={clearWinner} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-red-600">Clear winner</button>}
          </div>
        </div>

        {/* Entrants */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Entrants ({scores.length})</h2>
            <div className="flex gap-2">
              <input className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm" placeholder="Search name, email, ZIP" value={search} onChange={(e) => setSearch(e.target.value)} />
              <a href={`${api}/export`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">Export CSV</a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">ZIP</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Refs</th>
                  <th className="px-4 py-3">Referred by</th>
                  <th className="px-4 py-3">Adjust</th>
                  <th className="px-4 py-3">Entered</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s.entrant_id} className={s.disqualified ? "bg-red-50/50 text-gray-400 line-through" : "hover:bg-gray-50"}>
                    <td className="px-4 py-2.5 font-medium">{s.first_name} {s.last_name}</td>
                    <td className="px-4 py-2.5">{s.email}</td>
                    <td className="px-4 py-2.5">{s.zip}</td>
                    <td className="px-4 py-2.5 font-semibold">{s.total_points}</td>
                    <td className="px-4 py-2.5">
                      {s.referral_count}
                      {s.same_ip_referrals > 0 && (
                        <span title="Referrals that came from the same IP address as this entrant" className="ml-1 rounded bg-yellow-100 px-1.5 text-xs text-yellow-800 no-underline">
                          {s.same_ip_referrals} same IP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs">{s.referred_by ? byId.get(s.referred_by)?.email ?? "" : ""}</td>
                    <td className="px-4 py-2.5">
                      <BonusInput value={s.bonus_points} onSave={(v) => updateEntrant(s, { bonus_points: v })} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs">{new Date(s.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => updateEntrant(s, { disqualified: !s.disqualified })} className={`text-xs font-medium ${s.disqualified ? "text-gray-600" : "text-red-500"}`}>
                        {s.disqualified ? "Restore" : "Disqualify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="px-6 py-10 text-center text-sm text-gray-400">No entrants.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionRow({ a, onSave, onDelete }: { a: Action; onSave: (p: Partial<Action>) => void; onDelete: () => void }) {
  const [row, setRow] = useState(a);
  const dirty = row.label !== a.label || row.url !== a.url || row.code !== a.code || row.points !== a.points;
  return (
    <tr className={a.active ? "" : "opacity-50"}>
      <td className="py-2 pr-2 text-xs text-gray-500">{a.kind === "code" ? "Code" : "Link"}</td>
      <td className="py-2 pr-2"><input className={input} value={row.label} onChange={(e) => setRow({ ...row, label: e.target.value })} /></td>
      <td className="py-2 pr-2">
        {a.kind === "code" ? (
          <input className={input} value={row.code ?? ""} onChange={(e) => setRow({ ...row, code: e.target.value })} />
        ) : (
          <input className={input} value={row.url ?? ""} onChange={(e) => setRow({ ...row, url: e.target.value })} />
        )}
      </td>
      <td className="w-20 py-2 pr-2"><input type="number" className={input} value={row.points} onChange={(e) => setRow({ ...row, points: Number(e.target.value) })} /></td>
      <td className="py-2 pr-2"><input type="checkbox" checked={a.active} onChange={(e) => onSave({ active: e.target.checked })} /></td>
      <td className="whitespace-nowrap py-2 text-right">
        {dirty && <button onClick={() => onSave({ label: row.label, url: row.url, code: row.code, points: row.points })} className="mr-3 text-xs font-semibold" style={{ color: BLUE }}>Save</button>}
        <button onClick={onDelete} className="text-xs text-red-500">Delete</button>
      </td>
    </tr>
  );
}

function BonusInput({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(String(value));
  return (
    <input
      type="number"
      className="w-16 rounded border border-gray-200 px-2 py-1 text-xs"
      value={v}
      title="Manual bonus points (can be negative)"
      onChange={(e) => setV(e.target.value)}
      onBlur={() => Number(v) !== value && onSave(Number(v) || 0)}
    />
  );
}
