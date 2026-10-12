import { posts } from "@/data/posts";
import { newsletterIssues } from "@/data/newsletterIssues";
import { SITE_URL, postUrl, sortedPosts } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const postLines = sortedPosts(posts)
    .map((post) => `- [${post.title}](${postUrl(post)}): ${post.excerpt}`)
    .join("\n");

  const issueLines = newsletterIssues
    .slice(0, 20)
    .map((issue) => `- [${issue.title}](${SITE_URL}/newsletter/${issue.slug}) (${issue.date})`)
    .join("\n");

  const body = `# Real Good Denver

> Local Denver newsletter, podcast, and "Best of Denver" guides covering food, drink, neighborhoods, events, and culture, written by people who actually live here. Founded by Ryan Estes.

We write for Denver metro residents, not tourists. Best of Denver guides rank specific places with neighborhood, address, and website for each pick. The full text of every guide is available at ${SITE_URL}/llms-full.txt.

## Best of Denver guides

${postLines}

## Main pages

- [Best of Denver](${SITE_URL}/best-of-denver): Index of every local guide
- [Newsletter](${SITE_URL}/newsletter): Weekly Denver news roundup archive
- [Podcast](${SITE_URL}/podcast): Real Good Denver podcast episodes
- [About](${SITE_URL}/about): Who we are
- [Work With Us](${SITE_URL}/work-with-us): Advertising and partnerships

## Recent newsletter issues

${issueLines}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
