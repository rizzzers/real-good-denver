export interface TopicCard {
  emoji: string;
  title: string;
  description: string;
  links?: { label: string; url: string }[];
}

export interface EpisodeTranscript {
  topics: TopicCard[];
  transcript: string;
}

const transcripts: Record<string, EpisodeTranscript> = {};

export function getEpisodeTranscript(slug: string): EpisodeTranscript | null {
  return transcripts[slug] || null;
}
