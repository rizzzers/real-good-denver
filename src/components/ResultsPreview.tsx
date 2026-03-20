'use client';

import { BusinessRecommendation } from '@/types';
import BusinessCard from './BusinessCard';

interface ResultsPreviewProps {
  keyword: string;
  businesses: BusinessRecommendation[];
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function ResultsPreview({
  keyword,
  businesses,
  onGenerate,
  isGenerating,
}: ResultsPreviewProps) {
  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">
            Top spots for <span className="text-orange-500">{keyword}</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {businesses.length} businesses pulled from r/Denver
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {businesses.map((biz, i) => (
          <BusinessCard key={biz.name} business={biz} rank={i + 1} />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="rounded-lg bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate Blog Post'}
        </button>
      </div>
    </div>
  );
}
