import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getPost } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'The Best Nachos in Denver (That Actually Layer the Damn Cheese)',
  description: "Denver's best nacho spots, ranked by cheese-per-chip ratio. These kitchens actually layer the damn cheese.",
};

export default function NachosPost() {
  const post = getPost('best-nachos-denver');
  if (!post) notFound();

  return (
    <div className="relative min-h-screen">
      <Navigation />

      <main className="pt-28 pb-20">
        <article className="max-w-2xl mx-auto px-6">
          {/* Featured Image */}
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-muted">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span>Nachos</span>
          </div>

          {/* Title & Byline */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · By '}
            <span className="text-primary font-medium">{post.author}</span>
            {' · Sourced from r/Denver'}
          </p>

          {/* Intro */}
          <div className="space-y-5 mb-12">
            {post.intro.map((p, i) => (
              <p key={i} className="text-foreground leading-relaxed text-[17px]">{p}</p>
            ))}
          </div>

          <hr className="border-border mb-12" />

          {/* Restaurant Entries */}
          <div className="space-y-16">
            {post.restaurants.map((r) => (
              <section key={r.rank}>
                {r.imageUrl && (
                  <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-6 bg-muted">
                    <Image
                      src={r.imageUrl}
                      alt={r.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <h2 className="text-xl font-bold text-foreground mb-1">
                  {r.rank}. {r.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-0.5">{r.address}</p>
                <p className="text-sm font-medium text-primary mb-5">{r.neighborhood}</p>

                <div className="space-y-4">
                  {r.body.map((p, i) => (
                    <p key={i} className="text-foreground leading-relaxed text-[17px]">{p}</p>
                  ))}
                </div>

                <a
                  href={r.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-primary hover:underline font-medium"
                >
                  Google Maps →
                </a>

                <hr className="border-border mt-12" />
              </section>
            ))}
          </div>

          {/* Outro */}
          <div className="mt-12 space-y-5">
            <h2 className="text-2xl font-bold text-foreground mb-6">The Final Word on Denver Nachos</h2>
            {post.outro.map((p, i) => (
              <p key={i} className="text-foreground leading-relaxed text-[17px]">{p}</p>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground italic">Sourced from r/Denver · Real Good Denver</p>

          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
