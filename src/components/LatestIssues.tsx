"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { newsletterIssues } from "@/data/newsletterIssues";

const LatestIssues = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const displayIssues = newsletterIssues.slice(0, 5);

  return (
    <section className="py-24 md:py-32 bg-foreground">
      <div className="max-w-5xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">From the archive</p>
            <h2 className="text-3xl md:text-5xl font-bold text-background leading-tight">Recent issues</h2>
          </div>
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-sm font-medium text-background/60 hover:text-primary transition-colors group">
            View all issues
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="divide-y divide-background/10">
          {displayIssues.map((issue, index) => (
            <IssueRow key={issue.slug} issue={issue} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const IssueRow = ({ issue, index }: { issue: typeof newsletterIssues[0]; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link href={`/newsletter/${issue.slug}`} className="group flex items-start sm:items-center gap-4 sm:gap-6 py-6">
        <div className="flex-shrink-0 w-14 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-background/40">
            {(() => { const [y, m, d] = issue.date.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short" }); })()}
          </p>
          <p className="text-2xl font-bold text-background/70">
            {issue.date.split("-")[2].replace(/^0/, "")}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-background group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
            {issue.title}
          </h3>
          <p className="text-sm text-background/40 mt-1 line-clamp-1 hidden sm:block">{issue.description}</p>
        </div>

        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-background/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4 text-background/30 group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </div>
  );
};

export default LatestIssues;
