"use client";

import { useState } from "react";
import { Send, MapPin } from "lucide-react";

interface Props {
  postTitle: string;
}

export default function SuggestionForm({ postTitle }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, suggestion, postTitle }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative mb-12 rounded-2xl overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-primary/60 via-primary/20 to-transparent">
        <div className="absolute inset-0 rounded-2xl bg-foreground" />
      </div>

      <div className="relative px-6 py-7 md:px-8 md:py-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
              Know a spot we missed?
            </p>
            <h3 className="text-lg font-bold text-background leading-snug">
              Drop us a tip. We read every one.
            </h3>
          </div>
        </div>

        {status === "sent" ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">✌️</p>
            <p className="font-semibold text-background">Got it. Thanks for the tip.</p>
            <p className="text-sm text-background/40 mt-1">We'll check it out.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-background/40 mb-1.5 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="First name is fine"
                  className="w-full bg-background/5 border border-background/10 rounded-xl px-4 py-2.5 text-sm text-background placeholder:text-background/25 focus:outline-none focus:border-primary/60 focus:bg-background/8 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-background/40 mb-1.5 uppercase tracking-wide">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="we'll follow up if we need to"
                  className="w-full bg-background/5 border border-background/10 rounded-xl px-4 py-2.5 text-sm text-background placeholder:text-background/25 focus:outline-none focus:border-primary/60 focus:bg-background/8 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-background/40 mb-1.5 uppercase tracking-wide">
                The Tip
              </label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                required
                rows={3}
                placeholder="Name of the spot, why it belongs, anything else we should know..."
                className="w-full bg-background/5 border border-background/10 rounded-xl px-4 py-2.5 text-sm text-background placeholder:text-background/25 focus:outline-none focus:border-primary/60 focus:bg-background/8 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-background/25">
                Goes straight to Ryan. No spam, ever.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                {status === "sending" ? (
                  "Sending..."
                ) : (
                  <>
                    Send it
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400">Something went wrong. Try emailing ryan@ryanestes.info directly.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
