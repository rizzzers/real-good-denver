'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import ResultsPreview from '@/components/ResultsPreview';
import BlogPostPreview from '@/components/BlogPostPreview';
import LoadingState from '@/components/LoadingState';
import { SearchResult, BlogPost } from '@/types';

type Phase = 'search' | 'preview' | 'output';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('search');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  async function handleSearch(keyword: string) {
    setIsSearching(true);
    setError(null);
    setLoadingMessage('Searching r/Denver...');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Search failed');

      setSearchResult(data);
      setPhase('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }

  async function handleGenerate() {
    if (!searchResult) return;
    setIsGenerating(true);
    setError(null);
    setLoadingMessage('Generating blog post in Denver voice...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: searchResult.keyword,
          businesses: searchResult.businesses,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');

      setBlogPost(data);
      setPhase('output');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleReset() {
    setPhase('search');
    setSearchResult(null);
    setBlogPost(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-bold text-lg">Real Good Denver</span>
            <span className="text-zinc-600 text-sm">/ Reddit blog aggregator</span>
          </div>
          <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            Blog
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-12">
        {/* Landing / Search phase */}
        {phase === 'search' && (
          <div className="flex flex-col items-center gap-8 max-w-xl mx-auto text-center">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100 mb-3">Real Good Denver</h1>
              <p className="text-zinc-500 text-lg">
                Type a keyword. We search r/Denver, extract the most-mentioned spots, and write a blog post that sounds like a local wrote it.
              </p>
            </div>
            <SearchForm onSearch={handleSearch} isLoading={isSearching} />
            {isSearching && <LoadingState message={loadingMessage} />}
          </div>
        )}

        {/* Preview phase */}
        {phase === 'preview' && searchResult && !isGenerating && (
          <div className="flex flex-col items-center gap-6">
            <ResultsPreview
              keyword={searchResult.keyword}
              businesses={searchResult.businesses}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        )}

        {/* Generating state */}
        {phase === 'preview' && isGenerating && (
          <div className="flex justify-center">
            <LoadingState message={loadingMessage} />
          </div>
        )}

        {/* Output phase */}
        {phase === 'output' && blogPost && (
          <div className="flex flex-col items-center gap-6">
            <BlogPostPreview blogPost={blogPost} onReset={handleReset} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 max-w-xl mx-auto rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
