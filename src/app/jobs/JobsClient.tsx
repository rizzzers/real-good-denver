"use client";

import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Target, MapPin, Bell, ArrowRight, Building2, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const companies = [
  'Cardinal Group Companies', 'Kroger', 'Businessolver', 'Benjamin Franklin Plumbing',
  'Reimagined Parking', 'Liberty Global', 'DigitalOcean', 'Xcel Energy',
  'LabCorp', 'Lumen Technologies', 'Aegon', 'Waste Connections',
  'Denver Public Schools', 'HCA', 'Dr. Martens', 'Vishay Precision Group',
  'SAIC', 'Arrow Electronics Inc.', 'Stantec Inc.', 'JLL',
  'Taco Bell', 'RTD', 'Imperial Dade'
];

const steps = [
  { icon: Target, title: 'Pick your interests', description: 'Select the job types and industries that match your goals' },
  { icon: MapPin, title: 'Set your location', description: 'Tell us where you want to work and how to reach you' },
  { icon: Bell, title: 'Get jobs delivered', description: 'Receive personalized job matches in your inbox' }
];

interface JobAlertsWindow extends Window {
  JobAlertsEmbed?: {
    instance: {
      isInitialized: boolean;
      init: (id: string) => void;
      show: () => void;
    };
  };
}

export default function JobsClient() {
  useEffect(() => {
    const loadScript = (src: string, onLoad?: () => void) => {
      // Don't add duplicate scripts
      if (document.querySelector(`script[src="${src}"]`)) {
        onLoad?.();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (onLoad) script.onload = onLoad;
      document.head.appendChild(script);
    };

    loadScript('https://www.jobstream.tech/signup/v1/jobstream-modal.js', () => {
      console.log('[Jobstream] jobstream-modal.js loaded');
      loadScript('https://www.jobstream.tech/signup/v1/job-alerts-embed.js', () => {
        console.log('[Jobstream] job-alerts-embed.js loaded');
        const w = window as JobAlertsWindow;
        console.log('[Jobstream] JobAlertsEmbed on window:', w.JobAlertsEmbed);
        if (w.JobAlertsEmbed && !w.JobAlertsEmbed.instance.isInitialized) {
          w.JobAlertsEmbed.instance.init('realgooddenver');
          console.log('[Jobstream] init called');
        } else {
          console.log('[Jobstream] already initialized or not found');
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Denver jobs,<br />
            <span className="text-primary">delivered.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 mb-4 max-w-xl mx-auto">
            From boardrooms to lifeguard chairs, the best local jobs, zero endless scrolling.
          </p>
          <p className="text-background/40 mb-10">Powered by Jobstream</p>

          <button
            id="job-alerts-btn-board"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold px-8 py-4 hover:scale-[1.02] transition-all"
            onClick={() => {
              const w = window as JobAlertsWindow;
              console.log('[Jobstream] button clicked, JobAlertsEmbed:', w.JobAlertsEmbed);
              w.JobAlertsEmbed?.instance.show();
            }}
          >
            Start Your Job Search <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <StepsSection steps={steps} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-5xl mx-auto px-6">
          <CompaniesSection companies={companies} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FinalCTA />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const StepsSection = ({ steps }: { steps: { icon: React.ElementType; title: string; description: string }[] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">How it works</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">Three simple steps</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-5">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CompaniesSection = ({ companies }: { companies: string[] }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Who&apos;s hiring</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Companies hiring now</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {companies.map((company, index) => (
          <span key={index} className="inline-flex items-center gap-2 text-sm py-2 px-4 rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-default">
            <Building2 className="h-3.5 w-3.5" />
            {company}
          </span>
        ))}
      </div>
    </div>
  );
};

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="text-3xl md:text-5xl font-bold text-background mb-6">Big gig or side gig,<br />we&apos;ll help you land it.</h2>
      <button
        id="job-alerts-btn-board-2"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold px-8 py-4 hover:scale-[1.02] transition-all mb-8"
        onClick={() => (window as JobAlertsWindow).JobAlertsEmbed?.instance.show()}
      >
        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
      </button>
      <div className="flex items-center justify-center gap-6 text-sm text-background/40">
        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span>Free to use</span></div>
        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span>No spam</span></div>
        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span>Local employers</span></div>
      </div>
    </div>
  );
};
