import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/claude';
import { BusinessRecommendation } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { keyword, businesses } = await req.json();
    if (!keyword || !Array.isArray(businesses) || businesses.length === 0) {
      return NextResponse.json(
        { error: 'keyword and businesses[] are required' },
        { status: 400 }
      );
    }

    const blogPost = await generateBlogPost(keyword as string, businesses as BusinessRecommendation[]);
    return NextResponse.json(blogPost);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'Anthropic API key is missing. Add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }
    console.error('[/api/generate]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
