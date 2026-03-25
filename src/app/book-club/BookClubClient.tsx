"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { BookOpen, Users, MapPin, Calendar, CheckCircle } from "lucide-react";

export default function BookClubClient() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-signup", {
        body: { name, email, source: 'bookclub' },
      });
      if (error) throw error;
      toast({ title: "Welcome to the club!", description: "We'll send you details about our next book selection soon!" });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting book club signup:", error);
      toast({ title: "Oops!", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background/10 border border-background/10 mb-8">
            <BookOpen className="w-10 h-10 text-background/70" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Denver<br /><span className="text-secondary">Book Club.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            Join fellow Denver book lovers as we explore Colorado stories, one page at a time.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-md mx-auto px-6">
          <SignupForm name={name} email={email} submitted={submitted} isSubmitting={isSubmitting}
            onNameChange={setName} onEmailChange={setEmail} onSubmit={handleSubmit} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-5xl mx-auto px-6">
          <HowItWorks />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-3xl mx-auto px-6">
          <WhatToExpect />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const SignupForm = ({ name, email, submitted, isSubmitting, onNameChange, onEmailChange, onSubmit }: {
  name: string; email: string; submitted: boolean; isSubmitting: boolean;
  onNameChange: (v: string) => void; onEmailChange: (v: string) => void; onSubmit: (e: React.FormEvent) => void;
}) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Join us</p>
        <h2 className="text-3xl font-bold text-foreground mb-2">Join the club</h2>
        <p className="text-muted-foreground">Get notified about our next book selection and meeting details.</p>
      </div>

      {submitted ? (
        <div className="text-center py-8 rounded-2xl border border-border bg-card p-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">You&apos;re in!</h3>
          <p className="text-muted-foreground">Keep an eye on your inbox for our next book announcement.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Your name"
                className="w-full h-12 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required placeholder="your@email.com"
                className="w-full h-12 px-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join the Book Club"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();
  const items = [
    { icon: Users, title: 'Community Voting', description: 'Each month, we nominate and vote on Denver and Colorado-themed books.' },
    { icon: MapPin, title: 'Hybrid Meetups', description: "Meet online and in person at cozy Denver spots. Can't make it? Join virtually!" },
    { icon: Calendar, title: 'Monthly Discussions', description: 'We meet once a month to dive deep. Share insights and discover new perspectives.' },
    { icon: BookOpen, title: 'Local Focus', description: 'From tales of the Front Range to stories of the Western Slope, Colorado literary culture.' },
  ];

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">How it works</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">The details</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WhatToExpect = () => {
  const { ref, isVisible } = useScrollReveal();
  const expectations = [
    'Monthly book selections focused on Denver and Colorado themes',
    'Thoughtful discussions that go beyond plot summaries',
    'A welcoming community of readers at all levels',
    'Flexible participation, attend in person or virtually',
    'Connections with local bookstores and authors when possible',
  ];

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Expectations</p>
        <h2 className="text-3xl md:text-4xl font-bold text-background">What to expect</h2>
      </div>
      <ul className="space-y-4">
        {expectations.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-background/70">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
