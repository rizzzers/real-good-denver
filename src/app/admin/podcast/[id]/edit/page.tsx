"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface PodcastEpisode {
  id: number;
  episode_title: string;
  episode_slug: string;
  show_notes: string;
}

export default function EditPodcastEpisodePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    episode_title: "",
    episode_slug: "",
    show_notes: "",
  });

  useEffect(() => {
    async function loadEpisode() {
      try {
        const res = await fetch("/api/admin/podcast");
        if (!res.ok) throw new Error("Failed to load");
        const episodes: PodcastEpisode[] = await res.json();
        const ep = episodes.find((e) => String(e.id) === String(id));
        if (!ep) throw new Error("Episode not found");
        setForm({
          episode_title: ep.episode_title || "",
          episode_slug: ep.episode_slug || "",
          show_notes: ep.show_notes || "",
        });
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load episode"
        );
      } finally {
        setLoading(false);
      }
    }
    loadEpisode();
  }, [id]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const episode_title = e.target.value;
    setForm((prev) => ({
      ...prev,
      episode_title,
      episode_slug: slugify(episode_title),
    }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const res = await fetch(`/api/admin/podcast/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setSaveError(data.error || "Failed to save");
      }
    } catch {
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{loadError}</p>
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium"
            style={{ color: "#1a6dff" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Dashboard
          </Link>
          <h1 className="text-lg font-bold text-gray-900">
            Edit Podcast Episode
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Episode Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Episode Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="episode_title"
                value={form.episode_title}
                onChange={handleTitleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Episode Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="episode_slug"
                value={form.episode_slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Show Notes
            </h2>
            <p className="text-xs text-gray-400">
              Markdown is supported. Include links, timestamps, guest bios, etc.
            </p>

            <textarea
              name="show_notes"
              value={form.show_notes}
              onChange={handleChange}
              rows={20}
              placeholder="## Episode Summary&#10;&#10;In this episode..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#1a6dff" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
