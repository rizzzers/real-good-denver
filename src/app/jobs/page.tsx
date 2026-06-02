import type { Metadata } from "next";
import JobsClient from "./JobsClient";

export const metadata: Metadata = {
  title: "Denver Jobs | Real Good Denver",
  description:
    "Find Denver job listings curated for locals, from boardrooms to creative roles, get personalized Denver job alerts delivered straight to your inbox.",
  alternates: {
    canonical: "https://realgooddenver.com/jobs",
  },
  openGraph: {
    title: "Denver Jobs | Real Good Denver",
    description:
      "Find Denver job listings curated for locals, from boardrooms to creative roles, get personalized Denver job alerts delivered straight to your inbox.",
    url: "https://realgooddenver.com/jobs",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Denver Jobs | Real Good Denver",
    description:
      "Find Denver job listings curated for locals, from boardrooms to creative roles, get personalized Denver job alerts delivered straight to your inbox.",
    images: ["/og-image.jpg"],
  },
};

export default function JobsPage() {
  return <JobsClient />;
}
