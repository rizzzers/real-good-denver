import type { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "Real Good Denver Newsletter | Weekly Denver News",
  description:
    "Subscribe to Real Good Denver — the weekly newsletter 20,000+ Denverites rely on for local news, events, and the good stuff worth knowing every Wednesday.",
  alternates: {
    canonical: "https://realgooddenver.com/newsletter",
  },
  openGraph: {
    title: "Real Good Denver Newsletter | Weekly Denver News",
    description:
      "Subscribe to Real Good Denver — the weekly newsletter 20,000+ Denverites rely on for local news, events, and the good stuff worth knowing every Wednesday.",
    url: "https://realgooddenver.com/newsletter",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Real Good Denver Newsletter | Weekly Denver News",
    description:
      "Subscribe to Real Good Denver — the weekly newsletter 20,000+ Denverites rely on for local news, events, and the good stuff worth knowing every Wednesday.",
    images: ["/og-image.jpg"],
  },
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
