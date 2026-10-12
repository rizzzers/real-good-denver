import type { Metadata } from "next";
import { posts } from "@/data/posts";
import { SITE_URL, jsonLd, postUrl, sortedPosts } from "@/lib/seo";
import BestOfDenverClient from "./BestOfDenverClient";

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best of Denver",
  description:
    "Hidden gems, local favorites, and must-visit spots in Denver, curated by people who actually live here.",
  url: `${SITE_URL}/best-of-denver`,
  isPartOf: { "@type": "WebSite", name: "Real Good Denver", url: SITE_URL },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: posts.length,
    itemListElement: sortedPosts(posts).map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: postUrl(post),
      name: post.title,
    })),
  },
};

export const metadata: Metadata = {
  title: "Best of Denver | Local Guides & Recommendations",
  description:
    "Discover the best Denver has to offer, hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
  alternates: {
    canonical: "https://realgooddenver.com/best-of-denver",
  },
  openGraph: {
    title: "Best of Denver | Local Guides & Recommendations",
    description:
      "Discover the best Denver has to offer, hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
    url: "https://realgooddenver.com/best-of-denver",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Best of Denver | Local Guides & Recommendations",
    description:
      "Discover the best Denver has to offer, hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
    images: ["/og-image.jpg"],
  },
};

export default function BestOfDenverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collectionSchema)} />
      <BestOfDenverClient />
    </>
  );
}
