"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function WorkWithUsClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interests: [] as string[], message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const interestOptions = ['Partner on the Podcast/Newsletter', 'Apply for a Podcast Interview', 'Feature a Product'];

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'partnership', name: formData.name, email: formData.email, phone: formData.phone, interests: formData.interests, message: formData.message }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', interests: [], message: '' });
      toast({ title: "Success!", description: "Thank you for your partnership inquiry. We'll get back to you soon!" });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: "Error", description: "There was a problem submitting your inquiry. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Let&apos;s make<br /><span className="text-primary">something real good.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            Our community is made up of curious, engaged, and passionate Denverites. Whether you&apos;re a brand, founder, or local maker, we want to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <InterestsSection />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-2xl mx-auto px-6">
          <FormSection
            formData={formData}
            isSubmitting={isSubmitting}
            submitted={submitted}
            interestOptions={interestOptions}
            onInterestChange={handleInterestChange}
            onInputChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const InterestsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const items = [
    { title: 'Partner on the Podcast/Newsletter', description: "Reach thousands of locals who live, work, and play in Denver. From pre-rolls to display ads, we'll craft a placement that works." },
    { title: 'Apply for a Podcast Interview', description: "Got a story Denver needs to hear? Whether you're a founder, artist, activist, chef, or changemaker, we'd love to have you." },
    { title: 'Feature a Product', description: "Have a product made in or for Denver? We highlight select goods and services that bring value to our readers' everyday lives." },
  ];

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Opportunities</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">How we can work together</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormSection = ({ formData, isSubmitting, submitted, interestOptions, onInterestChange, onInputChange, onSubmit }: {
  formData: { name: string; email: string; phone: string; interests: string[]; message: string };
  isSubmitting: boolean; submitted: boolean; interestOptions: string[];
  onInterestChange: (i: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Get started</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Let&apos;s talk</h2>
        <p className="text-muted-foreground">Fill out the form and we&apos;ll get back to you faster than a scooter on Colfax.</p>
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-2">Thanks for reaching out!</h4>
          <p className="text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="name" value={formData.name} onChange={onInputChange} placeholder="Your name *" required
              className="h-12 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="email" name="email" value={formData.email} onChange={onInputChange} placeholder="your@email.com *" required
              className="h-12 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} placeholder="Phone (optional)"
            className="w-full h-12 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <div>
            <p className="text-sm font-medium text-foreground mb-3">What are you interested in? *</p>
            <div className="space-y-3">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => onInterestChange(interest)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
                  <span className="text-foreground group-hover:text-primary transition-colors">{interest}</span>
                </label>
              ))}
            </div>
          </div>
          <textarea name="message" value={formData.message} onChange={onInputChange} rows={5} placeholder="Tell us about your project, goals, timeline..." required
            className="w-full px-3 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <div className="text-center">
            <button type="submit" disabled={isSubmitting || formData.interests.length === 0}
              className="inline-flex items-center bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Mail className="w-5 h-5 mr-2" /> Send Message</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
