import type { Metadata } from "next";
import WorkWithUsClient from "./WorkWithUsClient";

export const metadata: Metadata = {
  title: "Work With Us | Real Good Denver",
  description:
    "Partner with Real Good Denver, apply for a podcast interview, sponsor the newsletter, or feature your product to an engaged Denver audience.",
  alternates: {
    canonical: "https://realgooddenver.com/work-with-us",
  },
  openGraph: {
    title: "Work With Us | Real Good Denver",
    description:
      "Partner with Real Good Denver, apply for a podcast interview, sponsor the newsletter, or feature your product to an engaged Denver audience.",
    url: "https://realgooddenver.com/work-with-us",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Work With Us | Real Good Denver",
    description:
      "Partner with Real Good Denver, apply for a podcast interview, sponsor the newsletter, or feature your product to an engaged Denver audience.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkWithUsPage() {
  return <WorkWithUsClient />;
}
