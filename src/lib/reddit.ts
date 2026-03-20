import { RedditPost, RedditComment } from '@/types';

const BASE_URL = 'https://www.reddit.com';
const USER_AGENT = 'real-good-denver/1.0 (blog aggregator)';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function redditFetch(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 0 },
    });
    if (res.status === 429) {
      const wait = (i + 1) * 2000;
      await delay(wait);
      continue;
    }
    return res;
  }
  throw new Error('Reddit rate limit exceeded after retries');
}

export async function searchSubreddit(keyword: string, limit = 25): Promise<RedditPost[]> {
  const queries = [keyword, `best ${keyword}`];
  const seen = new Set<string>();
  const posts: RedditPost[] = [];

  for (const q of queries) {
    const url = `${BASE_URL}/r/Denver/search.json?q=${encodeURIComponent(q)}&restrict_sr=1&sort=relevance&limit=${limit}`;
    const res = await redditFetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    const children = data?.data?.children ?? [];
    for (const child of children) {
      const p = child.data;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        posts.push({
          id: p.id,
          title: p.title,
          selftext: p.selftext ?? '',
          score: p.score ?? 0,
          num_comments: p.num_comments ?? 0,
          url: p.url ?? '',
          permalink: p.permalink ?? '',
          created_utc: p.created_utc ?? 0,
          author: p.author ?? '',
        });
      }
    }
  }

  return posts.sort((a, b) => b.score - a.score);
}

export async function fetchPostComments(postId: string, limit = 30): Promise<RedditComment[]> {
  const url = `${BASE_URL}/r/Denver/comments/${postId}.json?limit=${limit}&sort=top`;
  const res = await redditFetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const commentListing = data?.[1]?.data?.children ?? [];
  const comments: RedditComment[] = [];

  for (const child of commentListing) {
    const c = child.data;
    if (c.body && c.body !== '[deleted]' && c.body !== '[removed]') {
      comments.push({
        id: c.id,
        body: c.body,
        score: c.score ?? 0,
        author: c.author ?? '',
      });
    }
  }

  return comments.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { delay };
