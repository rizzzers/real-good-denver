"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Music, Calendar, Palette, Trophy, UtensilsCrossed, MapPin, Mountain, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const topics = [
  { name: 'Music', icon: Music },
  { name: 'Events', icon: Calendar },
  { name: 'Art', icon: Palette },
  { name: 'Sports', icon: Trophy },
  { name: 'Food', icon: UtensilsCrossed },
  { name: 'Openings', icon: MapPin },
  { name: 'Outdoors', icon: Mountain },
  { name: 'History', icon: Clock },
];

export default function AboutClient() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', name: formData.name, email: formData.email, message: formData.message }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast({ title: "Message Sent!", description: "Thanks for reaching out! We'll get back to you soon." });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: "Error", description: "There was a problem sending your message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div ref={heroRef} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Real Good Denver?<br />
            <span className="text-secondary">Glad you asked.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            The loudest love letter to the Mile High City, wrapped in a podcast, shaken with mezcal, and served with green chile.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <TeamPhoto />
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <CreatorBios />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <StoryBlock />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-5xl mx-auto px-6">
          <TopicsGrid topics={topics} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-5xl mx-auto px-6">
          <StatsSection />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-2xl mx-auto px-6">
          <ContactForm
            formData={formData}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const TeamPhoto = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <img
        src="/images/about-team.jpg"
        alt="Ryan Estes and Tom Donahue — Real Good Denver"
        className="w-full object-cover"
      />
    </div>
  );
};

const CreatorBios = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">The creators</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">Built by Denverites.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Tom Donahue — left */}
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">Tom Donahue</h3>
            <p className="text-sm font-medium text-primary uppercase tracking-widest">Co-creator &amp; Producer</p>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Tom is an entrepreneur and house DJ who bleeds Denver. A CSU alumni, he brings the energy, the beats, and a genuine obsession with what makes this city move — from the underground music scene to the people building something real here.
            </p>
            <p>
              His ear for culture and instinct for what Denver actually cares about shapes everything Real Good Denver puts out. When he&apos;s not behind the decks, he&apos;s out in the city living the stories we tell.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Entrepreneur', 'House DJ', 'CSU Alumni', 'Denver'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ryan Estes — right */}
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">Ryan Estes</h3>
            <p className="text-sm font-medium text-primary uppercase tracking-widest">Co-creator &amp; Producer</p>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Born and raised in Denver, Ryan is a founder, investor, and creator with a bias toward action and a deep loyalty to his city. He co-created Real Good Denver to give Denver the platform it deserves — loud, honest, and unapologetically local.
            </p>
            <p>
              Off the mic, Ryan is an avid sportsman who trains in Brazilian Jiu-Jitsu (purple belt) and capoeira (yellow cord). He volunteers as a finance mentor and alongside his team contributes over 300 hours annually to local non-profits.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Denver Native', 'BJJ Purple Belt', 'Capoeira Yellow Cord', 'Finance Mentor', '300+ Volunteer Hours'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryBlock = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">Our story</p>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>Every week, Real Good Denver hooks you up with the weirdest, wildest, and most wonderful things happening around town. From late-night taco joints and underground comedy shows to rooftop raves and secret speakeasies.</p>
        <div>
          <p className="font-semibold text-foreground mb-3">We&apos;ll hit you with:</p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-3"><span className="text-primary mt-1">•</span> Hot takes on new restaurants</li>
            <li className="flex items-start gap-3"><span className="text-primary mt-1">•</span> Live music recs that&apos;ll make you actually leave your house</li>
            <li className="flex items-start gap-3"><span className="text-primary mt-1">•</span> Local legends and experts who know what&apos;s up</li>
            <li className="flex items-start gap-3"><span className="text-primary mt-1">•</span> Tips, hacks, and must-do&apos;s for food, fun, and full-blown Denver delight</li>
            <li className="flex items-start gap-3"><span className="text-primary mt-1">•</span> A healthy dose of sass, stories, and city pride</li>
          </ul>
        </div>
        <p>Whether you&apos;re a seasoned Denverite, a transplant trying to earn your stripes, or just here for the altitude, Real Good Denver is your new favorite way to explore the Queen City of the Plains.</p>
        <p className="font-medium text-foreground">So don&apos;t just sit there, subscribe, tune in, and get hyped for the best damn city on this side of the Rockies.</p>
      </div>
    </div>
  );
};

const TopicsGrid = ({ topics }: { topics: { name: string; icon: React.ElementType }[] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Coverage</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">What we cover</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <div key={topic.name} className="group p-6 rounded-2xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center"
              style={{ transitionDelay: `${index * 60}ms` }}>
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-foreground">{topic.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: '37,000+', label: 'Weekly readers' },
    { value: '200+', label: 'Episodes released' },
    { value: '500+', label: 'Venues featured' },
    { value: 'Top 1%', label: 'Global podcast ranking' },
  ];
  return (
    <div ref={ref} className={`grid grid-cols-2 md:grid-cols-4 gap-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-background mb-2">{stat.value}</p>
          <p className="text-sm text-background/40 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

const ContactForm = ({ formData, isSubmitting, submitted, onInputChange, onSubmit }: {
  formData: { name: string; email: string; message: string };
  isSubmitting: boolean;
  submitted: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Get in touch</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Let&apos;s connect</h2>
        <p className="text-muted-foreground">Got an event, launch, or hidden gem we should know about?</p>
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h4>
          <p className="text-muted-foreground">Thanks for reaching out! We&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder="Your name" required disabled={isSubmitting}
              className="w-full px-4 py-3 border border-border rounded-xl bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder="your@email.com" required disabled={isSubmitting}
              className="w-full px-4 py-3 border border-border rounded-xl bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
          <textarea name="message" rows={5} value={formData.message} onChange={onInputChange} placeholder="Tell us about your event, new business launch, or anything that makes Denver awesome..." required disabled={isSubmitting}
            className="w-full px-4 py-3 border border-border rounded-xl bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" />
          <div className="text-center">
            <button type="submit" disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
