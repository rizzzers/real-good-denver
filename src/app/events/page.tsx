import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Denver Events | Real Good Denver",
  description:
    "The best events happening around Denver, curated for locals. From Father's Day dinners to Pride celebrations.",
  alternates: {
    canonical: "https://realgooddenver.com/events",
  },
  openGraph: {
    title: "Denver Events | Real Good Denver",
    description:
      "The best events happening around Denver, curated for locals. From Father's Day dinners to Pride celebrations.",
    url: "https://realgooddenver.com/events",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Denver Events | Real Good Denver",
    description:
      "The best events happening around Denver, curated for locals. From Father's Day dinners to Pride celebrations.",
    images: ["/og-image.jpg"],
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
