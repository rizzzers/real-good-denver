"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { toast } = useToast();

  const headlines = [
    "The events nobody else covers.",
    "The news that actually matters.",
    "The jobs worth applying for.",
    "The Denver you've been missing.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("newsletter-signup", {
        body: { name: name.trim(), email: email.trim(), source: "homepage-hero" },
      });
      if (error) throw error;
      setSubmitted(true);
      setName("");
      setEmail("");
      toast({ title: "You're in!", description: "Welcome to Real Good Denver." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          <span className="text-sm font-medium text-background/70 tracking-wide">20,000+ Denverites read us weekly</span>
        </div>

        <h1
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-background mb-6 leading-[0.95] tracking-tight animate-fade-in mt-16 md:mt-0"
          style={{ animationDelay: "0.15s" }}
        >
          Denver deserves<br />
          <span className="text-primary">all the good.</span>
        </h1>

        <div className="h-10 md:h-12 mb-6 overflow-hidden">
          <p key={headlineIndex} className="text-lg md:text-2xl text-background/60 font-light animate-fade-in">
            {headlines[headlineIndex]}
          </p>
        </div>

        <div className="max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-lg font-medium text-background">Check your inbox, you&apos;re in.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 flex-1 px-4 bg-background/10 border border-background/15 text-background placeholder:text-background/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 flex-1 px-4 bg-background/10 border border-background/15 text-background placeholder:text-background/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex-shrink-0 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Join Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="text-xs text-background/30 mt-4">Free forever. Unsubscribe anytime. No spam, just Denver.</p>

          <div className="inline-flex md:hidden items-center gap-2 px-4 py-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm mt-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-sm font-medium text-background/70 tracking-wide">20,000+ Denverites read us weekly</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-6 h-6 text-background/30" />
      </div>
    </section>
  );
};

export default HeroSection;
