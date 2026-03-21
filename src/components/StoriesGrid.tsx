"use client";

import Link from "next/link";
import { newsletterIssues } from "@/data/newsletterIssues";

const storyMeta = [
  {
    tag: "City Hall",
    photo: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&auto=format&fit=crop&q=82",
  },
  {
    tag: "Local News",
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=82",
  },
  {
    tag: "Denver People",
    photo: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&auto=format&fit=crop&q=82&crop=faces,center",
  },
];

const StoriesGrid = () => {
  const stories = newsletterIssues.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-[#171717] px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            This week in Denver, somehow
          </h2>
          <Link
            href="/newsletter"
            className="text-sm font-semibold text-blue-400 hover:opacity-70 transition-opacity hidden sm:block"
          >
            Full archive →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {stories.map((issue, i) => (
            <Link key={issue.slug} href={`/newsletter/${issue.slug}`} className="group">
              {/* Photo */}
              <div className="rounded-2xl overflow-hidden aspect-[3/2] mb-5">
                <img
                  src={storyMeta[i].photo}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 saturate-110"
                />
              </div>

              {/* Rule + tag */}
              <div className="w-8 h-0.5 bg-blue-500 rounded mb-3" />
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-2.5">
                {storyMeta[i].tag}
              </p>

              {/* Headline */}
              <h3 className="text-base sm:text-lg font-bold leading-snug tracking-tight text-white group-hover:text-blue-400 transition-colors mb-2.5 line-clamp-3">
                {issue.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-white/45 leading-relaxed line-clamp-2">
                {issue.description}
              </p>

              {/* Read link */}
              <span className="inline-block mt-3 text-xs font-bold text-blue-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                Read this →
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile archive link */}
        <div className="mt-8 sm:hidden">
          <Link href="/newsletter" className="text-sm font-semibold text-blue-400">
            Full archive →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StoriesGrid;
