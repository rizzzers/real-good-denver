/**
 * draft-post.ts
 *
 * Drafts a Best of Denver post for a given slug.
 *
 * Pipeline:
 *   1. Fetch Reddit data (with full metadata for quote sourcing)
 *   2. Ask Claude for candidate restaurant names (~15)
 *   3. Verify each candidate via Google Places API:
 *        - Checks existence, business_status, address, website
 *        - Drops CLOSED_PERMANENTLY / CLOSED_TEMPORARILY / not-found
 *   4. Run URL liveness check on each verified website
 *   5. Gate: if < 7 restaurants survive, fail loudly
 *   6. Generate post content with Claude, supplying verified data verbatim
 *   7. Post-process quotes: match each > blockquote against Reddit scrape data;
 *        demote to paraphrase if source cannot be found
 *   8. Generate hero image via gpt-image-1
 *   9. Save draft to scripts/drafts/{slug}.json
 *
 * Usage:
 *   npx tsx scripts/draft-post.ts <slug>
 *   npx tsx scripts/draft-post.ts <slug> --pre-verified scripts/verified/<slug>.json
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *   GOOGLE_PLACES_API_KEY   (not needed when --pre-verified is used)
 *   OPENAI_API_KEY          (optional; skips image generation if absent)
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QueueEntry {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  scheduledFor: string | null;
  status: "pending" | "published" | "failed";
  season: "summer" | "fall" | "winter" | null;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  fullContent: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  tags: string[];
}

export interface VerifiedPlace {
  name: string;
  formatted_address: string;
  website: string | null;
  website_live: boolean;
  business_status: string;
  place_id: string;
}

interface DroppedRestaurant {
  name: string;
  reason: string;
  details?: string;
}

interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  permalink: string;
  id: string;
  author: string;
  created_utc: number;
  num_comments: number;
  subreddit: string;
}

interface RedditComment {
  body: string;
  author: string;
  score: number;
  created_utc: number;
  permalink: string;
  subreddit: string;
  id: string;
}

interface RedditAllData {
  posts: RedditPost[];
  comments: RedditComment[];
}

export interface QuoteSource {
  quote: string;
  permalink: string;
  author: string;
  created_utc: number;
  score: number;
  subreddit: string;
}

// ---------------------------------------------------------------------------
// Reddit — with full metadata for quote sourcing
// ---------------------------------------------------------------------------

async function fetchRedditSearch(
  query: string,
  subreddit: string
): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=top&t=all&limit=15&restrict_sr=on`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "RealGoodDenver-AutoPost/1.0 (contact: ryan@ryanestes.info)",
      },
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    return (data?.data?.children || []).map((c: any) => ({
      ...c.data,
      subreddit,
      permalink: c.data.permalink || "",
    })) as RedditPost[];
  } catch {
    return [];
  }
}

async function fetchRedditComments(
  subreddit: string,
  postId: string,
  postPermalink: string
): Promise<RedditComment[]> {
  const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json?limit=25&sort=top`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "RealGoodDenver-AutoPost/1.0 (contact: ryan@ryanestes.info)",
      },
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    return (data?.[1]?.data?.children || [])
      .map((c: any) => c.data)
      .filter(
        (d: any) =>
          d.body && d.body !== "[deleted]" && d.body !== "[removed]" && d.body.length > 20
      )
      .slice(0, 15)
      .map((d: any) => ({
        body: d.body,
        author: d.author || "[unknown]",
        score: d.score || 0,
        created_utc: d.created_utc || 0,
        permalink: d.permalink
          ? `https://www.reddit.com${d.permalink}`
          : `https://www.reddit.com${postPermalink}`,
        subreddit: d.subreddit || subreddit,
        id: d.id,
      })) as RedditComment[];
  } catch {
    return [];
  }
}

async function gatherRedditData(
  slug: string,
  title: string
): Promise<{ contextText: string; allData: RedditAllData }> {
  const topicKeyword = title
    .replace(/Best |in Denver.*|:.*|\(.*\)/gi, "")
    .trim();

  const [denverPosts, denverFoodPosts] = await Promise.all([
    fetchRedditSearch(topicKeyword, "Denver"),
    fetchRedditSearch(topicKeyword, "DenverFood"),
  ]);

  const allPosts = [...denverPosts, ...denverFoodPosts]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const commentResults = await Promise.all(
    allPosts
      .slice(0, 3)
      .map((p) =>
        fetchRedditComments(
          p.subreddit,
          p.id,
          p.permalink
        )
      )
  );
  const allComments: RedditComment[] = commentResults.flat();

  // Build context text — include full permalink metadata so Claude can cite sources
  const lines: string[] = [];
  lines.push(`=== Reddit Community Data: ${topicKeyword} ===\n`);
  allPosts.forEach((p, i) => {
    const date = new Date(p.created_utc * 1000).toISOString().split("T")[0];
    lines.push(
      `POST ${i + 1} [score:${p.score}] [r/${p.subreddit}] [${date}]`
    );
    lines.push(`u/${p.author} | https://www.reddit.com${p.permalink}`);
    lines.push(`Title: ${p.title}`);
    if (p.selftext && p.selftext.length > 20)
      lines.push(`Body: ${p.selftext.slice(0, 500)}`);
    lines.push("");
  });

  if (allComments.length > 0) {
    lines.push(`\n=== TOP COMMENTS (for direct quotes — use verbatim text only) ===`);
    allComments.forEach((c) => {
      const date = new Date(c.created_utc * 1000).toISOString().split("T")[0];
      lines.push(`[score:${c.score}] u/${c.author} [${date}] | ${c.permalink}`);
      lines.push(`"${c.body.slice(0, 400)}"`);
      lines.push("");
    });
  }

  // Reddit health summary — shows what raw material Claude gets to work with
  console.log(`\n  [reddit] Top posts fetched:`);
  allPosts.slice(0, 5).forEach((p, i) => {
    const date = new Date(p.created_utc * 1000).toISOString().split("T")[0];
    console.log(`    ${i + 1}. [${p.score}pts] r/${p.subreddit} | ${date} | ${p.title.slice(0, 70)}`);
  });

  if (allComments.length > 0) {
    console.log(`  [reddit] Top comments fetched (${allComments.length} total):`);
    const topComments = [...allComments]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    topComments.forEach((c, i) => {
      console.log(
        `    ${i + 1}. [${c.score}pts] u/${c.author}: "${c.body.replace(/\n/g, " ").slice(0, 100)}"`
      );
    });
  } else {
    console.log(`  [reddit] WARNING: No comments fetched — Reddit may have rate-limited or posts have no comments`);
  }

  return {
    contextText: lines.join("\n"),
    allData: { posts: allPosts, comments: allComments },
  };
}

// ---------------------------------------------------------------------------
// Phase 1: Candidate restaurant names from Claude
// ---------------------------------------------------------------------------

async function getCandidateRestaurants(
  entry: QueueEntry,
  redditContext: string,
  anthropic: Anthropic
): Promise<string[]> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a Denver local food expert. List 15 to 18 restaurant names in Denver known for: ${entry.title}

Include a mix of well-known institutions and neighborhood gems. Only include places you are highly confident actually exist as Denver-area restaurants.

Reddit mentions for additional ideas:
${redditContext.slice(0, 2000)}

Output ONLY a JSON array of strings. No explanation, no numbering.
Example: ["Restaurant Name 1", "Restaurant Name 2"]`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
  try {
    // Strip any text before the first [ and after the last ]
    const jsonStr = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed)
      ? parsed.filter((n: any) => typeof n === "string").slice(0, 18)
      : [];
  } catch {
    // Fallback: extract quoted strings
    return (text.match(/"([^"]+)"/g) || [])
      .map((m) => m.replace(/"/g, ""))
      .slice(0, 18);
  }
}

// ---------------------------------------------------------------------------
// Google Places API
// ---------------------------------------------------------------------------

interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  business_status?: string;
  user_ratings_total?: number;
}

async function queryGooglePlaces(
  name: string,
  apiKey: string
): Promise<PlaceSearchResult | null> {
  const query = encodeURIComponent(`${name} Denver CO`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data: any = await res.json();
    if (data.status === "REQUEST_DENIED") {
      throw new Error(
        `Google Places API denied: ${data.error_message || "check your API key"}`
      );
    }
    if (data.status !== "OK" || !data.results?.length) return null;
    // Filter to Colorado results, then sort by user_ratings_total so we get
    // the most-reviewed (typically most central / flagship) branch of chains.
    const coResults = (data.results as any[]).filter(
      (r) => r.formatted_address?.includes(", CO")
    );
    if (coResults.length === 0) return null;
    coResults.sort(
      (a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0)
    );
    const r = coResults[0];
    return {
      place_id: r.place_id,
      name: r.name,
      formatted_address: r.formatted_address,
      business_status: r.business_status,
      user_ratings_total: r.user_ratings_total,
    };
  } catch (err: any) {
    if (err.message?.startsWith("Google Places API denied")) throw err;
    return null;
  }
}

async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<{ website?: string; business_status?: string } | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website,business_status&key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data: any = await res.json();
    if (data.status !== "OK") return null;
    return {
      website: data.result?.website,
      business_status: data.result?.business_status,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// URL liveness check (HEAD with GET fallback, 5s timeout)
// ---------------------------------------------------------------------------

async function checkUrlLiveness(
  url: string
): Promise<{ live: boolean; statusCode?: number }> {
  if (!url) return { live: false };
  const tryFetch = async (method: string) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RealGoodDenver/1.0)" },
      });
      clearTimeout(timer);
      return { live: res.status < 400, statusCode: res.status };
    } catch {
      clearTimeout(timer);
      return null;
    }
  };

  const headResult = await tryFetch("HEAD");
  if (headResult) return headResult;
  const getResult = await tryFetch("GET");
  return getResult ?? { live: false };
}

// ---------------------------------------------------------------------------
// Full restaurant verification pipeline
// ---------------------------------------------------------------------------

const CLOSED_STATUSES = new Set(["CLOSED_PERMANENTLY", "CLOSED_TEMPORARILY"]);
const MIN_VERIFIED_RESTAURANTS = 7;

async function buildVerifiedRestaurantList(
  candidates: string[],
  apiKey: string
): Promise<{ verified: VerifiedPlace[]; dropped: DroppedRestaurant[] }> {
  const verified: VerifiedPlace[] = [];
  const dropped: DroppedRestaurant[] = [];
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (const name of candidates) {
    await delay(200); // gentle rate limiting

    console.log(`  [places] Checking: "${name}"`);

    let searchResult: PlaceSearchResult | null;
    try {
      searchResult = await queryGooglePlaces(name, apiKey);
    } catch (err: any) {
      throw err; // bubble up API key errors immediately
    }

    if (!searchResult) {
      dropped.push({ name, reason: "Not found in Google Places (or outside Colorado)" });
      console.log(`    DROPPED: no Places result`);
      continue;
    }

    // Status check from text search
    if (searchResult.business_status && CLOSED_STATUSES.has(searchResult.business_status)) {
      dropped.push({
        name,
        reason: "Closed",
        details: `business_status: ${searchResult.business_status} (from text search)`,
      });
      console.log(`    DROPPED: ${searchResult.business_status}`);
      continue;
    }

    // Place Details for website + authoritative status
    await delay(200);
    const details = await getPlaceDetails(searchResult.place_id, apiKey);

    if (details?.business_status && CLOSED_STATUSES.has(details.business_status)) {
      dropped.push({
        name,
        reason: "Closed",
        details: `business_status: ${details.business_status} (from Place Details)`,
      });
      console.log(`    DROPPED: ${details.business_status} (Details)`);
      continue;
    }

    const rawWebsite = details?.website || null;
    let resolvedWebsite: string | null = rawWebsite;
    let websiteLive = false;

    if (rawWebsite) {
      const check = await checkUrlLiveness(rawWebsite);
      websiteLive = check.live;
      if (!check.live) {
        console.log(`    URL dead (HTTP ${check.statusCode ?? "timeout"}): ${rawWebsite}`);
        // Fallback to Google Maps deep link — always works
        resolvedWebsite = `https://www.google.com/maps/place/?q=place_id:${searchResult.place_id}`;
      }
    } else {
      // No website on file — use Google Maps link
      resolvedWebsite = `https://www.google.com/maps/place/?q=place_id:${searchResult.place_id}`;
    }

    const cleaned_address = searchResult.formatted_address.replace(", USA", "");
    verified.push({
      name: searchResult.name,
      formatted_address: cleaned_address,
      website: resolvedWebsite,
      website_live: websiteLive,
      business_status: searchResult.business_status || "OPERATIONAL",
      place_id: searchResult.place_id,
    });

    const urlLabel = websiteLive ? rawWebsite : "(using Google Maps link)";
    console.log(`    OK: ${searchResult.name} | ${cleaned_address} | ${urlLabel}`);
  }

  return { verified, dropped };
}

// ---------------------------------------------------------------------------
// Phase 2: Generate post content with verified data
// ---------------------------------------------------------------------------

const TONE_EXAMPLES = `
EXISTING POST VOICE EXAMPLES:

"Let's get one thing straight. Denver's barbecue scene isn't playing around. Brisket isn't just food. It's religion."

"You woke up hungover, emotionally unstable, and somehow both starving and bloated. You don't need judgment. You need eggs, carbs, and a mimosa the size of your head."

"In Denver, there's spicy and then there's ruin-your-day spicy. The kind that makes your friends stare at you like you've lost your mind."

"Denver has a lot going for it. 300 days of sunshine. Mountains in your backyard. And quietly, without much fanfare, a posole scene that punches way above its weight."

VOICE RULES:
- Second person ("you") throughout
- Mildly chaotic, opinionated, Denver-local
- Food treated with earned gravity (sometimes excessive gravity — that's the bit)
- Honest, including about weaknesses
- No tourist-brochure language
`;

async function generatePostContent(
  entry: QueueEntry,
  verifiedPlaces: VerifiedPlace[],
  redditContext: string,
  anthropic: Anthropic
): Promise<{ content: string; excerpt: string }> {
  const placesForPrompt = verifiedPlaces.map((p) => ({
    name: p.name,
    address: p.formatted_address,
    // Only pass a URL when the official site is confirmed live.
    // null means: format as **Name** (bold, no link) in the post.
    website: p.website_live ? p.website : null,
  }));

  const systemPrompt = `You are writing for Real Good Denver, a witty, opinionated local guide.

${TONE_EXAMPLES}

ABSOLUTE RULES:
1. NEVER use em dashes (—). Use commas or periods.
2. Use the restaurant name, address, and website URL VERBATIM from the JSON provided.
   Copy them character-for-character. Do NOT alter, abbreviate, or "fix" them.
3. You MAY add a neighborhood label in parentheses after the address (e.g. "2527 W 26th Ave (Jefferson Park)") using your knowledge of Denver geography.
4. QUOTES: NEVER use inline quoted strings like 'this' or "this" to attribute opinions to people or communities.
   The ONLY format for a direct quote is a Markdown blockquote (> line). Only use a > blockquote when the text appears
   VERBATIM in the Reddit context. Otherwise, paraphrase the sentiment in plain prose — no quotation marks at all.
5. REDDIT VOICE: Weave in at least 2–3 references to community sentiment from r/Denver or r/DenverFood.
   Use loose attribution like "locals on r/Denver", "r/DenverFood regulars", "a well-upvoted thread on r/Denver", etc.
   Do NOT use blockquotes for these — just incorporate them naturally into the prose.
6. RESTAURANTS WITH NO OFFICIAL WEBSITE (website is null in the JSON): Format as **Name** (bold only, no hyperlink).
   Still list the address as plain text. Do NOT invent or guess a URL.
7. RESTAURANTS WITH AN OFFICIAL WEBSITE (website is a URL in the JSON): Format as **[Name](website)**.
8. 900–1,500 words total.
9. Structure: hook intro (2–3 paragraphs), ranked spots as ### headers, closing **The Verdict** (bolded, not a header).
10. Each spot entry line: per rules 6–7 above | address | price range ($–$$$$) | Reservations: Yes/No/Recommended.
11. Do NOT include an H1 title line at the start. The title is stored separately. Start directly with the opening prose paragraph.
12. Output ONLY the markdown for fullContent. No frontmatter, no metadata, no title.`;

  const userPrompt = `Write the Best of Denver post for:

Title: "${entry.title}"
Category: ${entry.category}
Tags: ${entry.tags.join(", ")}

VERIFIED RESTAURANT DATA — copy name, address, website VERBATIM:
${JSON.stringify(placesForPrompt, null, 2)}

REDDIT COMMUNITY CONTEXT — use for local color. Direct > blockquotes must match verbatim text here:
${redditContext}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Enforce verified URLs, then clean up Google Maps fallback links
  const enforcedContent = cleanupGoogleMapsLinks(
    enforceVerifiedUrls(content, verifiedPlaces),
    verifiedPlaces
  );

  // Generate excerpt
  const excerptMsg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Write a 1–2 sentence excerpt. Match the voice: punchy, Denver-local, opinionated. Under 45 words. NEVER use em dashes (—).

Title: "${entry.title}"
Opening lines: "${content.slice(0, 400)}"

Output ONLY the excerpt text.`,
      },
    ],
  });

  const excerpt =
    excerptMsg.content[0].type === "text"
      ? excerptMsg.content[0].text.trim()
      : `Denver has opinions. These are the ones worth acting on.`;

  return { content: enforcedContent, excerpt };
}

// Post-process: for places without a live official site, strip any link and use bold name only
function cleanupGoogleMapsLinks(
  content: string,
  verified: VerifiedPlace[]
): string {
  let result = content;
  for (const place of verified) {
    if (place.website_live) continue; // has live official site, leave any link alone
    const escapedName = place.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Replace [Name](url) and [Name]() (empty href from confused LLM output) with **Name**
    result = result.replace(
      new RegExp(`\\[${escapedName}\\]\\([^)]*\\)`, "gi"),
      `**${place.name}**`
    );
  }
  return result;
}

// Post-process: replace any Claude-generated restaurant URLs with verified ones
function enforceVerifiedUrls(
  content: string,
  verified: VerifiedPlace[]
): string {
  let result = content;
  for (const place of verified) {
    if (!place.website) continue;
    const escapedName = place.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match [Name](any-url) and replace URL with verified one
    result = result.replace(
      new RegExp(`\\[${escapedName}\\]\\([^)]+\\)`, "gi"),
      `[${place.name}](${place.website})`
    );
  }
  return result;
}

// ---------------------------------------------------------------------------
// Quote post-processing — verify and demote
// ---------------------------------------------------------------------------

function extractBlockquotes(content: string): string[] {
  return (content.match(/^>[ \t]*"?(.+?)"?[ \t]*$/gm) || []).map((line) =>
    line.replace(/^>[ \t]*"?/, "").replace(/"?[ \t]*$/, "").trim()
  );
}

// Detect inline quoted strings that look like attributed direct quotes (10–80 chars).
// These bypass blockquote detection but are still claims about what someone said.
function extractInlineAttributedQuotes(
  content: string
): Array<{ quote: string; original: string }> {
  const results: Array<{ quote: string; original: string }> = [];
  // Single-quoted: 'text here' — 10-80 chars.
  // (?<!\w) prevents matching possessive apostrophes like Sam's or Denver's.
  const singleRe = /(?<!\w)'([^']{10,80})'(?!\w)/g;
  let m;
  while ((m = singleRe.exec(content)) !== null) {
    results.push({ quote: m[1], original: m[0] });
  }
  return results;
}

function findQuoteSource(
  quote: string,
  allData: RedditAllData
): QuoteSource | null {
  // Use first 40 chars as fingerprint — lenient enough to survive minor punctuation differences
  const fingerprint = quote.toLowerCase().replace(/[''""]/g, '"').slice(0, 40);

  const sources = [
    ...allData.posts.map((p) => ({
      haystack: (p.title + " " + p.selftext).toLowerCase(),
      permalink: `https://www.reddit.com${p.permalink}`,
      author: p.author,
      created_utc: p.created_utc,
      score: p.score,
      subreddit: p.subreddit,
    })),
    ...allData.comments.map((c) => ({
      haystack: c.body.toLowerCase().replace(/[''""]/g, '"'),
      permalink: c.permalink,
      author: c.author,
      created_utc: c.created_utc,
      score: c.score,
      subreddit: c.subreddit,
    })),
  ];

  for (const src of sources) {
    if (src.haystack.includes(fingerprint)) {
      return {
        quote,
        permalink: src.permalink,
        author: src.author,
        created_utc: src.created_utc,
        score: src.score,
        subreddit: src.subreddit,
      };
    }
  }
  return null;
}

async function demoteBlockquoteToParagraph(
  quote: string,
  anthropic: Anthropic
): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `Rewrite this as a paraphrased community sentiment in the Real Good Denver voice. One concise sentence. No em dashes. No quotation marks.

Original: "${quote}"

Output ONLY the paraphrased sentence.`,
      },
    ],
  });
  return msg.content[0].type === "text"
    ? msg.content[0].text.trim()
    : "Community sentiment here is divided but real.";
}

async function processQuotes(
  content: string,
  allData: RedditAllData,
  anthropic: Anthropic
): Promise<{ content: string; quoteSources: QuoteSource[] }> {
  const quoteSources: QuoteSource[] = [];
  let processed = content;

  // --- Pass 1: Markdown blockquotes (> lines) ---
  const blockquotes = extractBlockquotes(content);
  for (const quote of blockquotes) {
    const source = findQuoteSource(quote, allData);
    if (source) {
      quoteSources.push(source);
      console.log(
        `  [quotes] Sourced blockquote: "${quote.slice(0, 60)}..." → ${source.permalink}`
      );
    } else {
      console.log(
        `  [quotes] Unsourced blockquote: "${quote.slice(0, 60)}..." → demoting`
      );
      const paraphrase = await demoteBlockquoteToParagraph(quote, anthropic);
      const escapedQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      processed = processed.replace(
        new RegExp(`^>[ \\t]*"?${escapedQuote}"?[ \\t]*$`, "m"),
        paraphrase
      );
    }
  }

  // --- Pass 2: Inline single-quoted attributed phrases ('like this') ---
  // These bypass blockquote detection but are direct-quote claims.
  // If sourceable: keep as-is. If not: strip the quotes.
  const inlineQuotes = extractInlineAttributedQuotes(processed);
  for (const { quote, original } of inlineQuotes) {
    const source = findQuoteSource(quote, allData);
    if (source) {
      quoteSources.push(source);
      console.log(
        `  [quotes] Sourced inline quote: "${quote.slice(0, 60)}"`
      );
    } else {
      // Strip the quotation marks — the sentiment stays, the false attribution goes
      console.log(
        `  [quotes] Unsourced inline quote: "${quote.slice(0, 60)}" → stripping quotes`
      );
      processed = processed.replace(original, quote);
    }
  }

  return { content: processed, quoteSources };
}

// ---------------------------------------------------------------------------
// Image generation (gpt-image-1)
// ---------------------------------------------------------------------------

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    protocol
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function generateImage(
  slug: string,
  title: string,
  category: string,
  anthropic: Anthropic
): Promise<string> {
  const imagePath = path.join(PROJECT_ROOT, "public", "images", `${slug}.png`);
  const publicPath = `/images/${slug}.png`;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    console.log("[image] OPENAI_API_KEY not set. Skipping image generation.");
    return publicPath;
  }

  const promptMsg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `Write a gpt-image-1 prompt for a food/lifestyle blog hero image.
Topic: "${title}". Category: ${category}.
Requirements: professional editorial food photography, warm golden-hour light, no text, no faces, no logos, Denver aesthetic.
Under 200 characters. Output ONLY the prompt.`,
      },
    ],
  });

  const imagePrompt =
    promptMsg.content[0].type === "text"
      ? promptMsg.content[0].text.trim()
      : `Professional food photography, ${title}, warm tones, Denver Colorado`;

  console.log(`[image] Prompt: ${imagePrompt}`);

  try {
    const openai = new OpenAI({ apiKey: openaiKey });
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      n: 1,
      size: "1536x1024",
      quality: "medium",
    } as Parameters<typeof openai.images.generate>[0]);

    const imageData = response.data[0];
    if (!imageData) throw new Error("No image data returned");

    if ((imageData as any).b64_json) {
      const buffer = Buffer.from((imageData as any).b64_json as string, "base64");
      fs.writeFileSync(imagePath, buffer);
      console.log(`[image] Saved (base64) → ${imagePath}`);
      return publicPath;
    }

    const imgUrl: string | null = (imageData as any).url ?? null;
    if (!imgUrl) throw new Error("No URL or base64 in response");
    await downloadFile(imgUrl, imagePath);
    console.log(`[image] Saved (URL) → ${imagePath}`);
    return publicPath;
  } catch (err) {
    console.error(`[image] Error: ${err}`);
    return publicPath;
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.max(4, Math.round(words / 200))} min read`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextId(): number {
  const postsFile = path.join(PROJECT_ROOT, "src", "data", "posts.ts");
  const content = fs.readFileSync(postsFile, "utf-8");
  const ids = [...content.matchAll(/\bid:\s*(\d+)/g)].map((m) =>
    parseInt(m[1], 10)
  );
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const preVerifiedFlag = args.indexOf("--pre-verified");
  const preVerifiedFile =
    preVerifiedFlag !== -1 ? args[preVerifiedFlag + 1] : null;

  if (!slug) {
    console.error(
      "Usage: npx tsx scripts/draft-post.ts <slug> [--pre-verified <json-file>]"
    );
    process.exit(1);
  }

  // Validate required env vars
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    console.error("ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placesKey && !preVerifiedFile) {
    console.error(
      "\nGOOGLE_PLACES_API_KEY is required to verify restaurant data."
    );
    console.error("To get a key:");
    console.error(
      "  1. Go to https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
    );
    console.error("  2. Enable the Places API on your Google Cloud project");
    console.error("  3. Create an API key under APIs & Services > Credentials");
    console.error("  4. Add GOOGLE_PLACES_API_KEY=<key> to your .env.local");
    console.error(
      "\nAlternatively, supply pre-verified restaurant data to skip Places:"
    );
    console.error(
      "  npx tsx scripts/draft-post.ts <slug> --pre-verified scripts/verified/<slug>.json"
    );
    process.exit(1);
  }

  const queuePath = path.join(__dirname, "best-of-denver-queue.json");
  const queue: QueueEntry[] = JSON.parse(
    fs.readFileSync(queuePath, "utf-8")
  );
  const entry = queue.find((e) => e.slug === slug);
  if (!entry) {
    console.error(`Slug "${slug}" not found in queue.`);
    process.exit(1);
  }
  if (entry.status === "published") {
    console.log(`"${slug}" is already published. Exiting.`);
    process.exit(0);
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  console.log(`\n[draft-post] Drafting: ${entry.title}`);

  // Step 1: Reddit
  console.log("[1/7] Fetching Reddit data with source metadata...");
  const { contextText: redditContext, allData: redditAllData } =
    await gatherRedditData(slug, entry.title);
  console.log(
    `      ${redditAllData.posts.length} posts, ${redditAllData.comments.length} comments`
  );

  // Step 2–3: Restaurant verification (or load pre-verified)
  let verified: VerifiedPlace[];
  let dropped: DroppedRestaurant[];

  if (preVerifiedFile) {
    console.log(
      `[2/7] Loading pre-verified restaurant data from: ${preVerifiedFile}`
    );
    const pvData = JSON.parse(fs.readFileSync(preVerifiedFile, "utf-8"));
    verified = pvData.verified;
    dropped = pvData.dropped || [];
    console.log(
      `      ${verified.length} verified, ${dropped.length} dropped (from file)`
    );
  } else {
    console.log("[2/7] Getting candidate restaurant names from Claude...");
    const candidates = await getCandidateRestaurants(
      entry,
      redditContext,
      anthropic
    );
    console.log(`      ${candidates.length} candidates: ${candidates.join(", ")}`);

    console.log("[3/7] Verifying via Google Places API...");
    const result = await buildVerifiedRestaurantList(candidates, placesKey!);
    verified = result.verified;
    dropped = result.dropped;
    console.log(
      `      Verified: ${verified.length} | Dropped: ${dropped.length}`
    );
  }

  // Step 4: Minimum quality gate
  if (verified.length < MIN_VERIFIED_RESTAURANTS) {
    console.error(
      `\n[FAIL] Only ${verified.length} restaurants passed verification (minimum: ${MIN_VERIFIED_RESTAURANTS}).`
    );
    console.error("Dropped candidates:");
    dropped.forEach((d) =>
      console.error(`  - ${d.name}: ${d.reason}${d.details ? ` (${d.details})` : ""}`)
    );
    console.error(
      "\nDraft aborted. Fix the candidate list or add more restaurants."
    );
    process.exit(1);
  }

  // Step 5: Generate content
  console.log("[5/7] Generating post content with verified data...");
  const { content, excerpt } = await generatePostContent(
    entry,
    verified,
    redditContext,
    anthropic
  );
  console.log(`      ${content.split(/\s+/).length} words`);

  // Step 6: Quote verification
  console.log("[6/7] Verifying quotes against Reddit source data...");
  const { content: finalContent, quoteSources } = await processQuotes(
    content,
    redditAllData,
    anthropic
  );
  console.log(
    `      ${quoteSources.length} direct quote(s) sourced; unsourceable quotes demoted to paraphrase`
  );

  // Step 7: Image
  console.log("[7/7] Generating hero image...");
  const imagePath = await generateImage(
    slug,
    entry.title,
    entry.category,
    anthropic
  );

  // Build Post + verification metadata
  const nextId = getNextId();
  const draftOutput = {
    id: nextId,
    slug,
    title: entry.title,
    excerpt,
    fullContent: finalContent,
    category: entry.category,
    author: "Ryan Estes",
    date: todayISO(),
    readTime: estimateReadTime(finalContent),
    image: imagePath,
    featured: false,
    tags: entry.tags,
    _verification: {
      verifiedRestaurants: verified.map((v) => ({
        name: v.name,
        formatted_address: v.formatted_address,
        website: v.website,
        website_live: v.website_live,
        place_id: v.place_id,
      })),
      droppedRestaurants: dropped,
      quoteSources,
      generatedAt: new Date().toISOString(),
      placesVerified: !preVerifiedFile,
    },
  };

  const draftDir = path.join(__dirname, "drafts");
  if (!fs.existsSync(draftDir)) fs.mkdirSync(draftDir, { recursive: true });
  const draftPath = path.join(draftDir, `${slug}.json`);
  fs.writeFileSync(draftPath, JSON.stringify(draftOutput, null, 2));

  console.log(`\n[draft-post] Done.`);
  console.log(`  Draft: scripts/drafts/${slug}.json`);
  console.log(`  ID: ${draftOutput.id} | Words: ~${finalContent.split(/\s+/).length} | Time: ${draftOutput.readTime}`);
  console.log(`  Verified restaurants: ${verified.length}`);
  if (dropped.length > 0) {
    console.log(`  Dropped (${dropped.length}):`);
    dropped.forEach((d) => console.log(`    - ${d.name}: ${d.reason}`));
  }
  const totalQuotesDetected =
    extractBlockquotes(content).length +
    extractInlineAttributedQuotes(content).length;
  console.log(
    `  Direct quotes detected: ${totalQuotesDetected} | Sourced: ${quoteSources.length} | Demoted/stripped: ${totalQuotesDetected - quoteSources.length}`
  );
}

main().catch((err) => {
  console.error("[draft-post] Fatal error:", err);
  process.exit(1);
});
