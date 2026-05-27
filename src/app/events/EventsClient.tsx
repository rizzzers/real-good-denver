"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { communityEvents, type CommunityEvent } from "@/data/communityEvents";
import { MapPin, ExternalLink, Calendar, Clock, Send, ChevronDown } from "lucide-react";

export default function EventsClient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = communityEvents
    .filter((e) => {
      const [y, m, d] = e.date.split("-").map(Number);
      return new Date(y, m - 1, d) >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <TimelineSection events={upcomingEvents} />
      <SubmitSection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-foreground pt-28 pb-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div ref={ref} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          <span className="text-sm font-medium text-background/70 tracking-wide">Denver community, IRL</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
          Community<br />
          <span className="text-primary">Events.</span>
        </h1>
        <p className="text-lg md:text-xl text-background/50 mb-8 max-w-xl mx-auto">
          Things actually worth leaving the house for. Submitted by Denver locals, curated for the community.
        </p>
        <a href="#submit" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Submit your event <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function SubmitSection() {
  const [form, setForm] = useState({
    name: "", email: "", eventName: "", eventDate: "",
    eventTime: "", location: "", description: "", link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-form-submission", {
        body: {
          type: "contact",
          name: form.name,
          email: form.email,
          message: [
            "EVENT SUBMISSION",
            "",
            `Event: ${form.eventName}`,
            `Date: ${form.eventDate}`,
            `Time: ${form.eventTime || "Not specified"}`,
            `Location: ${form.location}`,
            `Description: ${form.description}`,
            `Link: ${form.link || "None"}`,
          ].join("\n"),
        },
      });
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: "", email: "", eventName: "", eventDate: "", eventTime: "", location: "", description: "", link: "" });
      toast({ title: "Event submitted!", description: "We'll review it and add it to the calendar." });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full h-11 bg-muted border border-border rounded-xl px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

  return (
    <section id="submit" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-2xl mx-auto px-6">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Submit an Event</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">Got something worth showing up for?</h2>
          <p className="text-muted-foreground mb-10">Submit your event and we&apos;ll add it to the community calendar.</p>

          {submitted ? (
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">We got it.</p>
                <p className="text-sm text-muted-foreground">Your event has been submitted for review.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Your Name</label>
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={set("name")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Your Email</label>
                  <input type="email" required placeholder="jane@example.com" value={form.email} onChange={set("email")} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Event Name</label>
                <input type="text" required placeholder="Sloan's Lake Bar Crawl" value={form.eventName} onChange={set("eventName")} className={inputCls} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" required value={form.eventDate} onChange={set("eventDate")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Time <span className="normal-case font-normal text-muted-foreground/60">(optional)</span></label>
                  <input type="text" placeholder="6:00 PM" value={form.eventTime} onChange={set("eventTime")} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <input type="text" required placeholder="Sloan's Lake, Denver, CO" value={form.location} onChange={set("location")} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea required placeholder="Tell people what this is and why they should come." value={form.description} onChange={set("description")} rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none" />
              </div>

              <div>
                <label className={labelCls}>Link <span className="normal-case font-normal text-muted-foreground/60">(optional)</span></label>
                <input type="url" placeholder="https://example.com/event" value={form.link} onChange={set("link")} className={inputCls} />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  : <>Submit Event <Send className="h-4 w-4" /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}

function TimelineSection({ events }: { events: CommunityEvent[] }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className={`mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">What&apos;s Coming Up</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Upcoming events</h2>
        </div>

        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-10 w-px bg-border" />
            <div className="space-y-0">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: CommunityEvent; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [y, m, d] = event.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <div ref={ref}
      className={`relative flex gap-6 pb-10 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${index * 80}ms` }}>

      {/* Date column with dot */}
      <div className="flex-shrink-0 w-14 text-center z-10">
        <div className="bg-background pt-1 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{dayName}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{month}</p>
          <p className="text-2xl font-bold text-foreground leading-none">{d}</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary mx-auto mt-1" />
      </div>

      {/* Card */}
      <div className="flex-1 border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
        <h3 className="text-lg font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-300">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            {event.location}
          </span>
          {event.time && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
              {event.time}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>

        {event.link && (
          <a href={event.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            More info <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl">
        <Calendar className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <p className="text-base font-medium text-foreground mb-1">No upcoming events</p>
        <p className="text-sm text-muted-foreground">Submit one above or check back soon.</p>
      </div>
    </div>
  );
}
