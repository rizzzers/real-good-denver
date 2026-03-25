"use client";

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const externalResources = [
  {
    title: "Events & Activities",
    links: [
      { name: "Free Denver Events This Week", url: "https://www.westword.com/arts/free-things-to-do-in-denver-20764019" },
      { name: "Denver Family-Friendly Events", url: "https://www.denver.org/blog/post/denver-events-this-weekend/" },
      { name: "Denver Arts & Culture Events", url: "https://www.denver.org/blog/post/denver-events-this-weekend/" },
      { name: "Eventbrite Denver", url: "https://www.eventbrite.com/ttd/co--denver/" },
      { name: "Meetup Denver", url: "https://www.meetup.com/find/us--co--denver/" }
    ]
  },
  {
    title: "Sports & Entertainment",
    links: [
      { name: "Denver EDM Schedule", url: "https://19hz.info/eventlisting_Denver.php" },
      { name: "Denver Sports Events This Week", url: "https://www.ticketmaster.com/discover/sports/denver" },
      { name: "Denver Museum Exhibitions", url: "https://www.denver.org/blog/post/denver-events-this-weekend/" }
    ]
  },
  {
    title: "Outdoor & Recreation",
    links: [
      { name: "Colorado Parks & Wildlife Events", url: "https://cpw.state.co.us/events" },
      { name: "Colorado Snow Conditions", url: "https://www.weather.gov/bou/winter" }
    ]
  },
  {
    title: "Community & Food",
    links: [
      { name: "r/Denver", url: "https://www.reddit.com/r/Denver/" },
      { name: "Denver Food", url: "https://www.reddit.com/r/denverfood/" },
      { name: "Denver Volunteer Opportunities", url: "https://www.volunteermatch.org/search/orgs.jsp?l=Denver" }
    ]
  }
];

export default function ResourcesClient() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Denver<br /><span className="text-accent">resources.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            Direct access to Denver&apos;s best events, activities, and community resources.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <ResourcesGrid resources={externalResources} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SuggestCTA />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const ResourcesGrid = ({ resources }: { resources: { title: string; links: { name: string; url: string }[] }[] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Quick links</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">What&apos;s happening in Denver</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {resources.map((category, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-foreground mb-5">{category.title}</h3>
            <div className="space-y-2">
              {category.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-border text-sm text-foreground hover:bg-muted hover:border-primary/20 transition-all duration-200 group">
                  <span>{link.name}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SuggestCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">Need something specific?</h2>
      <p className="text-background/50 mb-8">Can&apos;t find what you&apos;re looking for? Send us a suggestion.</p>
      <a href="mailto:ryan@ryanestes.info?subject=Here's a resource for Real Good Denver"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200">
        Suggest a Resource
      </a>
    </div>
  );
};
