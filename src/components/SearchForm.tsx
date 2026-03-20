'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [keyword, setKeyword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="best tacos, green chile, ramen..."
          disabled={isLoading}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
