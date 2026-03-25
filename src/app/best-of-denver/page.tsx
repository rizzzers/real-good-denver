import type { Metadata } from "next";
import BestOfDenverClient from "./BestOfDenverClient";

export const metadata: Metadata = {
  title: "Best of Denver | Local Guides & Recommendations",
  description:
    "Discover the best Denver has to offer — hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
  alternates: {
    canonical: "https://realgooddenver.com/best-of-denver",
  },
  openGraph: {
    title: "Best of Denver | Local Guides & Recommendations",
    description:
      "Discover the best Denver has to offer — hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
    url: "https://realgooddenver.com/best-of-denver",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Best of Denver | Local Guides & Recommendations",
    description:
      "Discover the best Denver has to offer — hidden gems, local favorites, and must-visit spots curated by people who actually live here.",
    images: ["/og-image.jpg"],
  },
};

export default function BestOfDenverPage() {
  return <BestOfDenverClient />;
}
