import type { Metadata } from "next";
import RestaurantFinderClient from "./RestaurantFinderClient";

export const metadata: Metadata = {
  title: "Hidden Gem Restaurant Finder | Real Good Denver",
  description:
    "Find off-the-beaten-path Denver restaurants — local hidden gems and neighborhood favorites recommended by people who actually eat here.",
  alternates: {
    canonical: "https://realgooddenver.com/restaurant-finder",
  },
  openGraph: {
    title: "Hidden Gem Restaurant Finder | Real Good Denver",
    description:
      "Find off-the-beaten-path Denver restaurants — local hidden gems and neighborhood favorites recommended by people who actually eat here.",
    url: "https://realgooddenver.com/restaurant-finder",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Hidden Gem Restaurant Finder | Real Good Denver",
    description:
      "Find off-the-beaten-path Denver restaurants — local hidden gems and neighborhood favorites recommended by people who actually eat here.",
    images: ["/og-image.jpg"],
  },
};

export default function RestaurantFinderPage() {
  return <RestaurantFinderClient />;
}
