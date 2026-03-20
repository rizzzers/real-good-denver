import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPost } from '@/lib/posts';

export const metadata = {
  title: 'The Best Nachos in Denver (That Actually Layer the Damn Cheese) | Real Good Denver',
  description: "Denver's best nacho spots, ranked by cheese-per-chip ratio. These kitchens actually layer the damn cheese.",
};

export default function NachosPost() {
  const post = getPost('best-nachos-denver');
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-orange-500 font-bold text-lg hover:text-orange-400 transition-colors">
            Real Good Denver
          </Link>
          <span className="text-zinc-600 text-sm">/</span>
          <Link href="/blog" className="text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
            Blog
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Featured Image */}
        <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-8 bg-zinc-800">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Title & Date */}
        <p className="text-xs text-zinc-500 mb-3">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          {' · By '}
          <span className="text-orange-500">{post.author}</span>
          {' · Sourced from r/Denver'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Intro */}
        <div className="space-y-4 mb-12">
          {post.intro.map((p, i) => (
            <p key={i} className="text-zinc-300 leading-relaxed text-[17px]">
              {p}
            </p>
          ))}
        </div>

        <hr className="border-zinc-800 mb-12" />

        {/* Restaurant Entries */}
        <div className="space-y-14">
          {post.restaurants.map((r) => (
            <section key={r.rank}>
              {/* Restaurant Image */}
              {r.imageUrl && (
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-5 bg-zinc-800">
                  <Image
                    src={r.imageUrl}
                    alt={r.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Name & Meta */}
              <h2 className="text-xl font-bold text-zinc-100 mb-1">
                {r.rank}. {r.name}
              </h2>
              <p className="text-sm text-zinc-500 mb-1">{r.address}</p>
              <p className="text-sm text-orange-500/80 italic mb-5">{r.neighborhood}</p>

              {/* Body */}
              <div className="space-y-4">
                {r.body.map((p, i) => (
                  <p key={i} className="text-zinc-300 leading-relaxed text-[17px]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Maps Link */}
              <a
                href={r.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-orange-500 hover:text-orange-400 transition-colors"
              >
                Google Maps →
              </a>

              <hr className="border-zinc-800 mt-10" />
            </section>
          ))}
        </div>

        {/* Outro */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">The Final Word on Denver Nachos</h2>
          {post.outro.map((p, i) => (
            <p key={i} className="text-zinc-300 leading-relaxed text-[17px]">
              {p}
            </p>
          ))}
        </div>

        <p className="mt-10 text-xs text-zinc-600 italic">Sourced from r/Denver · Real Good Denver</p>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-zinc-800">
          <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to all posts
          </Link>
        </div>
      </article>
    </main>
  );
}
