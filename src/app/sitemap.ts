import { MetadataRoute } from "next";
import { newsletterIssues } from "@/data/newsletterIssues";
import { posts } from "@/data/posts";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://realgooddenver.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/podcast`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/best-of-denver`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/work-with-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/partnership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/book-club`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
{ url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/terms-and-privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const newsletterRoutes: MetadataRoute.Sitemap = newsletterIssues.map((issue) => ({
    url: `${baseUrl}/newsletter/${issue.slug}`,
    lastModified: new Date(issue.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/best-of-denver/post/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let podcastRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: episodes } = await supabase
      .from("podcast_episodes")
      .select("title, pubDate");

    if (episodes) {
      podcastRoutes = episodes.map(
        (ep: { title: string; pubDate?: string }) => ({
          url: `${baseUrl}/podcast/${slugify(ep.title)}`,
          lastModified: ep.pubDate ? new Date(ep.pubDate) : new Date(),
          changeFrequency: "yearly" as const,
          priority: 0.6,
        })
      );
    }
  } catch {
    // Supabase unavailable at build time — omit podcast routes
  }

  return [...staticRoutes, ...newsletterRoutes, ...postRoutes, ...podcastRoutes];
}
