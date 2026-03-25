import type { Metadata } from "next";
import { newsletterIssues } from "@/data/newsletterIssues";
import NewsletterIssueClient from "./NewsletterIssueClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = newsletterIssues.find((i) => i.slug === slug);

  if (!issue) {
    return {
      title: "Newsletter Issue Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: issue.title,
    description: issue.description,
    alternates: {
      canonical: `https://realgooddenver.com/newsletter/${issue.slug}`,
    },
    openGraph: {
      title: issue.title,
      description: issue.description,
      url: `https://realgooddenver.com/newsletter/${issue.slug}`,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@realgooddenver",
      title: issue.title,
      description: issue.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function NewsletterIssuePage() {
  return <NewsletterIssueClient />;
}
