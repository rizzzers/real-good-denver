"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { newsletterIssues } from "@/data/newsletterIssues";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NewsletterIssueClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const issue = newsletterIssues.find((i) => i.slug === slug);

  useEffect(() => {
    if (!issue) return;
    fetch(issue.htmlFile)
      .then((res) => res.text())
      .then((html) => {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const rawHtml = bodyMatch ? bodyMatch[1] : html;
        const sanitized = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        setHtmlContent(sanitized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [issue]);

  if (!issue) {
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
          <p className="text-background/40">
            {(() => {
              const [y, m, d] = issue.date.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            })()}
          </p>
        </div>
      </section>

      <div className="bg-foreground">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          {loading ? (
            <div className="py-16 text-center text-background/50">Loading...</div>
          ) : (
            <div className="newsletter-issue-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
