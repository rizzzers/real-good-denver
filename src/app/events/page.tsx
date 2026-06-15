import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Community Events | Real Good Denver",
  description:
    "Upcoming Denver community events worth leaving the house for. Submit your own event and we'll add it to the calendar.",
  alternates: {
    canonical: "https://realgooddenver.com/events",
  },
  openGraph: {
    title: "Community Events | Real Good Denver",
    description:
      "Upcoming Denver community events worth leaving the house for. Submit your own event and we'll add it to the calendar.",
    url: "https://realgooddenver.com/events",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    title: "Community Events | Real Good Denver",
    description:
      "Upcoming Denver community events worth leaving the house for. Submit your own event and we'll add it to the calendar.",
    images: ["/og-image.jpg"],
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
