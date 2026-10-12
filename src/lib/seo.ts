import type { Post } from "@/data/posts";

export const SITE_URL = "https://realgooddenver.com";

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

export const postUrl = (post: Post) => `${SITE_URL}/best-of-denver/post/${post.slug}`;

// Serialize JSON-LD safely for inline <script> tags.
export const jsonLd = (data: unknown) => ({
  __html: JSON.stringify(data).replace(/</g, "\\u003c"),
});

const authorSchema = (author: string) =>
  author.startsWith("Real Good Denver")
    ? { "@type": "Organization", name: "Real Good Denver", url: SITE_URL }
    : { "@type": "Person", name: author, url: `${SITE_URL}/about` };

export const postSchema = (post: Post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  image: [absoluteUrl(post.image)],
  datePublished: post.date,
  dateModified: post.date,
  author: authorSchema(post.author),
  publisher: {
    "@type": "Organization",
    name: "Real Good Denver",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/real-good-denver-logo.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": postUrl(post) },
  articleSection: post.category,
  keywords: post.tags.join(", "),
  contentLocation: { "@type": "Place", name: "Denver, Colorado" },
});

export const breadcrumbSchema = (post: Post) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Best of Denver", item: `${SITE_URL}/best-of-denver` },
    { "@type": "ListItem", position: 3, name: post.title, item: postUrl(post) },
  ],
});

export const sortedPosts = (posts: Post[]) =>
  [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
