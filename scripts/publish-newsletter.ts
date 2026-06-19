/**
 * publish-newsletter.ts
 *
 * Auto-publishes Real Good Denver newsletter issues from Beehiiv to the website.
 *
 * For every confirmed Beehiiv issue not yet on the site it:
 *   1. Saves the issue email HTML to public/newsletter-issues/{slug}.html
 *   2. Generates a short description with Claude (house style, no em dashes)
 *   3. Prepends a NewsletterIssue entry to src/data/newsletterIssues.ts
 *   4. Commits and pushes (Vercel auto-deploys on push)
 *
 * Dedup is tracked by Beehiiv post id in scripts/newsletter-published.json, so
 * re-runs are safe: an issue already shipped is skipped. The site reads the
 * dedicated RGD publication (pub_b449eec5...); older issues that predate this
 * script came from the old combined publication and are seeded into the state
 * file so they are never re-posted.
 *
 * Env: BEEHIIV_PUB_RGD, BEEHIIV_KEY_RGD, ANTHROPIC_API_KEY
 *   (loaded from .env.local automatically for local runs; provided as GitHub
 *   Actions secrets in CI.)
 *
 * Usage:
 *   npx tsx scripts/publish-newsletter.ts             # publish all new issues
 *   npx tsx scripts/publish-newsletter.ts --dry-run   # no file writes, no git
 *   npx tsx scripts/publish-newsletter.ts --no-push   # write + commit, no push
 *   npx tsx scripts/publish-newsletter.ts --post <id> # only that Beehiiv post id
 */

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(PROJECT_ROOT, "src/data/newsletterIssues.ts");
const HTML_DIR = path.join(PROJECT_ROOT, "public/newsletter-issues");
const STATE_FILE = path.join(__dirname, "newsletter-published.json");

const ARRAY_OPEN = "export const newsletterIssues: NewsletterIssue[] = [";

// ---------------------------------------------------------------------------
// House style: no em dashes anywhere (ESLint enforces this on src/). Beehiiv
// content and Claude output both sneak them in, so strip every variant before
// anything is written. " - " spacing is collapsed so "a - b" becomes "a, b".
// ---------------------------------------------------------------------------
function stripEmDashes(s: string): string {
  return s.replace(/\s*(?:&mdash;|&#8212;|—)\s*/g, ", ");
}

// ---------------------------------------------------------------------------
// Minimal .env.local loader so local runs work without exporting vars. CI
// passes these as real env vars, which take precedence.
// ---------------------------------------------------------------------------
function loadEnvLocal(): void {
  const p = path.join(PROJECT_ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    if (process.env[m[1]] === undefined) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

interface BeehiivPost {
  id: string;
  title: string;
  publish_date: number;
  status: string;
}

interface NewsletterIssue {
  slug: string;
  title: string;
  date: string;
  description: string;
  htmlFile: string;
}

function readState(): { publishedPostIds: string[]; raw: Record<string, unknown> } {
  const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  return { publishedPostIds: raw.publishedPostIds ?? [], raw };
}

function writeState(raw: Record<string, unknown>, ids: string[]): void {
  raw.publishedPostIds = ids;
  fs.writeFileSync(STATE_FILE, JSON.stringify(raw, null, 2) + "\n");
}

function existingSlugs(): Set<string> {
  const src = fs.readFileSync(DATA_FILE, "utf8");
  const slugs = new Set<string>();
  for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1]);
  return slugs;
}

// Beehiiv reuses/duplicates its own slugs across issues, so we build a clean
// descriptive slug from the title instead.
function slugify(title: string, taken: Set<string>): string {
  let base = title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Cap length at a word boundary near 70 chars.
  if (base.length > 70) {
    base = base.slice(0, 70).replace(/-[^-]*$/, "");
  }
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

// Publish date as a Denver-local YYYY-MM-DD (matches the site's date field).
function mountainDate(unixSeconds: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(unixSeconds * 1000));
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function prettyDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

async function beehiiv(url: string, key: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Beehiiv ${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<Record<string, unknown>>;
}

function flattenHtml(html: string): string {
  return html
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Each story in an RGD issue is rendered as "Headline - LINK". We extract the
// headline that precedes each LINK marker so the description is grounded in the
// issue's actual stories, never invented. Returns [] if the format does not
// match (the caller then falls back to flattened body text).
function extractHeadlines(html: string): string[] {
  const txt = flattenHtml(html);
  const heads: string[] = [];
  const seen = new Set<string>();
  for (const m of txt.matchAll(/-\s*LINK/g)) {
    const pre = txt.slice(Math.max(0, m.index! - 130), m.index!).trim();
    let head = pre.split(/(?<=[.!?])\s+/).pop() ?? pre;
    head = head.replace(/^[\s.\-]+|[\s.\-]+$/g, "");
    if (head.length > 12 && !/LINK/.test(head) && !seen.has(head)) {
      seen.add(head);
      heads.push(head);
    }
  }
  return heads;
}

async function generateDescription(anthropic: Anthropic, title: string, emailHtml: string): Promise<string> {
  const headlines = extractHeadlines(emailHtml);
  const source = headlines.length >= 3
    ? `STORY HEADLINES (use only these, do not add facts):\n${headlines.map((h) => `- ${h}`).join("\n")}`
    : `BODY:\n${flattenHtml(emailHtml).slice(0, 8000)}`;
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content:
          "You write the one-paragraph summary shown under a Denver newsletter issue on its website. " +
          "Write 2 to 3 sentences (about 50 to 80 words) summarizing the issue's main stories. " +
          "Lead with the biggest news (it should match the issue title), then add a few more specifics such as restaurant openings or developments. " +
          "Ignore routine event-calendar and sports-schedule listings. " +
          "STRICT: use ONLY facts present in the source below. Do not invent, dramatize, or reframe any story. If a detail is not in the source, leave it out. " +
          "Style: factual, specific, names and numbers, energetic but not hypey. You may start a later sentence with 'Plus' once. " +
          "Do NOT use em dashes (use commas or periods). Return ONLY the paragraph, no quotes, no preamble.\n\n" +
          `ISSUE TITLE: ${title}\n\n${source}`,
      },
    ],
  });
  const text = msg.content.find((b) => b.type === "text");
  const out = text && text.type === "text" ? text.text.trim() : "";
  return stripEmDashes(out);
}

function buildEntry(issue: NewsletterIssue): string {
  return (
    "  {\n" +
    `    slug: ${JSON.stringify(issue.slug)},\n` +
    `    title: ${JSON.stringify(issue.title)},\n` +
    `    date: ${JSON.stringify(issue.date)},\n` +
    `    description: ${JSON.stringify(issue.description)},\n` +
    `    htmlFile: ${JSON.stringify(issue.htmlFile)},\n` +
    "  },\n"
  );
}

function insertIssue(issue: NewsletterIssue): void {
  const src = fs.readFileSync(DATA_FILE, "utf8");
  const idx = src.indexOf(ARRAY_OPEN);
  if (idx === -1) throw new Error(`Could not find array opener in ${DATA_FILE}`);
  const insertAt = idx + ARRAY_OPEN.length + 1; // just after the opening line's newline
  const next = src.slice(0, insertAt) + buildEntry(issue) + src.slice(insertAt);
  fs.writeFileSync(DATA_FILE, next);
}

async function main(): Promise<void> {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const noPush = args.includes("--no-push");
  const onlyPost = args.includes("--post") ? args[args.indexOf("--post") + 1] : null;

  const PUB = process.env.BEEHIIV_PUB_RGD;
  const KEY = process.env.BEEHIIV_KEY_RGD;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!PUB || !KEY) throw new Error("Missing BEEHIIV_PUB_RGD / BEEHIIV_KEY_RGD");
  if (!ANTHROPIC_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
  const state = readState();
  const published = new Set(state.publishedPostIds);

  const list = await beehiiv(
    `https://api.beehiiv.com/v2/publications/${PUB}/posts?limit=100&order_by=publish_date&direction=asc&status=confirmed`,
    KEY,
  );
  let posts = ((list.data as BeehiivPost[]) ?? []).filter((p) => p.status === "confirmed");
  if (onlyPost) posts = posts.filter((p) => p.id === onlyPost);

  // Oldest first so multiple new issues land in chronological order (each new
  // entry is prepended, so the newest ends up on top).
  const newPosts = posts.filter((p) => !published.has(p.id));
  if (newPosts.length === 0) {
    console.log("[newsletter] No new issues to publish.");
    return;
  }
  console.log(`[newsletter] ${newPosts.length} new issue(s) to publish.`);

  if (!dryRun && !fs.existsSync(HTML_DIR)) fs.mkdirSync(HTML_DIR, { recursive: true });

  const taken = existingSlugs();
  const shipped: string[] = [];

  for (const post of newPosts) {
    const title = stripEmDashes(post.title).trim();
    const date = mountainDate(post.publish_date);
    const slug = slugify(title, taken);
    taken.add(slug);

    const full = await beehiiv(
      `https://api.beehiiv.com/v2/publications/${PUB}/posts/${post.id}?expand[]=free_email_content`,
      KEY,
    );
    const data = full.data as { content?: { free?: { email?: string } } };
    const emailHtml = data.content?.free?.email;
    if (!emailHtml) {
      console.log(`[newsletter] SKIP ${post.id}: no email content available yet.`);
      continue;
    }
    const html = stripEmDashes(emailHtml);
    const description = await generateDescription(anthropic, title, emailHtml);

    const issue: NewsletterIssue = {
      slug,
      title,
      date,
      description,
      htmlFile: `/newsletter-issues/${slug}.html`,
    };

    console.log(`\n[newsletter] ${date}  ${title}`);
    console.log(`             slug: ${slug}`);
    console.log(`             desc: ${description}`);

    if (dryRun) {
      console.log("[newsletter] DRY RUN: not writing files.");
    } else {
      fs.writeFileSync(path.join(HTML_DIR, `${slug}.html`), html);
      insertIssue(issue);
      shipped.push(post.id);
    }
  }

  if (dryRun || shipped.length === 0) {
    console.log("\n[newsletter] Done (no changes written).");
    return;
  }

  // Record state in the same commit so a failed push does not double-publish.
  writeState(state.raw, [...state.publishedPostIds, ...shipped]);

  const titles = newPosts
    .filter((p) => shipped.includes(p.id))
    .map((p) => `${stripEmDashes(p.title).trim()} (${prettyDate(mountainDate(p.publish_date))})`);
  const commitMsg =
    titles.length === 1
      ? `Add newsletter issue: ${titles[0]}`
      : `Add ${titles.length} newsletter issues`;

  execSync(
    `git -C "${PROJECT_ROOT}" add src/data/newsletterIssues.ts public/newsletter-issues/ scripts/newsletter-published.json`,
    { stdio: "inherit" },
  );
  execSync(`git -C "${PROJECT_ROOT}" commit -m ${JSON.stringify(commitMsg)}`, { stdio: "inherit" });
  if (noPush) {
    console.log("[newsletter] --no-push: committed but not pushed.");
  } else {
    execSync(`git -C "${PROJECT_ROOT}" push`, { stdio: "inherit" });
    console.log("[newsletter] Pushed. Vercel will deploy.");
  }
}

main().catch((e) => {
  console.error("[newsletter] FAILED:", e);
  process.exit(1);
});
