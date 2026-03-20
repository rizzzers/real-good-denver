import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    default: "Real Good Denver — Denver's Weekly Newsletter",
    template: "%s | Real Good Denver",
  },
  description:
    "Your weekly guide to Denver events, local news, and the good stuff worth knowing. 20,000+ Denverites read us every Wednesday.",
  metadataBase: new URL("https://realgooddenver.com"),
  openGraph: {
    siteName: "Real Good Denver",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">{children}</body>
      <GoogleAnalytics gaId="G-94HYTCSQ71" />
    </html>
  );
}
