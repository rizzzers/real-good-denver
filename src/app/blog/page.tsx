import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: "Denver's best local spots, sourced from real Denverites on Reddit.",
};

export default function BlogIndex() {
  return (
    <div className="relative min-h-screen">
      <Navigation />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">The Blog</h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Denver&apos;s best spots, sourced from real locals on Reddit.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-52 w-full bg-muted">
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    <span className="text-primary font-medium">{post.author}</span>
                  </p>
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.intro[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
