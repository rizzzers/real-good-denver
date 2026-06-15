import type { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";

export const metadata: Metadata = {
  title: "Denver Resources | Real Good Denver",
  description:
    "Helpful Denver resources, from events and activities to food, outdoors, and local services. Curated links for every Denverite.",
  alternates: {
    canonical: "https://realgooddenver.com/resources",
  },
  openGraph: {
    title: "Denver Resources | Real Good Denver",
    description:
      "Helpful Denver resources, from events and activities to food, outdoors, and local services. Curated links for every Denverite.",
    url: "https://realgooddenver.com/resources",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Denver Resources | Real Good Denver",
    description:
      "Helpful Denver resources, from events and activities to food, outdoors, and local services. Curated links for every Denverite.",
    images: ["/og-image.jpg"],
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
