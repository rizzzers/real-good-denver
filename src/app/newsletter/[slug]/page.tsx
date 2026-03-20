"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface NewsletterIssue {
  id: string;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  html_content: string;
}

export default function NewsletterIssuePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [issue, setIssue] = useState<NewsletterIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("newsletter_issues")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setIssue(data);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-40 text-center text-muted-foreground">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (notFound || !issue) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Issue not found</h1>
          <Link href="/newsletter" className="text-primary underline mt-4 inline-block">← Back to Newsletter</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const date = issue.published_at ? new Date(issue.published_at) : null;

  // Strip script tags from html_content for safety
  const sanitized = issue.html_content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-foreground pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-background/50 hover:text-primary transition-colors mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Newsletter
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-background mb-4 leading-tight">{issue.title}</h1>
          {date && (
            <p className="text-background/40">
              {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
      </section>

      <div className="bg-foreground">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div className="newsletter-issue-content" dangerouslySetInnerHTML={{ __html: sanitized }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
