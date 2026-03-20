import { BusinessRecommendation } from '@/types';

interface BusinessCardProps {
  business: BusinessRecommendation;
  rank: number;
}

export default function BusinessCard({ business, rank }: BusinessCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      {/* Rank + name */}
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-sm font-bold text-white">
          {rank}
        </span>
        <div>
          <h3 className="font-semibold text-zinc-100 leading-tight">{business.name}</h3>
          {business.neighborhood && (
            <p className="text-sm text-zinc-500 mt-0.5">{business.neighborhood}</p>
          )}
        </div>
      </div>

      {/* Placeholder image area */}
      <div className="h-24 rounded-lg bg-zinc-800 flex items-center justify-center">
        <span className="text-zinc-600 text-xs uppercase tracking-widest">No photo</span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-zinc-500">
        <span>{business.mentions} mentions</span>
        <span>+{business.totalScore} score</span>
      </div>

      {/* Snippets */}
      {business.redditSnippets.length > 0 && (
        <ul className="space-y-1">
          {business.redditSnippets.slice(0, 3).map((s, i) => (
            <li key={i} className="text-sm text-zinc-400 italic">
              &ldquo;{s}&rdquo;
            </li>
          ))}
        </ul>
      )}

      {/* Maps link */}
      {business.mapsUrl && (
        <a
          href={business.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          View on Google Maps →
        </a>
      )}
    </div>
  );
}
