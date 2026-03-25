import type { Metadata } from "next";
import { posts } from "@/data/posts";
import BestOfDenverPostClient from "./BestOfDenverPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://realgooddenver.com/best-of-denver/post/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://realgooddenver.com/best-of-denver/post/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@realgooddenver",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function PostDetailPage() {
  return <BestOfDenverPostClient />;
}
