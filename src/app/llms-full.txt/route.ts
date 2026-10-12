import { posts } from "@/data/posts";
import { postUrl, sortedPosts } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const articles = sortedPosts(posts)
    .map(
      (post) => `# ${post.title}

URL: ${postUrl(post)}
Published: ${post.date}
Author: ${post.author}
Category: ${post.category}

${post.fullContent.trim()}`
    )
    .join("\n\n---\n\n");

  const body = `# Real Good Denver: Best of Denver (full text)

> Every Best of Denver guide from realgooddenver.com, in full.

${articles}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
