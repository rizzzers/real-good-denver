/**
 * publish-post.ts
 *
 * Reads a draft from scripts/drafts/{slug}.json, appends it to src/data/posts.ts,
 * commits and pushes, then marks the queue entry as published.
 *
 * Usage: npx tsx scripts/publish-post.ts <slug> [--dry-run]
 *   --dry-run: skips git operations, just shows what would be inserted
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface QueueEntry {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  scheduledFor: string | null;
  status: "pending" | "published" | "failed";
  season: "summer" | "fall" | "winter" | null;
  publishedAt?: string;
}

// ---------------------------------------------------------------------------
// House style: no em dashes, ever (also enforced by ESLint on src/). The model
// keeps generating them, so replace every em dash with a comma before the post
// is written to posts.ts. Collapses surrounding spaces so " — " and "x—y" both
// become a clean comma.
// ---------------------------------------------------------------------------

function stripEmDashes(post: Post): Post {
  const fix = (s: string) => s.replace(/\s*—\s*/g, ", ");
  return {
    ...post,
    title: fix(post.title),
    excerpt: fix(post.excerpt),
    fullContent: fix(post.fullContent),
    tags: post.tags.map(fix),
  };
}

// ---------------------------------------------------------------------------
// Serialize a Post object to TypeScript source string
// ---------------------------------------------------------------------------

function serializePost(post: Post): string {
  // Escape backticks and ${} in fullContent so it's safe in a template literal
  const escapedContent = post.fullContent
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const tagsStr = post.tags.map((t) => JSON.stringify(t)).join(", ");

  return `  {
    id: ${post.id},
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    fullContent: \`${escapedContent}\`,
    category: ${JSON.stringify(post.category)},
    author: ${JSON.stringify(post.author)},
    date: ${JSON.stringify(post.date)},
    readTime: ${JSON.stringify(post.readTime)},
    image: ${JSON.stringify(post.image)},
    featured: ${post.featured},
    tags: [${tagsStr}],
  }`;
}

// ---------------------------------------------------------------------------
// Insert post into src/data/posts.ts
// ---------------------------------------------------------------------------

function appendPostToFile(post: Post, dryRun: boolean): void {
  const postsFile = path.join(PROJECT_ROOT, "src", "data", "posts.ts");
  let source = fs.readFileSync(postsFile, "utf-8");

  // Find the closing of the posts array: the last `},` or `}` before `];`
  // We look for the pattern `];` that ends the posts array (before `export const categories`)
  const arrayEndIndex = source.indexOf("\n];\n\nexport const categories");
  if (arrayEndIndex === -1) {
    throw new Error(
      "Could not find the end of the posts array in src/data/posts.ts. " +
        "Expected pattern: '\\n];\\n\\nexport const categories'"
    );
  }

  const newEntry = serializePost(post);

  if (dryRun) {
    console.log("\n[dry-run] Would insert this entry into src/data/posts.ts:");
    console.log("--- BEGIN ENTRY ---");
    console.log(newEntry.slice(0, 800) + (newEntry.length > 800 ? "\n... (truncated)" : ""));
    console.log("--- END ENTRY ---");
    return;
  }

  // Insert the new post before `];`.
  // Guard against double-comma if the last entry already has a trailing comma.
  const prefix = source.slice(0, arrayEndIndex);
  const separator = prefix.trimEnd().endsWith(",") ? "\n" : ",\n";
  const updated = prefix + separator + newEntry + source.slice(arrayEndIndex);

  fs.writeFileSync(postsFile, updated, "utf-8");
  console.log(`[publish] Appended post id=${post.id} to src/data/posts.ts`);
}

// ---------------------------------------------------------------------------
// Git operations
// ---------------------------------------------------------------------------

function gitCommitAndPush(title: string): void {
  const commitMsg = `Add post: ${title}`;
  try {
    execSync(`git -C "${PROJECT_ROOT}" add src/data/posts.ts public/images/ scripts/best-of-denver-queue.json`, {
      stdio: "pipe",
    });
    execSync(`git -C "${PROJECT_ROOT}" commit -m ${JSON.stringify(commitMsg)}`, {
      stdio: "inherit",
    });
    execSync(`git -C "${PROJECT_ROOT}" push`, { stdio: "inherit" });
    console.log("[publish] Git commit and push successful.");
  } catch (err) {
    console.error("[publish] Git operation failed:", err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Update queue entry
// ---------------------------------------------------------------------------

function markPublished(slug: string): void {
  const queuePath = path.join(__dirname, "best-of-denver-queue.json");
  const queue: QueueEntry[] = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
  const entry = queue.find((e) => e.slug === slug);
  if (entry) {
    entry.status = "published";
    entry.publishedAt = new Date().toISOString();
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    console.log(`[publish] Queue entry "${slug}" marked as published.`);
  }
}

function markFailed(slug: string): void {
  const queuePath = path.join(__dirname, "best-of-denver-queue.json");
  const queue: QueueEntry[] = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
  const entry = queue.find((e) => e.slug === slug);
  if (entry) {
    entry.status = "failed";
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    console.log(`[publish] Queue entry "${slug}" marked as failed.`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");

  if (!slug) {
    console.error(
      "Usage: npx tsx scripts/publish-post.ts <slug> [--dry-run]"
    );
    process.exit(1);
  }

  const draftPath = path.join(__dirname, "drafts", `${slug}.json`);
  if (!fs.existsSync(draftPath)) {
    console.error(
      `Draft not found at scripts/drafts/${slug}.json. Run draft-post.ts first.`
    );
    process.exit(1);
  }

  const rawDraft = JSON.parse(fs.readFileSync(draftPath, "utf-8"));
  // Strip _verification metadata before serializing (not part of Post interface)
  const { _verification: _stripped, ...rawPost } = rawDraft as Post & { _verification?: unknown };
  // Enforce the no-em-dash house style on generated content. The model still
  // produces em dashes; replace every one with a comma before it lands in
  // posts.ts so the rule holds without a manual cleanup pass.
  const post = stripEmDashes(rawPost);

  console.log(`\n[publish-post] Publishing: ${post.title}`);
  if (dryRun) {
    console.log("[publish-post] DRY RUN MODE: no files will be modified or pushed.");
  }

  // Refuse to publish a post whose hero image was never written. draft-post's
  // generateImage() swallows failures and returns the path anyway, so a flaky
  // image API would otherwise ship a post with broken artwork. Exit without
  // marking the entry failed so the next run retries (regenerating the image).
  if (!dryRun) {
    const imageFsPath = path.join(PROJECT_ROOT, "public", post.image.replace(/^\//, ""));
    if (!fs.existsSync(imageFsPath)) {
      console.error(
        `[publish-post] Hero image missing at ${imageFsPath}. Refusing to ` +
          `publish "${post.title}" with broken artwork. Queue entry left pending for retry.`
      );
      process.exit(1);
    }
  }

  try {
    appendPostToFile(post, dryRun);

    if (!dryRun) {
      // Mark the queue entry published BEFORE committing, so the status change
      // is included in the same commit. Otherwise the queue stays "pending" in
      // the repo and the next run republishes the same post.
      markPublished(slug);
      gitCommitAndPush(post.title);
      console.log(`\n[publish-post] Done. "${post.title}" is live.`);
    } else {
      console.log(
        "\n[publish-post] Dry run complete. Review the output above, then run without --dry-run to publish."
      );
    }
  } catch (err) {
    if (!dryRun) {
      markFailed(slug);
    }
    console.error("[publish-post] Error:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[publish-post] Fatal error:", err);
  process.exit(1);
});
