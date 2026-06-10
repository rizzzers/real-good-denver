"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthorBio from '@/components/AuthorBio';
import { SpaTreatmentFinder } from '@/components/SpaTreatmentFinder';
import SuggestionForm from '@/components/SuggestionForm';
import EstesPickSection from '@/components/EstesPickSection';
import TomPickSection from '@/components/TomPickSection';
import PostMap from '@/components/PostMap';
import InstagramPhotoGrid from '@/components/InstagramPhotoGrid';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { posts } from '@/data/posts';

// Matches a "<City>, CO/Colorado" address fragment. Kept in sync with the
// CITY_CO pattern in PostMap.tsx.
const CITY_CO =
  /\b(Denver|Lakewood|Aurora|Westminster|Englewood|Littleton|Edgewater|Arvada|Wheat Ridge|Boulder|Golden|Commerce City|Thornton|Northglenn|Centennial|Glendale|Greenwood Village)\b[^|]*?\b(CO|Colorado)\b/;

// A section counts as an actual place (vs. a "The Verdict" style closing block)
// when it has a real address line: a single line carrying both a "<City>, CO"
// fragment and a 5-digit ZIP. Prose that merely name-drops "Denver ... Colorado"
// across a sentence has no ZIP, so it does not qualify.
const hasAddressLine = (section: string): boolean =>
  section.split('\n').some(line => CITY_CO.test(line) && /\b\d{5}\b/.test(line));

const parseMarkdownContent = (content: string): string => {
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/🥇|🥈|🥉/g, '<span class="text-2xl inline-block mr-1">$&</span>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-6 object-cover" style="max-height:420px;" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity">$1</a>')
    .replace(/(?<![="'(\/])(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(?<![="'(\/])www\.([^\s<"]+)/g, '<a href="https://www.$1" target="_blank" rel="noopener noreferrer">www.$1</a>')
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h2') || trimmed.startsWith('<h3') || trimmed.startsWith('<img')) {
        return trimmed.replace(/\n/g, '<br/>');
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
};

const BAKER_SECTION_EMBEDS: Record<string, string[]> = {
  'ESP HiFi Lounge': ['C4ORz7RPtHw', 'ClT9v32LqxK', 'CeFHGdYldTu'],
  'UCA Colorado': ['DT6lq1RETTO', 'DKiPgH_hiWQ', 'DTWRU3sETry'],
  "Angelo's Taverna": ['DTQlsobiWpI', 'DU07GPwEapz', 'DT_DvIujj1z'],
  'Queen City Collective Coffee': ['DT1fy37jmAc', 'DSna4stDr7S', 'DK19iDrsfYq'],
  'South Broadway Vintage': ['DM8eh3Zyx0x', 'C17uD_rgCHS', 'CoqdRnqutwx'],
};

export default function BestOfDenverPostClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const post = posts.find(p => p.slug === slug);
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal(0.05);

  const isBakerPost = post?.slug === 'best-of-denver-baker';

  // Split content into intro / #1 pick / middle / last pick / closing for all
  // Best of Denver posts. The #1 pick renders as Estes' Pick, the last place
  // section renders as Tom's Pick. "Last place" means the last section that
  // carries a Colorado address, so a trailing "The Verdict" block is left in
  // the closing copy rather than mistaken for a pick.
  const bestOfSections = React.useMemo(() => {
    if (!post || isBakerPost) return null;
    const content = post.fullContent;
    const SEP = '\n\n---\n\n';
    const HEADING = /^#{2,3}\s/;
    const BOLD_ENTRY = /^\*\*[A-Z]/;

    let parts: string[];
    let joiner: string;
    if (content.includes(SEP)) {
      // 1. Posts with --- separator
      parts = content.split(SEP);
      joiner = SEP;
    } else if (/\n\n#{2,3}[\s*]/.test(content)) {
      // 2. No --- separator, ## or ### headings
      parts = content.split(/\n\n(?=#{2,3}[\s*])/);
      joiner = '\n\n';
    } else {
      // 3. Bold-only entries (**Name**)
      parts = content.split(/\n\n(?=\*\*[A-Z])/);
      joiner = '\n\n';
    }

    const isEntry = (p: string) => HEADING.test(p.trim()) || BOLD_ENTRY.test(p.trim());
    const firstIdx = parts.findIndex(isEntry);
    if (firstIdx === -1) return null;

    // Last pick: the last section after the first with a real address line.
    let lastIdx = -1;
    for (let i = parts.length - 1; i > firstIdx; i--) {
      if (hasAddressLine(parts[i])) { lastIdx = i; break; }
    }

    if (lastIdx <= firstIdx) {
      // Only one identifiable pick: keep prior behavior (no Tom's Pick).
      return {
        intro: parts.slice(0, firstIdx).join(joiner),
        firstPick: parts[firstIdx],
        middle: parts.slice(firstIdx + 1).join(joiner),
        lastPick: null as string | null,
        closing: '',
      };
    }

    return {
      intro: parts.slice(0, firstIdx).join(joiner),
      firstPick: parts[firstIdx],
      middle: parts.slice(firstIdx + 1, lastIdx).join(joiner),
      lastPick: parts[lastIdx] as string | null,
      closing: parts.slice(lastIdx + 1).join(joiner),
    };
  }, [post, isBakerPost]);

  if (!post) {
    router.push('/best-of-denver');
    return null;
  }

  const renderBakerContent = () => {
    const sections = post.fullContent.split(/(?=^## )/m);
    return sections.map((section, i) => {
      const rendered = parseMarkdownContent(section);
      const headingMatch = section.match(/^## (.+)$/m);
      const heading = headingMatch?.[1];
      const embedIds = heading ? BAKER_SECTION_EMBEDS[heading] : undefined;
      return (
        <React.Fragment key={i}>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: rendered }} />
          {embedIds && <InstagramPhotoGrid postIds={embedIds} />}
        </React.Fragment>
      );
    });
  };

  const renderedContent = parseMarkdownContent(post.fullContent);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/40" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-pulse-soft" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div ref={heroRef} className={`relative z-10 max-w-3xl mx-auto px-6 pb-16 w-full transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/best-of-denver" className="inline-flex items-center gap-2 text-background/40 hover:text-primary transition-colors mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Best of Denver
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string, index: number) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-background/10 text-background/60 border border-background/10">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-background/40 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {post.slug === 'mile-high-indulgence-guide-denver-wildest-extravagant-spas' && (
        <SpaTreatmentFinder />
      )}

      <section className="py-16 md:py-24 bg-background">
        <div ref={contentRef} className={`max-w-3xl mx-auto px-6 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <SuggestionForm postTitle={post.title} />
          {bestOfSections ? (
            <>
              {bestOfSections.intro && (
                <div className="post-content" dangerouslySetInnerHTML={{ __html: parseMarkdownContent(bestOfSections.intro) }} />
              )}
              <EstesPickSection html={parseMarkdownContent(bestOfSections.firstPick)} />
              {bestOfSections.middle && (
                <div className="post-content" dangerouslySetInnerHTML={{ __html: parseMarkdownContent(bestOfSections.middle) }} />
              )}
              {bestOfSections.lastPick && (
                <TomPickSection html={parseMarkdownContent(bestOfSections.lastPick)} />
              )}
              {bestOfSections.closing && (
                <div className="post-content" dangerouslySetInnerHTML={{ __html: parseMarkdownContent(bestOfSections.closing) }} />
              )}
            </>
          ) : isBakerPost ? (
            renderBakerContent()
          ) : (
            <div className="post-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          )}
          <PostMap content={post.fullContent} />
          <AuthorBio />
        </div>
      </section>

      <section className="bg-foreground py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">Stay in the loop</p>
          <h3 className="text-3xl md:text-4xl font-bold text-background mb-4">Want more Denver gems?</h3>
          <p className="text-background/40 mb-8">
            Subscribe for weekly updates on the best spots, events, and hidden gems Denver has to offer.
          </p>
          <Link href="/newsletter">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold px-8 py-4 text-lg transition-colors">
              Subscribe to Newsletter
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
