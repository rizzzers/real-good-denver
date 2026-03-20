import Anthropic from '@anthropic-ai/sdk';
import { RedditPost, RedditComment, BusinessRecommendation, BlogPost } from '@/types';
import { generateMapsUrl } from './maps';

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey: key });
}

export async function extractBusinesses(
  keyword: string,
  posts: (RedditPost & { comments?: RedditComment[] })[]
): Promise<BusinessRecommendation[]> {
  const client = getClient();

  const content = posts
    .slice(0, 15)
    .map((p) => {
      const commentText = (p.comments ?? [])
        .slice(0, 20)
        .map((c) => `  - [+${c.score}] ${c.body.slice(0, 300)}`)
        .join('\n');
      return `POST (score:${p.score}): ${p.title}\n${p.selftext.slice(0, 500)}\nCOMMENTS:\n${commentText}`;
    })
    .join('\n\n---\n\n');

  const systemPrompt = `You are a data extraction assistant. Your job is to parse Reddit posts and comments about "${keyword}" in Denver, Colorado, and identify real, specific local businesses that are mentioned or recommended.

Extract exactly 11 businesses (or fewer if fewer than 11 are clearly mentioned). For each business return:
- name: exact business name as mentioned
- neighborhood: Denver neighborhood (Capitol Hill, RiNo, LoHi, Stapleton, etc.) or empty string if unknown
- mentions: count of distinct mentions across posts/comments
- totalScore: sum of Reddit scores of posts/comments that mention this business
- redditSnippets: array of 2-3 short (under 100 chars) verbatim or near-verbatim quotes from the data that mention this business

Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Example:
[{"name":"Tacos Acambaro","neighborhood":"Federal Blvd","mentions":7,"totalScore":234,"redditSnippets":["best al pastor in the city","cash only but worth it"]}]`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Here is the Reddit data for "${keyword}" in r/Denver:\n\n${content}\n\nExtract the top 11 businesses as JSON.`,
      },
    ],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let businesses: BusinessRecommendation[] = JSON.parse(cleaned);
  businesses = businesses.map((b) => ({
    ...b,
    mapsUrl: generateMapsUrl(b.name, b.neighborhood),
  }));

  return businesses;
}

export async function generateBlogPost(
  keyword: string,
  businesses: BusinessRecommendation[]
): Promise<BlogPost> {
  const client = getClient();

  const businessList = businesses
    .map((b, i) => `${i + 1}. ${b.name} (${b.neighborhood || 'Denver'}) — snippets: ${b.redditSnippets.join(' | ')}`)
    .join('\n');

  const systemPrompt = `You write for a Denver local blog. Your voice is deadpan, gritty, and authentic. Slightly cynical but not mean. You make direct statements. You reference real Denver things: the altitude, the weird weather, parking nightmares, which neighborhoods have changed, I-25. You never say "artisanal", "craft", "exceptional culinary journey", or anything that sounds like a Yelp review written by a marketing intern.

You do say things like: "Their green chile will ruin you. That's a fact." Or: "It's not much to look at. Order the carnitas." Or: "Yes, it gets crowded. Go anyway." You acknowledge real downsides. Your entries feel like insider knowledge, not a press release.

Return ONLY valid JSON. No markdown, no code fences. The structure must be exactly:
{
  "title": "string — punchy, specific, no clickbait",
  "intro": "string — 2-3 sentences, sets the tone, mentions Denver specifically",
  "entries": [
    {
      "rank": number,
      "name": "string",
      "neighborhood": "string",
      "body": "string — 3-5 sentences in Denver voice about this place"
    }
  ],
  "outro": "string — 2-3 sentences closing, maybe a dig at tourists or chain restaurants"
}`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Write a blog post about the best ${keyword} in Denver. Use these businesses ranked by Reddit consensus:\n\n${businessList}\n\nReturn the blog post as JSON.`,
      },
    ],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Build full markdown string
  const entries: BlogPost['entries'] = (parsed.entries ?? []).map((e: BlogPost['entries'][0], i: number) => {
    const biz = businesses[i];
    return {
      rank: e.rank ?? i + 1,
      name: e.name,
      neighborhood: e.neighborhood,
      body: e.body,
      mapsUrl: biz?.mapsUrl ?? generateMapsUrl(e.name, e.neighborhood),
    };
  });

  const markdown = buildMarkdown(parsed.title, parsed.intro, entries, parsed.outro);

  return {
    title: parsed.title,
    intro: parsed.intro,
    entries,
    outro: parsed.outro,
    markdown,
  };
}

function buildMarkdown(
  title: string,
  intro: string,
  entries: BlogPost['entries'],
  outro: string
): string {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(intro);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const e of entries) {
    lines.push(`## ${e.rank}. ${e.name}`);
    lines.push(`*${e.neighborhood}*`);
    lines.push('');
    lines.push(e.body);
    lines.push('');
    lines.push(`[Google Maps](${e.mapsUrl})`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(outro);
  lines.push('');
  lines.push('*Sourced from r/Denver*');

  return lines.join('\n');
}
