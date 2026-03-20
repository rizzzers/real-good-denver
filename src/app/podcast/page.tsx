"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Download, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { slugify } from '@/lib/slugify';

interface Episode {
  id: string;
  title: string;
  description: string;
  showNotes?: string;
  audioUrl: string;
  duration: string;
  pubDate: string;
  imageUrl?: string;
}

const PLATFORM_LINKS = [
  { name: 'Spotify', url: 'https://open.spotify.com/show/27VuIWVn2CfSGliuKNXkt7' },
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/real-good-denver/id602890961' },
  { name: 'YouTube', url: 'https://www.youtube.com/@RealGoodDenver' },
];

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  useEffect(() => { fetchEpisodes(); }, []);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-podcast-feed');
      if (error) throw error;
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast({ title: "Error", description: "Failed to load podcast episodes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (currentEpisode?.id === episode.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div ref={heroRef} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-sm font-medium text-background/70 tracking-wide">Top 1% globally ranked podcast</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Real Good Denver<br />
            <span className="text-primary">Podcast.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 mb-10 max-w-xl mx-auto">
            Your weekly dose of Denver&apos;s weirdest, wildest, and most wonderful happenings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {PLATFORM_LINKS.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-background/15 bg-background/5 backdrop-blur-sm text-background/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 text-sm font-medium"
              >
                {platform.name}
              </a>
            ))}
          </div>

          <button
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold px-8 py-4 hover:scale-[1.02] transition-all disabled:opacity-50"
            onClick={() => episodes[0] && handlePlayEpisode(episodes[0])}
            disabled={loading || episodes.length === 0}
          >
            <Play className="mr-2 h-5 w-5" />
            Listen Now
          </button>
        </div>
      </section>

      {currentEpisode && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <PodcastPlayer episode={currentEpisode} isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} />
          </div>
        </div>
      )}

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-5xl mx-auto px-6">
          <EpisodesHeader />

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-background/50">Loading episodes...</span>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-background/50 mb-4">No episodes found.</p>
              <button onClick={fetchEpisodes} className="border border-background/20 text-background/60 hover:text-primary hover:border-primary px-4 py-2 rounded-md transition-colors">
                Retry
              </button>
            </div>
          ) : (
            <div className="divide-y divide-background/10">
              {episodes.map((episode, index) => (
                <EpisodeRow key={episode.id} episode={episode} index={index} currentEpisode={currentEpisode} isPlaying={isPlaying} onPlay={handlePlayEpisode} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

const EpisodesHeader = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Episodes</p>
      <h2 className="text-3xl md:text-5xl font-bold text-background leading-tight">Latest episodes</h2>
    </div>
  );
};

const EpisodeRow = ({ episode, index, currentEpisode, isPlaying, onPlay }: {
  episode: Episode; index: number; currentEpisode: Episode | null; isPlaying: boolean; onPlay: (e: Episode) => void;
}) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const isActive = currentEpisode?.id === episode.id && isPlaying;
  const pubDate = new Date(episode.pubDate);

  return (
    <div ref={ref} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 60}ms` }}>
      <div className="group flex items-start sm:items-center gap-4 sm:gap-6 py-6">
        <div className="flex-shrink-0 w-14 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-background/40">
            {pubDate.toLocaleDateString('en-US', { month: 'short' })}
          </p>
          <p className="text-2xl font-bold text-background/70">
            {pubDate.getDate()}
          </p>
        </div>

        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlay(episode); }}
          className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${
            isActive ? 'border-primary bg-primary/10 text-primary' : 'border-background/15 text-background/40 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/10'
          }`}>
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        <Link href={`/podcast/${slugify(episode.title)}`} className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-background group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
            {episode.title}
          </h3>
        </Link>

        <a href={episode.audioUrl} download className="flex-shrink-0 w-10 h-10 rounded-full border border-background/10 flex items-center justify-center text-background/30 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
