import { NextRequest, NextResponse } from 'next/server';
import { searchSubreddit, fetchPostComments, delay } from '@/lib/reddit';
import { extractBusinesses } from '@/lib/claude';
import { getCached, setCached } from '@/lib/cache';
import { SearchResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
    }

    const trimmed = keyword.trim().toLowerCase();
    const cacheKey = `search:${trimmed}`;

    // Check cache
    const cached = getCached<SearchResult>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Reddit search
    const posts = await searchSubreddit(trimmed, 25);
    const topPosts = posts.slice(0, 10);

    // Fetch comments with delay between requests
    const postsWithComments = [];
    for (const post of topPosts) {
      const comments = await fetchPostComments(post.id, 30);
      postsWithComments.push({ ...post, comments });
      await delay(500);
    }

    if (postsWithComments.length === 0) {
      return NextResponse.json({ error: 'No Reddit posts found for that keyword' }, { status: 404 });
    }

    // Claude extraction
    const businesses = await extractBusinesses(trimmed, postsWithComments);

    const result: SearchResult = {
      keyword: trimmed,
      businesses,
      cachedAt: Date.now(),
    };

    setCached(cacheKey, result);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'Anthropic API key is missing. Add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }
    console.error('[/api/search]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
