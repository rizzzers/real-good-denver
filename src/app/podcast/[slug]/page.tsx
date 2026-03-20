"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink, Download, Clock, Calendar, Headphones, Newspaper, CalendarDays, Star, Mic, LinkIcon, ChevronDown, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getEpisodeTranscript } from '@/data/episodeTranscripts';
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

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const SUBSCRIBE_LINKS = [
  { name: 'Spotify', url: 'https://open.spotify.com/show/27VuIWVn2CfSGliuKNXkt7', bg: 'bg-[#1DB954]', hover: 'hover:bg-[#1ed760]', icon: '🎧' },
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/real-good-denver/id602890961', bg: 'bg-[#9933CC]', hover: 'hover:bg-[#aa44dd]', icon: '🎙️' },
  { name: 'YouTube', url: 'https://www.youtube.com/@RealGoodDenver', bg: 'bg-[#FF0000]', hover: 'hover:bg-[#ff2222]', icon: '▶️' },
];

const BOILERPLATE_PATTERNS = [
  /Follow RGD:/i,
  /YouTube:.*youtube\.com\S*/i,
  /Instagram:.*instagram\.com\S*/i,
  /TikTok:.*tiktok\.com\S*/i,
  /Do you have a Denver event.*tom@kitcaster\.com/i,
  /We're opening up early access.*ready!!/i,
  /Sign up at.*realgooddenver\.com.*ready/i,
  /Music produced by Troy Higgins/i,
  /Goodboytroy\.com/i,
];

interface ParsedSection {
  type: 'intro' | 'guest' | 'news' | 'events' | 'shoutouts' | 'other';
  label: string;
  items: { text: string; href?: string }[];
}

function parseShowNotes(html: string): { intro: string; guest: { name: string; href?: string } | null; sections: ParsedSection[] } {
  if (typeof document === 'undefined') return { intro: '', guest: null, sections: [] };

  // Dynamic import DOMPurify only on client
  const div = document.createElement('div');
  div.innerHTML = html;

  const paragraphs = Array.from(div.querySelectorAll('p'));
  const cleaned = paragraphs.filter(p => {
    const text = p.textContent?.trim() || '';
    if (!text) return false;
    return !BOILERPLATE_PATTERNS.some(pat => pat.test(text));
  });

  let intro = '';
  let guest: { name: string; href?: string } | null = null;
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const sectionHeaders: Record<string, ParsedSection['type']> = {
    'news': 'news', 'events': 'events', 'shoutouts': 'shoutouts', 'shoutout': 'shoutouts',
  };
  const sectionLabels: Record<ParsedSection['type'], string> = {
    news: 'In the News', events: 'Events This Week', shoutouts: 'Shoutouts', guest: 'Featured Guest', intro: '', other: '',
  };

  for (const p of cleaned) {
    const text = p.textContent?.trim() || '';
    const lowerText = text.toLowerCase();
    const matchedSection = Object.keys(sectionHeaders).find(key => lowerText === key);
    if (matchedSection) {
      const type = sectionHeaders[matchedSection];
      currentSection = { type, label: sectionLabels[type], items: [] };
      sections.push(currentSection);
      continue;
    }
    const guestMatch = text.match(/(?:guest|check out our guest)[,:]?\s*(.*)/i);
    if (guestMatch) {
      const link = p.querySelector('a');
      guest = { name: link?.textContent?.trim() || guestMatch[1].trim(), href: link?.href };
      continue;
    }
    if (currentSection) {
      const link = p.querySelector('a');
      if (link) {
        const linkText = link.textContent?.trim() || '';
        const fullText = text;
        const extraText = fullText.replace(linkText, '').trim().replace(/^[-–—@]\s*/, '');
        currentSection.items.push({ text: extraText ? `${linkText} ${extraText}` : linkText, href: link.href });
      } else {
        currentSection.items.push({ text });
      }
    } else if (!intro) {
      intro = p.innerHTML;
    } else {
      intro += ' ' + p.innerHTML;
    }
  }

  return { intro, guest, sections };
}

const SectionIcon = ({ type }: { type: ParsedSection['type'] }) => {
  switch (type) {
    case 'news': return <Newspaper className="h-4 w-4" />;
    case 'events': return <CalendarDays className="h-4 w-4" />;
    case 'shoutouts': return <Star className="h-4 w-4" />;
    default: return <LinkIcon className="h-4 w-4" />;
  }
};

export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-podcast-feed');
        if (error) throw error;
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  const episode = episodes.find(e => slugify(e.title) === slug);

  const parsed = useMemo(() => {
    if (!episode?.showNotes) return null;
    return parseShowNotes(episode.showNotes);
  }, [episode?.showNotes]);

  const transcriptData = useMemo(() => {
    if (!slug) return null;
    return getEpisodeTranscript(slug);
  }, [slug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const val = Number(e.target.value);
    if (audio) { audio.currentTime = val; setCurrentTime(val); }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const val = Number(e.target.value);
    setVolume(val);
    if (audio) audio.volume = val;
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const currentIndex = episode ? episodes.findIndex(e => e.id === episode.id) : -1;
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (!loading && !episode) {
    router.push('/podcast');
    return null;
  }

  if (!episode) return null;

  const pubDate = new Date(episode.pubDate);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-end overflow-hidden bg-foreground pt-28">
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[150px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16 w-full">
          <Link href="/podcast" className="inline-flex items-center gap-2 text-background/40 hover:text-primary transition-colors mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Podcast
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6 text-background/40 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 border border-background/10">
              <Calendar className="h-3 w-3" />
              {pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {episode.duration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 border border-background/10">
                <Clock className="h-3 w-3" />
                {episode.duration}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            {episode.title}
          </h1>

          {parsed?.intro && (
            <p className="text-background/50 text-lg leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: parsed.intro }} />
          )}
        </div>
      </section>

      <section className="bg-foreground border-t border-background/10">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {episode.audioUrl && <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />}

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="range"
                value={currentTime}
                max={duration || 100}
                step={1}
                onChange={handleSeek}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-background/30 mt-1.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button onClick={() => handleSkip(-30)} className="w-8 h-8 rounded-full border border-background/10 flex items-center justify-center text-background/30 hover:text-background hover:border-background/20 transition-all">
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleSkip(30)} className="w-8 h-8 rounded-full border border-background/10 flex items-center justify-center text-background/30 hover:text-background hover:border-background/20 transition-all">
                <SkipForward className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-2 ml-3 w-24">
                <Volume2 className="h-3.5 w-3.5 text-background/30 flex-shrink-0" />
                <input
                  type="range"
                  value={volume}
                  max={1}
                  step={0.05}
                  onChange={handleVolumeChange}
                  className="flex-1 accent-primary"
                />
              </div>
            </div>
            <a href={episode.audioUrl} download className="inline-flex items-center gap-1.5 text-xs text-background/30 hover:text-primary transition-colors">
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-foreground">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Show Notes</p>
          <h2 className="text-2xl md:text-3xl font-bold text-background mb-10">What we covered</h2>

          {transcriptData ? (
            <div className="space-y-4">
              {transcriptData.topics.map((topic, i) => (
                <div key={i} className="rounded-2xl border border-background/10 bg-background/[0.04] p-6 transition-all duration-300 hover:border-background/20">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{topic.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-background mb-2">{topic.title}</h3>
                      <p className="text-background/50 text-[0.95rem] leading-relaxed">{topic.description}</p>
                      {topic.links && topic.links.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {topic.links.map((link, j) => (
                            <a key={j} href={link.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="group flex items-center gap-3 text-background/40 hover:text-primary transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium uppercase tracking-widest">
                    {showTranscript ? 'Hide' : 'View'} Full Transcript
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showTranscript ? 'rotate-180' : ''}`} />
                </button>

                {showTranscript && (
                  <div className="mt-6 rounded-2xl border border-background/10 bg-background/[0.03] p-6 md:p-8">
                    <div className="prose prose-invert max-w-none">
                      {transcriptData.transcript.split('\n\n').map((paragraph, i) => {
                        const speakerMatch = paragraph.match(/^(Ryan|Tom|Carmen|Don|Ryan & Tom):\s*([\s\S]*)/);
                        if (speakerMatch) {
                          return (
                            <p key={i} className="text-background/50 text-[0.9rem] leading-relaxed mb-4">
                              <span className="font-semibold text-background/70">{speakerMatch[1]}:</span>{' '}
                              {speakerMatch[2]}
                            </p>
                          );
                        }
                        return <p key={i} className="text-background/50 text-[0.9rem] leading-relaxed mb-4">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : parsed ? (
            <div className="space-y-6">
              {parsed.guest && (
                <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-widest text-primary">Featured Guest</p>
                  </div>
                  <h3 className="text-xl font-bold text-background mb-1">{parsed.guest.name}</h3>
                  {parsed.guest.href && (
                    <a href={parsed.guest.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2">
                      Visit website <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {parsed.sections.map((section, i) => (
                section.items.length > 0 && (
                  <div key={i} className="rounded-2xl border border-background/10 bg-background/[0.04] p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/50">
                        <SectionIcon type={section.type} />
                      </div>
                      <p className="text-xs font-medium uppercase tracking-widest text-background/50">{section.label}</p>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j}>
                          {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer"
                              className="group flex items-start gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-background/[0.04] transition-colors">
                              <ExternalLink className="h-4 w-4 text-background/30 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
                              <span className="text-background/60 group-hover:text-primary transition-colors text-[0.95rem] leading-snug">{item.text}</span>
                            </a>
                          ) : (
                            <span className="text-background/40 text-[0.95rem] leading-snug block py-2.5 px-3 -mx-3">{item.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-background/50 leading-relaxed whitespace-pre-line">{episode.description}</p>
          )}
        </div>
      </section>

      <section className="bg-foreground border-t border-background/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background/10 mb-4">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-background mb-2">Never miss an episode</h3>
            <p className="text-background/40">Subscribe on your favorite platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {SUBSCRIBE_LINKS.map((platform) => (
              <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl text-sm font-bold text-white transition-all duration-300 ${platform.bg} ${platform.hover} hover:scale-105 hover:shadow-lg`}>
                <span className="text-base">{platform.icon}</span>
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {(prevEpisode || nextEpisode) && (
        <section className="bg-foreground py-16">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-8">More episodes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nextEpisode && (
                <Link href={`/podcast/${slugify(nextEpisode.title)}`} className="group rounded-2xl border border-background/10 bg-background/[0.03] p-6 hover:border-primary/30 transition-all duration-300">
                  <p className="text-xs text-background/40 mb-2">Next Episode</p>
                  <h3 className="text-lg font-semibold text-background group-hover:text-primary transition-colors line-clamp-2 leading-snug">{nextEpisode.title}</h3>
                  <p className="text-sm text-background/30 mt-2">{new Date(nextEpisode.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </Link>
              )}
              {prevEpisode && (
                <Link href={`/podcast/${slugify(prevEpisode.title)}`} className="group rounded-2xl border border-background/10 bg-background/[0.03] p-6 hover:border-primary/30 transition-all duration-300">
                  <p className="text-xs text-background/40 mb-2">Previous Episode</p>
                  <h3 className="text-lg font-semibold text-background group-hover:text-primary transition-colors line-clamp-2 leading-snug">{prevEpisode.title}</h3>
                  <p className="text-sm text-background/30 mt-2">{new Date(prevEpisode.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
