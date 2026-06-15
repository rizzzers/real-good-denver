"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "blog" | "newsletter" | "podcast";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  published_at: string | null;
  featured: boolean;
  created_at: string;
}

interface NewsletterIssue {
  id: number;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
}

interface PodcastEpisode {
  id: number;
  episode_title: string;
  episode_slug: string;
  created_at: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsletterIssues, setNewsletterIssues] = useState<NewsletterIssue[]>(
    []
  );
  const [podcastEpisodes, setPodcastEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(
    async (tab: Tab) => {
      setLoading(true);
      setError("");
      try {
        const endpointMap: Record<Tab, string> = {
          blog: "/api/admin/blog",
          newsletter: "/api/admin/newsletter",
          podcast: "/api/admin/podcast",
        };
        const res = await fetch(endpointMap[tab]);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        if (tab === "blog") setBlogPosts(data);
        else if (tab === "newsletter") setNewsletterIssues(data);
        else setPodcastEpisodes(data);
      } catch {
        setError("Failed to load data. Please refresh.");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(tab: Tab, id: number) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const endpointMap: Record<Tab, string> = {
      blog: `/api/admin/blog/${id}`,
      newsletter: `/api/admin/newsletter/${id}`,
      podcast: `/api/admin/podcast/${id}`,
    };
    const res = await fetch(endpointMap[tab], { method: "DELETE" });
    if (res.ok) {
      fetchData(tab);
    } else {
      alert("Delete failed. Please try again.");
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "blog", label: "Blog Posts" },
    { key: "newsletter", label: "Newsletter" },
    { key: "podcast", label: "Podcast" },
  ];

  const newLinkMap: Record<Tab, string> = {
    blog: "/admin/blog/new",
    newsletter: "/admin/newsletter/new",
    podcast: "/admin/podcast/new",
  };

  const newButtonLabelMap: Record<Tab, string> = {
    blog: "+ New Post",
    newsletter: "+ New Issue",
    podcast: "+ New Episode",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Real Good Denver
            </h1>
            <p className="text-xs text-gray-500">Content Management</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/submissions"
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              Form Submissions
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
        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={
                activeTab === tab.key ? { backgroundColor: "#1a6dff" } : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {tabs.find((t) => t.key === activeTab)?.label}
            </h2>
            <Link
              href={newLinkMap[activeTab]}
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1a6dff" }}
            >
              {newButtonLabelMap[activeTab]}
            </Link>
          </div>

          {/* Table body */}
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Loading…
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500 text-sm">
              {error}
            </div>
          ) : (
            <>
              {/* Blog Posts */}
              {activeTab === "blog" && (
                <div>
                  {blogPosts.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                      No blog posts yet.{" "}
                      <Link
                        href="/admin/blog/new"
                        className="underline"
                        style={{ color: "#1a6dff" }}
                      >
                        Create the first one.
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-6 py-3">Title</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3">Published</th>
                          <th className="px-6 py-3">Featured</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {blogPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                              {post.title}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500">
                              {post.category || "—"}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500">
                              {formatDate(post.published_at)}
                            </td>
                            <td className="px-6 py-3.5">
                              {post.featured ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                  Featured
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-6 py-3.5 text-right space-x-3">
                              <Link
                                href={`/admin/blog/${post.id}/edit`}
                                className="text-sm font-medium hover:underline"
                                style={{ color: "#1a6dff" }}
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete("blog", post.id)}
                                className="text-sm font-medium text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Newsletter Issues */}
              {activeTab === "newsletter" && (
                <div>
                  {newsletterIssues.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                      No newsletter issues yet.{" "}
                      <Link
                        href="/admin/newsletter/new"
                        className="underline"
                        style={{ color: "#1a6dff" }}
                      >
                        Create the first one.
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-6 py-3">Title</th>
                          <th className="px-6 py-3">Slug</th>
                          <th className="px-6 py-3">Published</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {newsletterIssues.map((issue) => (
                          <tr key={issue.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                              {issue.title}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">
                              {issue.slug}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500">
                              {formatDate(issue.published_at)}
                            </td>
                            <td className="px-6 py-3.5 text-right space-x-3">
                              <Link
                                href={`/admin/newsletter/${issue.id}/edit`}
                                className="text-sm font-medium hover:underline"
                                style={{ color: "#1a6dff" }}
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() =>
                                  handleDelete("newsletter", issue.id)
                                }
                                className="text-sm font-medium text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Podcast Episodes */}
              {activeTab === "podcast" && (
                <div>
                  {podcastEpisodes.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">
                      No podcast episodes yet.{" "}
                      <Link
                        href="/admin/podcast/new"
                        className="underline"
                        style={{ color: "#1a6dff" }}
                      >
                        Create the first one.
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-6 py-3">Episode Title</th>
                          <th className="px-6 py-3">Slug</th>
                          <th className="px-6 py-3">Created</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {podcastEpisodes.map((ep) => (
                          <tr key={ep.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                              {ep.episode_title}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">
                              {ep.episode_slug}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500">
                              {formatDate(ep.created_at)}
                            </td>
                            <td className="px-6 py-3.5 text-right space-x-3">
                              <Link
                                href={`/admin/podcast/${ep.id}/edit`}
                                className="text-sm font-medium hover:underline"
                                style={{ color: "#1a6dff" }}
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() =>
                                  handleDelete("podcast", ep.id)
                                }
                                className="text-sm font-medium text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
