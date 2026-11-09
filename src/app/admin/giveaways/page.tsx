"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Row {
  id: number;
  slug: string;
  title: string;
  status: string;
  ends_at: string | null;
  entrant_count: number;
}

const BLUE = "#1a6dff";

export default function AdminGiveawaysPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/giveaways");
    if (res.status === 401) return router.push("/admin/login");
    setRows(await res.json());
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/giveaways", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, prize }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    router.push(`/admin/giveaways/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Giveaways</h1>
            <p className="text-xs text-gray-500">Real Good Denver admin</p>
          </div>
          <Link href="/admin/dashboard" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800">
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">No giveaways yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ends</th>
                  <th className="px-6 py-3">Entrants</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{g.title}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{g.ends_at ? new Date(g.ends_at).toLocaleString() : "Not set"}</td>
                    <td className="px-6 py-3.5 text-gray-500">{g.entrant_count}</td>
                    <td className="space-x-3 px-6 py-3.5 text-right">
                      <Link href={`/admin/giveaways/${g.id}`} className="font-medium hover:underline" style={{ color: BLUE }}>Manage</Link>
                      <a href={`/giveaway/${g.slug}`} target="_blank" className="text-gray-500 hover:underline">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form onSubmit={create} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">New giveaway</h2>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input className="rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Title, e.g. Win Jazz Brunch for Six" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Prize" value={prize} onChange={(e) => setPrize(e.target.value)} required />
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BLUE }}>Create as draft</button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "active" ? "bg-green-50 text-green-700" : status === "ended" ? "bg-gray-100 text-gray-600" : "bg-yellow-50 text-yellow-700";
  return <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}
