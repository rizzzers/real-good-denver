"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Send } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { newsletterIssues } from '@/data/newsletterIssues';

export default function NewsletterClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-form-submission', {
        body: { type: 'newsletter', name, email }
      });
      if (error) throw error;
      setSubmitted(true);
      setName('');
      setEmail('');
      toast({ title: "You're in!", description: "Welcome to Real Good Denver." });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: "Error", description: "There was a problem. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div ref={heroRef} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-sm font-medium text-background/70 tracking-wide">Every Wednesday in your inbox</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            The newsletter<br />
            <span className="text-primary">Denver reads.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 mb-10 max-w-xl mx-auto">
            Events, news, jobs, and the good stuff worth knowing, curated weekly by people who actually live here.
          </p>

          <div className="max-w-lg mx-auto">
            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Send className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-lg font-medium text-background">Check your inbox, you&apos;re in.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} required
                  className="flex-1 h-12 bg-background/10 border border-background/15 text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl px-3" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="flex-1 h-12 bg-background/10 border border-background/15 text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl px-3" />
                <button type="submit" disabled={isSubmitting}
                  className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 flex-shrink-0 flex items-center gap-2">
                  {isSubmitting
                    ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    : <>Subscribe <ArrowRight className="ml-2 h-4 w-4" /></>
                  }
                </button>
              </form>
            )}
            <p className="text-xs text-background/30 mt-4">Free forever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <ArchiveHeader />
          <div className="divide-y divide-border">
            {newsletterIssues.map((issue, index) => (
              <IssueRow key={issue.slug} issue={issue} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const ArchiveHeader = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Archive</p>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Past issues</h2>
    </div>
  );
};

const IssueRow = ({ issue, index }: { issue: typeof newsletterIssues[0]; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 60}ms` }}>
      <Link href={`/newsletter/${issue.slug}`} className="group flex items-start sm:items-center gap-4 sm:gap-6 py-6">
        <div className="flex-shrink-0 w-14 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {(() => { const [y, m, d] = issue.date.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short' }); })()}
          </p>
          <p className="text-2xl font-bold text-foreground/70">
            {issue.date.split('-')[2].replace(/^0/, '')}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
            {issue.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1 hidden sm:block">{issue.description}</p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </div>
  );
};
