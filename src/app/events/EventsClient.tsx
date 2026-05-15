"use client";

import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events, eventCategories } from "@/data/events";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function EventsClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = events.filter(
    (e) => selectedCategory === "all" || e.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-foreground pt-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse-soft" />
          <div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-[0.95] tracking-tight">
            Denver<br />
            <span className="text-accent">Events.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/50 max-w-xl mx-auto">
            The best experiences happening around Denver, curated for locals.
          </p>
        </div>
      </section>

      <div className="bg-background border-b border-border sticky top-[72px] z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
            {filteredEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-16">
                No events in this category yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EventCard({
  event,
  index,
}: {
  event: (typeof events)[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const categoryLabel = event.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {event.date}
            </span>
          </div>

          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">
              {event.venue}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
            {event.title}
          </h2>

          <div className="space-y-4 mb-6">
            {event.description.map((para, i) => (
              <p key={i} className="text-foreground/70 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {event.highlights && event.highlights.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Highlights
              </p>
              <ul className="space-y-2">
                {event.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.closingNote && (
            <p className="text-foreground/60 text-sm leading-relaxed border-t border-border pt-5 mt-5">
              {event.closingNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
