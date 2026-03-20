import Link from 'next/link';
import Image from 'next/image';
import { posts } from '@/lib/posts';

export const metadata = {
  title: 'Blog | Real Good Denver',
  description: 'The best local spots in Denver, sourced from real Denverites on Reddit.',
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-orange-500 font-bold text-lg hover:text-orange-400 transition-colors">
            Real Good Denver
          </Link>
          <span className="text-zinc-600 text-sm">/ Blog</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">The Blog</h1>
        <p className="text-zinc-500 mb-10">Denver's best spots, sourced from real locals on Reddit.</p>

        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-colors"
            >
              <div className="relative h-52 w-full bg-zinc-800">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-zinc-500 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}
                  <span className="text-orange-500/70">{post.author}</span>
                </p>
                <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-400 line-clamp-3">{post.intro[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
