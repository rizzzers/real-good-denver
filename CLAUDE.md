# RealGoodDenver — Claude Instructions

## Writing Style

- **No em dashes (—). Ever.** This applies to every file: JSX, metadata, data files, email templates, alt text, event descriptions, newsletter copy, everything. Use a comma, colon, period, or rewrite the sentence instead. An ESLint rule (`no-em-dash/no-em-dash`) enforces this and will fail the build if violated.

---

## Newsletter Auto-Publishing (Beehiiv to website)

When a new issue is sent from the Real Good Denver Beehiiv publication, it is automatically posted to the website.

### How it works

**Data source:** The newsletter list reads from `src/data/newsletterIssues.ts` (a static array of `{ slug, title, date, description, htmlFile }`). Each issue's HTML lives at `public/newsletter-issues/{slug}.html`. The issue page (`src/app/newsletter/[slug]`) fetches that file, extracts its `<body>`, strips scripts, and renders it.

**Pipeline:** `scripts/publish-newsletter.ts` pulls confirmed issues from the dedicated RGD Beehiiv publication (`pub_b449eec5...`) and, for each one not yet on the site:

1. Saves the Beehiiv `content.free.email` HTML to `public/newsletter-issues/{slug}.html` (em dashes stripped).
2. Generates a short description with Claude, grounded ONLY on the issue's extracted story headlines (the lines marked `- LINK`) so it never invents stories.
3. Generates a clean descriptive slug from the title (Beehiiv reuses its own slugs, so they are not used).
4. Prepends a `NewsletterIssue` entry to `src/data/newsletterIssues.ts` (newest first).
5. Commits and pushes. Vercel auto-deploys.

Dedup is tracked by Beehiiv post id in `scripts/newsletter-published.json`, so re-runs are safe. Issues from before this pipeline (which came from the old combined AIFF+RGD publication) are seeded into that file so they are never re-posted.

**Schedule:** `.github/workflows/publish-newsletter.yml` runs twice daily (evening + next-midday backstop) and on manual dispatch. Issues send roughly weekly; a new one appears on the site within a day.

### Running manually

```bash
npx tsx scripts/publish-newsletter.ts --dry-run    # preview slug + description, no writes
npx tsx scripts/publish-newsletter.ts --no-push    # write + commit locally, no push
npx tsx scripts/publish-newsletter.ts              # publish all new issues (commit + push)
npx tsx scripts/publish-newsletter.ts --post <id>  # only that Beehiiv post id
```

### Required secrets / env

Local runs read `.env.local`; CI uses GitHub repo secrets.

| Name | Purpose |
|---|---|
| `BEEHIIV_PUB_RGD` | RGD dedicated publication id (`pub_b449eec5...`) |
| `BEEHIIV_KEY_RGD` | RGD Beehiiv API key |
| `ANTHROPIC_API_KEY` | Description generation (also used by Best of Denver) |
| `PUBLISH_BOT_PAT` | Push token so the push triggers Vercel deploy (shared with Best of Denver) |

`ANTHROPIC_API_KEY` and `PUBLISH_BOT_PAT` already exist as repo secrets. `BEEHIIV_PUB_RGD` and `BEEHIIV_KEY_RGD` must be added for the cron to run.

### What NOT to touch

- Do not edit entries inside `public/newsletter-issues/*.html` by hand for content from Beehiiv; re-run the publisher instead.
- Do not change the array opener line `export const newsletterIssues: NewsletterIssue[] = [` in `newsletterIssues.ts`; the publisher finds the insertion point by matching it.
- `scripts/newsletter-published.json` is append-only state. Do not remove ids or it will re-publish issues.

---

## Auto-Publishing System

The site auto-publishes Best of Denver posts via a pipeline of three scripts and a GitHub Actions cron job.

### Architecture

**Data source:** The live site reads entirely from `src/data/posts.ts` (a static TypeScript array). Publishing = appending a new Post object to that array, committing, and pushing to main. Vercel auto-deploys on push.

**The pipeline: draft then publish**

```
scripts/run-publish.ts         ← cron entry point (called by GitHub Actions)
  └── scripts/draft-post.ts    ← fetches Reddit + generates content + image
  └── scripts/publish-post.ts  ← appends to posts.ts, git commits and pushes
```

### Key Files

| File | Purpose |
|---|---|
| `scripts/best-of-denver-queue.json` | 50-entry queue. `status`: pending/published/failed. `season`: null/summer/fall/winter |
| `scripts/draft-post.ts` | Drafts a post. Saves to `scripts/drafts/{slug}.json` |
| `scripts/publish-post.ts` | Publishes a draft. Appends to posts.ts, commits, pushes. Updates queue. |
| `scripts/run-publish.ts` | Picks next eligible post, runs draft then publish. Logs to `scripts/logs/` |
| `.github/workflows/publish-best-of.yml` | Runs Mon/Wed/Fri at 9am MDT |

### Schedule

Runs Monday, Wednesday, Friday at 9:00 AM Mountain Time via GitHub Actions cron.

Seasonal posts are skipped when out of season:
- `"summer"` (posts 41-44): June 1 to August 31 only
- `"fall"` (posts 45-48): September 1 to November 30 only
- `"winter"` (posts 49-50): December 1 to February 28 only
- Non-seasonal posts (1-40) are scheduled in queue order regardless of date

### Running Manually

```bash
# Draft a specific post (saves to scripts/drafts/{slug}.json)
npx tsx scripts/draft-post.ts best-green-chile-denver

# Publish a drafted post (appends to posts.ts + git push)
npx tsx scripts/publish-post.ts best-green-chile-denver

# Dry run (stops before git push)
npx tsx scripts/publish-post.ts best-green-chile-denver --dry-run

# Run full pipeline (what the cron does)
npx tsx scripts/run-publish.ts

# Full pipeline dry run
npx tsx scripts/run-publish.ts --dry-run
```

### Required Secrets (GitHub repo settings)

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Content generation via Claude |
| `OPENAI_API_KEY` | Hero image generation via gpt-image-1 |
| `GOOGLE_PLACES_API_KEY` | Restaurant verification via Google Places API (Text Search + Place Details) |
| `PUBLISH_BOT_PAT` | GitHub Personal Access Token with `contents: write` scope on this repo |

To create the PAT: GitHub Settings > Developer settings > Personal access tokens > Fine-grained token. Scope: this repo only, "Contents" read and write.

### Post Object Schema

Posts appended to `src/data/posts.ts` must conform to the `Post` interface:

```typescript
{
  id: number,           // auto-incremented (max existing + 1)
  slug: string,         // kebab-case, matches queue entry
  title: string,        // from queue
  excerpt: string,      // 1-2 sentences, generated by Claude
  fullContent: string,  // Markdown body, ~900-1500 words
  category: string,     // food | culture | lifestyle | activities | nightlife | outdoors
  author: string,       // "Ryan Estes"
  date: string,         // YYYY-MM-DD (publish date)
  readTime: string,     // "N min read"
  image: string,        // "/images/{slug}.png"
  featured: boolean,    // false for auto-published posts
  tags: string[],       // from queue
}
```

### Verification Pipeline (draft-post.ts)

`draft-post.ts` runs a 5-step verification pass before generating content:

1. **Google Places lookup** — each candidate restaurant is queried via Text Search + Place Details. Drops `CLOSED_PERMANENTLY` and `CLOSED_TEMPORARILY` businesses, and any result outside Colorado.
2. **URL liveness check** — HEAD request with 5s timeout; falls back to GET. Dead URLs are replaced with a Google Maps deep link for that place_id.
3. **Two-phase Claude generation** — Phase 1 generates restaurant names only. Phase 2 writes full post content using the verified data JSON verbatim (name, address, website are copied character-for-character from Places API).
4. **Quality gate** — if fewer than 7 restaurants survive verification, the draft fails loudly. Fix the candidate list before retrying.
5. **Quote sourcing** — every `>` blockquote is fingerprint-matched against the fetched Reddit data. Unverifiable quotes are demoted to paraphrased community sentiment via Claude-haiku.

The draft JSON at `scripts/drafts/{slug}.json` includes a `_verification` metadata field with the full verification report. `publish-post.ts` strips this field before writing to `posts.ts`.

To bypass Places API (e.g., no API key available), supply pre-verified data:
```bash
npx tsx scripts/draft-post.ts <slug> --pre-verified scripts/verified/<slug>.json
```

Pre-verified JSON format:
```json
{
  "verified": [
    {
      "name": "Restaurant Name",
      "formatted_address": "123 Main St, Denver, CO 80202",
      "website": "https://example.com",
      "website_live": true,
      "business_status": "OPERATIONAL",
      "place_id": "ChIJ..."
    }
  ],
  "dropped": [
    { "name": "Closed Place", "reason": "Closed", "details": "Permanently closed 2021" }
  ]
}
```

### Post Page Features (automatic on all Best of Denver posts)

Every Best of Denver post automatically renders two features driven by the post content — no extra work needed in the pipeline:

1. **Estes Picks #1 section** — The first restaurant/place in each post gets a highlighted navy/orange callout block with the Estes Picks circular graphic on the left and a `#1 Pick` badge. Driven by `src/components/EstesPickSection.tsx`. Works by detecting the first `###`, `##`, or `**Name**` heading after the intro.

2. **Interactive map** — A Leaflet/OpenStreetMap map showing a pin for every location mentioned in the post. Geocodes addresses via Nominatim, caches in `localStorage`. Orange pin = #1 pick, blue = rest. Driven by `src/components/PostMap.tsx`. Works by extracting lines containing Colorado city/state patterns from each `###`/`##` section.

**For the auto-publish pipeline:** Ensure every restaurant entry in generated posts follows the format:
```
### **[Restaurant Name](url)**

Street Address, City, CO ZIP (Neighborhood) | $$ | Reservations: Yes/No
```
The address line (containing `, CO` or a Denver suburb) is what the map uses to geocode. If the address line is missing or malformed, that pin will be skipped silently.

### What NOT to Touch

- Do not modify the `id` field of existing posts in `src/data/posts.ts`. IDs are permanent once published.
- Do not delete or reorder entries in `best-of-denver-queue.json`. The queue is append-only; mark entries `"failed"` if needed.
- Do not change the array termination pattern `\n];\n\nexport const categories` in `posts.ts`. `publish-post.ts` finds the insertion point by matching this string.
- The `scripts/drafts/` and `scripts/logs/` directories are gitignored (log outputs and drafts are ephemeral).
