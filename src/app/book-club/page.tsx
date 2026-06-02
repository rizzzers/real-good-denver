import type { Metadata } from "next";
import BookClubClient from "./BookClubClient";

export const metadata: Metadata = {
  title: "Real Good Denver Book Club",
  description:
    "Join the Real Good Denver Book Club, connect with Denver readers, discover great books, and be part of a community that loves good stories and good company.",
  alternates: {
    canonical: "https://realgooddenver.com/book-club",
  },
  openGraph: {
    title: "Real Good Denver Book Club",
    description:
      "Join the Real Good Denver Book Club, connect with Denver readers, discover great books, and be part of a community that loves good stories and good company.",
    url: "https://realgooddenver.com/book-club",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Real Good Denver Book Club",
    description:
      "Join the Real Good Denver Book Club, connect with Denver readers, discover great books, and be part of a community that loves good stories and good company.",
    images: ["/og-image.jpg"],
  },
};

export default function BookClubPage() {
  return <BookClubClient />;
}
