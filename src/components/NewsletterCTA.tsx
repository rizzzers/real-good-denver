"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface NewsletterCTAProps {
  isNightMode?: boolean;
}

const NewsletterCTA = ({ isNightMode = false }: NewsletterCTAProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke("newsletter-signup", {
        body: { name: name.trim(), email: email.trim(), source: "newsletter" },
      });
      if (error) throw error;
      toast({ title: "You're in!", description: "Welcome to Real Good Denver. Check your inbox soon." });
      setName("");
      setEmail("");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`py-16 md:py-24 transition-colors duration-500 ${isNightMode ? "bg-secondary" : "bg-primary"}`}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className={`text-sm font-medium uppercase tracking-wider mb-6 transition-colors duration-500 ${isNightMode ? "text-secondary-foreground/80" : "text-primary-foreground/80"}`}>
          Denver&apos;s Fastest Growing Newsletter!
        </p>
        <div className="flex justify-center mb-6">
          <img
            src="/real-good-denver-logo.png"
            alt="Real Good Denver"
            className={`h-16 md:h-24 transition-all duration-500 ${isNightMode ? "brightness-0 invert" : ""}`}
          />
        </div>
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${isNightMode ? "text-secondary-foreground" : "text-primary-foreground"}`}>
          Get the Real Good Denver Newsletter
        </h2>
        <p className={`text-lg mb-8 max-w-xl mx-auto transition-colors duration-500 ${isNightMode ? "text-secondary-foreground/80" : "text-primary-foreground/80"}`}>
          Denver events, local news, and the stuff worth knowing, delivered to your inbox every week.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`flex-1 h-10 px-3 rounded-md border text-sm transition-colors duration-500 ${isNightMode ? "bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50" : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"}`}
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`flex-1 h-10 px-3 rounded-md border text-sm transition-colors duration-500 ${isNightMode ? "bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50" : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"}`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`h-10 px-4 rounded-md font-semibold text-sm transition-colors duration-500 flex items-center gap-2 ${isNightMode ? "bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90" : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"}`}
          >
            {isLoading ? "Signing up..." : "Subscribe"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>

        <p className={`text-sm mt-4 transition-colors duration-500 ${isNightMode ? "text-secondary-foreground/60" : "text-primary-foreground/60"}`}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsletterCTA;
