import Image from "next/image";
import Link from "next/link";

export default function AuthorBio() {
  return (
    <div className="mt-12 mb-8 p-6 bg-card border border-border rounded-2xl shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Written by
      </p>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Image
            src="/ryan-estes.png"
            alt="Ryan Estes"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <Link
            href="https://www.linkedin.com/in/estesryan/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            Ryan Estes
          </Link>
          <p className="text-sm text-muted-foreground mb-2">Founder, Real Good Denver</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Ryan Estes is co-founder of Kitcaster, an eight-figure bootstrapped podcast
            booking agency acquired by Moburst in 2025. He created AI for Founders, a
            podcast, newsletter, and workshop platform reaching 47,000+ entrepreneurs
            and CEOs. Based in Denver, Colorado.
          </p>
        </div>
      </div>
    </div>
  );
}
