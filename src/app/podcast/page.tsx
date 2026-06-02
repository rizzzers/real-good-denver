import type { Metadata } from "next";
import PodcastClient from "./PodcastClient";

export const metadata: Metadata = {
  title: "The Real Good Denver Podcast",
  description:
    "Listen to the Real Good Denver podcast, Denver stories, local culture, and the people shaping the Mile High City. Top 1% globally ranked.",
  alternates: {
    canonical: "https://realgooddenver.com/podcast",
  },
  openGraph: {
    title: "The Real Good Denver Podcast",
    description:
      "Listen to the Real Good Denver podcast, Denver stories, local culture, and the people shaping the Mile High City. Top 1% globally ranked.",
    url: "https://realgooddenver.com/podcast",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "The Real Good Denver Podcast",
    description:
      "Listen to the Real Good Denver podcast, Denver stories, local culture, and the people shaping the Mile High City. Top 1% globally ranked.",
    images: ["/og-image.jpg"],
  },
};

export default function PodcastPage() {
  return <PodcastClient />;
}
