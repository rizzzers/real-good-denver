import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { placesSchema } from "@/lib/places";
import { relatedPosts } from "@/lib/related";
import { breadcrumbSchema, jsonLd, postSchema, postUrl } from "@/lib/seo";
import BestOfDenverPostClient from "./BestOfDenverPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
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
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
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

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const places = placesSchema(post, postUrl(post));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(postSchema(post))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(post))} />
      {places && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(places)} />}
      <BestOfDenverPostClient related={relatedPosts(post, posts)} />
    </>
  );
}
