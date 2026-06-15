/**
 * run-publish.ts
 *
 * Cron entry point. Finds the next pending post in the queue (respecting seasonal rules),
 * runs draft-post then publish-post end-to-end, logs everything.
 *
 * Usage: npx tsx scripts/run-publish.ts [--dry-run]
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  publishedAt?: string;
}

// ---------------------------------------------------------------------------
// Seasonal gate
// ---------------------------------------------------------------------------

function getCurrentSeason(date: Date): "spring" | "summer" | "fall" | "winter" {
  const month = date.getMonth(); // 0-indexed: Jan=0, Dec=11
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

function isEntrySchedulable(entry: QueueEntry, today: Date): boolean {
  if (!entry.season) return true; // non-seasonal: always eligible
  const season = getCurrentSeason(today);
  return entry.season === season;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function createLogger(slug: string): (msg: string) => void {
  const logsDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  const dateStr = new Date().toISOString().split("T")[0];
  const logFile = path.join(logsDir, `${dateStr}.log`);

  return (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync(logFile, line + "\n");
  };
}

// ---------------------------------------------------------------------------
// Exec with logging
// ---------------------------------------------------------------------------

function runScript(
  scriptName: string,
  args: string[],
  log: (msg: string) => void
): void {
  const scriptsDir = __dirname;
  const cmd = `npx tsx "${path.join(scriptsDir, scriptName)}" ${args.join(" ")}`;
  log(`Running: ${cmd}`);
  try {
    const output = execSync(cmd, {
      cwd: path.join(__dirname, ".."),
      env: { ...process.env },
      encoding: "utf-8",
    });
    output.split("\n").forEach((line) => line && log(`  ${line}`));
  } catch (err: any) {
    const msg = err?.stdout || err?.stderr || String(err);
    msg.split("\n").forEach((line: string) => line && log(`  ERROR: ${line}`));
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  // Catch-up runs pass this so a second daily cron only publishes when the
  // primary run did not (e.g. GitHub dropped or badly delayed the first job).
  const skipIfPublishedToday = process.argv.includes("--skip-if-published-today");
  const today = new Date();

  const queuePath = path.join(__dirname, "best-of-denver-queue.json");
  const queue: QueueEntry[] = JSON.parse(fs.readFileSync(queuePath, "utf-8"));

  const log = createLogger("run");

  if (skipIfPublishedToday) {
    const todayStr = today.toISOString().split("T")[0];
    const already = queue.find(
      (e) => e.status === "published" && e.publishedAt?.split("T")[0] === todayStr
    );
    if (already) {
      log(
        `Catch-up run: "${already.title}" already published today ` +
          `(${already.publishedAt}). Nothing to do.`
      );
      process.exit(0);
    }
    log("Catch-up run: nothing published yet today. Proceeding with publish.");
  }

  // Find the first pending entry that is in-season
  const next = queue.find(
    (e) => e.status === "pending" && isEntrySchedulable(e, today)
  );

  if (!next) {
    const season = getCurrentSeason(today);
    log(
      `No eligible pending posts found. Current season: ${season}. ` +
        `Seasonal posts outside their window are skipped. Queue may be exhausted.`
    );
    process.exit(0);
  }

  log(
    `Selected: "${next.title}" (slug: ${next.slug}, season: ${next.season ?? "any"})`
  );
  if (dryRun) log("DRY RUN MODE: git push will be skipped.");

  try {
    log("--- Step 1: Draft ---");
    runScript("draft-post.ts", [next.slug], log);

    log("--- Step 2: Publish ---");
    const publishArgs = [next.slug];
    if (dryRun) publishArgs.push("--dry-run");
    runScript("publish-post.ts", publishArgs, log);

    log(`--- Done: "${next.title}" published successfully. ---`);
  } catch (err) {
    log(`--- FAILED: "${next.title}" encountered an error. See above. ---`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[run-publish] Fatal:", err);
  process.exit(1);
});
