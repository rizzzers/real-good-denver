"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Star, Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { posts, categories } from '@/data/posts';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function BestOfDenverClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filteredPosts = sortedPosts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .filter(post => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.tags.some((t: string) => t.toLowerCase().includes(q));
    });
  const featuredPost = selectedCategory === 'all' && !searchQuery.trim() ? filteredPosts[0] : null;
  const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Best of<br /><span className="text-accent">Denver.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            Hidden gems, local favorites, and must-visit spots, curated by people who actually live here.
          </p>
        </div>
      </section>

      <div className="bg-background border-b border-border sticky top-[72px] z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-10 rounded-full bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring px-4"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: { id: string; name: string }) => (
              <button key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {featuredPost && <FeaturedRow post={featuredPost} />}

      <section className="py-16 md:py-24 bg-foreground">
        <div className="max-w-5xl mx-auto px-6">
          <PostsList posts={listPosts} selectedCategory={selectedCategory} categories={categories} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const FeaturedRow = ({ post }: { post: typeof posts[0] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="py-16 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
            <Star className="h-4 w-4" /> Featured story
          </p>
          <Link href={`/best-of-denver/post/${post.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
              <div className="relative overflow-hidden">
                <img src={post.image} alt={post.title} width={800} height={600} loading="lazy" className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-card">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

const PostsList = ({ posts: displayPosts, selectedCategory, categories }: { posts: typeof posts; selectedCategory: string; categories: { id: string; name: string }[] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Stories</p>
          <h2 className="text-3xl md:text-5xl font-bold text-background leading-tight">
            {selectedCategory === 'all' ? 'All stories' : `${categories.find((c: { id: string; name: string }) => c.id === selectedCategory)?.name}`}
          </h2>
        </div>
        <span className="text-sm text-background/40">{displayPosts.length} {displayPosts.length === 1 ? 'story' : 'stories'}</span>
      </div>

      <div className="divide-y divide-background/10">
        {displayPosts.map((post, index) => (
          <PostRow key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

const PostRow = ({ post, index }: { post: typeof posts[0]; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 60}ms` }}>
      <Link href={`/best-of-denver/post/${post.slug}`} className="group flex items-start sm:items-center gap-4 sm:gap-6 py-6">
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
          <img src={post.image} alt={post.title} width={160} height={160} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">{post.category}</span>
            <span className="text-background/20">•</span>
            <span className="text-xs text-background/40">{post.readTime}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-background group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">{post.title}</h3>
          <p className="text-sm text-background/40 mt-1 line-clamp-1 hidden sm:block">{post.excerpt}</p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-background/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4 text-background/30 group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </div>
  );
};
