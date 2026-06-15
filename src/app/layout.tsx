import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Real Good Denver: Denver's Weekly Newsletter",
    template: "%s | Real Good Denver",
  },
  description:
    "Your weekly guide to Denver events, local news, and the good stuff worth knowing. 20,000+ Denverites read us every Wednesday.",
  metadataBase: new URL("https://realgooddenver.com"),
  alternates: {
    canonical: "https://realgooddenver.com",
  },
  openGraph: {
    siteName: "Real Good Denver",
    type: "website",
    locale: "en_US",
    title: "Real Good Denver: Denver's Weekly Newsletter",
    description:
      "Your weekly guide to Denver events, local news, and the good stuff worth knowing. 20,000+ Denverites read us every Wednesday.",
    url: "https://realgooddenver.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Real Good Denver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@realgooddenver",
    creator: "@realgooddenver",
    title: "Real Good Denver: Denver's Weekly Newsletter",
    description:
      "Your weekly guide to Denver events, local news, and the good stuff worth knowing. 20,000+ Denverites read us every Wednesday.",
    images: ["/og-image.jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Real Good Denver",
  url: "https://realgooddenver.com",
  logo: "https://realgooddenver.com/real-good-denver-logo.png",
  sameAs: [
    "https://twitter.com/realgooddenver",
    "https://www.youtube.com/@RealGoodDenver",
    "https://open.spotify.com/show/27VuIWVn2CfSGliuKNXkt7",
    "https://podcasts.apple.com/us/podcast/real-good-denver/id602890961",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Real Good Denver",
  url: "https://realgooddenver.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://realgooddenver.com/best-of-denver?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: ["Best of Denver", "Podcast", "Newsletter", "Jobs", "Work With Us"],
  url: [
    "https://realgooddenver.com/best-of-denver",
    "https://realgooddenver.com/podcast",
    "https://realgooddenver.com/newsletter",
    "https://realgooddenver.com/jobs",
    "https://realgooddenver.com/work-with-us",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="schema-navigation"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
      </head>
      <body className="antialiased">{children}</body>
      <GoogleAnalytics gaId="G-94HYTCSQ71" />
    </html>
  );
}
