'use client';

import { useState } from 'react';
import { BlogPost } from '@/types';

interface BlogPostPreviewProps {
  blogPost: BlogPost;
  onReset: () => void;
}

export default function BlogPostPreview({ blogPost, onReset }: BlogPostPreviewProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(blogPost.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Start over
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {showRaw ? 'Rendered' : 'Raw Markdown'}
          </button>
          <button
            onClick={handleCopy}
            className="rounded-md bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        {showRaw ? (
          <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed overflow-x-auto">
            {blogPost.markdown}
          </pre>
        ) : (
          <div className="prose prose-invert prose-zinc max-w-none">
            <h1 className="text-2xl font-bold text-zinc-100 mb-4">{blogPost.title}</h1>
            <p className="text-zinc-400 mb-6 leading-relaxed">{blogPost.intro}</p>
            <hr className="border-zinc-700 mb-6" />
            {blogPost.entries.map((entry) => (
              <div key={entry.rank} className="mb-8">
                <h2 className="text-lg font-semibold text-zinc-100 mb-1">
                  {entry.rank}. {entry.name}
                </h2>
                <p className="text-sm text-zinc-500 italic mb-3">{entry.neighborhood}</p>
                <p className="text-zinc-300 leading-relaxed mb-2">{entry.body}</p>
                <a
                  href={entry.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Google Maps →
                </a>
              </div>
            ))}
            <hr className="border-zinc-700 mb-6" />
            <p className="text-zinc-400 leading-relaxed">{blogPost.outro}</p>
            <p className="text-xs text-zinc-600 mt-4 italic">Sourced from r/Denver</p>
          </div>
        )}
      </div>
    </div>
  );
}
