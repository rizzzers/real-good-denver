import type { Metadata } from "next";
import PartnershipClient from "./PartnershipClient";

export const metadata: Metadata = {
  title: "Partner With Real Good Denver | Reach 20,000 Denverites",
  description:
    "Advertise with Real Good Denver and reach 20,000 engaged locals through email, podcast, and video. Guaranteed impressions, native integration, repurposable content.",
  alternates: {
    canonical: "https://realgooddenver.com/partnership",
  },
  openGraph: {
    title: "Partner With Real Good Denver | Reach 20,000 Denverites",
    description:
      "Advertise with Real Good Denver and reach 20,000 engaged locals through email, podcast, and video. Guaranteed impressions, native integration, repurposable content.",
    url: "https://realgooddenver.com/partnership",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Partner With Real Good Denver | Reach 20,000 Denverites",
    description:
      "Advertise with Real Good Denver and reach 20,000 engaged locals through email, podcast, and video. Guaranteed impressions, native integration, repurposable content.",
    images: ["/og-image.jpg"],
  },
};

export default function PartnershipPage() {
  return <PartnershipClient />;
}
