import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Real Good Denver | Denver's Weekly Newsletter",
  description:
    "Meet the team behind Real Good Denver, the loudest love letter to the Mile High City, delivered as a weekly newsletter and top-ranked podcast.",
  alternates: {
    canonical: "https://realgooddenver.com/about",
  },
  openGraph: {
    title: "About Real Good Denver | Denver's Weekly Newsletter",
    description:
      "Meet the team behind Real Good Denver, the loudest love letter to the Mile High City, delivered as a weekly newsletter and top-ranked podcast.",
    url: "https://realgooddenver.com/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "About Real Good Denver | Denver's Weekly Newsletter",
    description:
      "Meet the team behind Real Good Denver, the loudest love letter to the Mile High City, delivered as a weekly newsletter and top-ranked podcast.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
