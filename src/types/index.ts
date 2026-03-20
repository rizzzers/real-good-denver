export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  url: string;
  permalink: string;
  created_utc: number;
  author: string;
}

export interface RedditComment {
  id: string;
  body: string;
  score: number;
  author: string;
}

export interface BusinessRecommendation {
  name: string;
  neighborhood: string;
  mentions: number;
  totalScore: number;
  redditSnippets: string[];
  mapsUrl?: string;
}

export interface SearchResult {
  keyword: string;
  businesses: BusinessRecommendation[];
  cachedAt?: number;
}

export interface BlogEntry {
  rank: number;
  name: string;
  neighborhood: string;
  body: string;
  mapsUrl: string;
}

export interface BlogPost {
  title: string;
  intro: string;
  entries: BlogEntry[];
  outro: string;
  markdown: string;
}
