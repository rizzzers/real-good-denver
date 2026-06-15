"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Submission {
  id: number;
  created_at: string;
  type: string | null;
  name: string | null;
  email: string | null;
  subject: string | null;
  body: Record<string, unknown> | null;
  email_sent: boolean | null;
}

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "newsletter_signup", label: "Newsletter" },
  { key: "contact", label: "Contact" },
  { key: "partnership", label: "Partnership" },
  { key: "sponsorship", label: "Sponsorship" },
  { key: "sponsor_onboarding", label: "Sponsor Onboarding" },
  { key: "event", label: "Event" },
];

const TYPE_LABELS: Record<string, string> = {
  newsletter_signup: "Newsletter",
  contact: "Contact",
  partnership: "Partnership",
  sponsorship: "Sponsorship",
  sponsor_onboarding: "Sponsor Onboarding",
  event: "Event",
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchData = useCallback(
    async (type: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/submissions?type=${type}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to fetch submissions");
        }
        setSubmissions(await res.json());
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load submissions. Please refresh.",
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    fetchData(filter);
  }, [filter, fetchData]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Real Good Denver</h1>
            <p className="text-xs text-gray-500">Form Submissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              ← Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key ? "text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
              style={filter === f.key ? { backgroundColor: "#1a6dff" } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {FILTERS.find((f) => f.key === filter)?.label} Submissions
            </h2>
            <span className="text-sm text-gray-400">
              {loading ? "" : `${submissions.length} total`}
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">Loading…</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500 text-sm">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No submissions yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3">Received</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Emailed</th>
                  <th className="px-6 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((s) => (
                  <Fragment key={s.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDateTime(s.created_at)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                          {s.type ? TYPE_LABELS[s.type] ?? s.type : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-gray-900">
                        {s.name || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">
                        {s.email ? (
                          <a href={`mailto:${s.email}`} className="hover:underline" style={{ color: "#1a6dff" }}>
                            {s.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {s.email_sent ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                            Not sent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                          className="text-sm font-medium hover:underline"
                          style={{ color: "#1a6dff" }}
                        >
                          {expanded === s.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expanded === s.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          {s.subject && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                Subject
                              </p>
                              <p className="text-sm text-gray-700">{s.subject}</p>
                            </div>
                          )}
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                            Full submission
                          </p>
                          <pre className="text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-3 overflow-x-auto">
                            {JSON.stringify(s.body ?? {}, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
