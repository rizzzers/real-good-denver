"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Users, Target, TrendingUp, ExternalLink } from "lucide-react";

export default function PartnershipClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productLink, setProductLink] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [campaignGoals, setCampaignGoals] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('create-sponsorship-deposit', {
        body: { name, email, productLink, budgetRange, campaignGoals, timeline, message }
      });
      if (error) throw error;
      toast({ title: "Application Submitted!", description: "We'll be in touch soon to discuss your campaign." });
      setName(""); setEmail(""); setProductLink(""); setBudgetRange(""); setCampaignGoals(""); setTimeline(""); setMessage("");
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-foreground pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-background mb-8 leading-[0.9] tracking-tight">
            Real Good Denver<br /><span className="text-primary">Partnerships.</span>
          </h1>

          <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl mb-10">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/At0Wd3ty3Xk?rel=0&modestbranding=1"
                title="Real Good Denver"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-background/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            Reach a trusted audience across email, audio, and video in one coordinated campaign.
          </p>
          <p className="text-base md:text-lg text-background/45 max-w-xl mx-auto mb-8 leading-relaxed">
            Our partnership packages don&apos;t just deliver impressions. They deliver credibility, repeat exposure, and reusable content your team can use long after the campaign ends.
          </p>
          <p className="text-base font-semibold text-primary max-w-md mx-auto mb-5">
            Guaranteed distribution. Native host integration. Content you can repurpose.
          </p>
          <p className="text-sm text-background/35">See the plans below and choose your level of visibility.</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-foreground">
        <div className="max-w-4xl mx-auto px-6">
          <PricingSection />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <VerifiedImpressions />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <AudienceAttributes />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-5xl mx-auto px-6">
          <CaseStudies />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-lg mx-auto px-6">
          <ApplicationForm
            name={name} email={email} productLink={productLink} budgetRange={budgetRange}
            campaignGoals={campaignGoals} timeline={timeline} message={message} isSubmitting={isSubmitting}
            onNameChange={setName} onEmailChange={setEmail} onProductLinkChange={setProductLink}
            onBudgetRangeChange={setBudgetRange} onCampaignGoalsChange={setCampaignGoals}
            onTimelineChange={setTimeline} onMessageChange={setMessage} onSubmit={handleSubmit}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const PricingSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const tiers = [
    { name: 'Growth Visibility', price: '$12,000', best: 'Best for brands ready to build consistent awareness and momentum.', featured: false, features: ['160,000 guaranteed impressions', 'Priority newsletter placement across campaign period', 'Multiple host-read podcast integrations', 'Expanded short-form video asset package', 'Performance reporting and optimization insights'] },
    { name: 'Dominant Visibility', price: '$19,000', best: 'Best for brands that want to own the conversation and maximize reach.', featured: true, features: ['380,000 guaranteed impressions', 'Premium newsletter positioning', 'Ongoing host-read podcast integrations', 'Full short-form video content suite for repurposing', 'Strategic campaign reporting and audience insights'] },
    { name: 'Buyout', price: null, best: 'Exclusive category ownership across all Real Good Denver channels. Contact us for availability.', features: ['Full newsletter exclusivity', 'Unlimited host-read podcast integrations', 'Complete short-form video suite', 'Custom content and editorial partnerships', 'Dedicated campaign strategy and reporting'] },
  ];
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Pricing</p>
        <h2 className="text-3xl md:text-5xl font-bold text-background">Pricing Tiers</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div key={tier.name} className={`rounded-2xl border p-6 flex flex-col ${tier.featured ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-background/10 bg-background/5'}`}>
            <h3 className="text-lg font-semibold text-background mb-1">{tier.name}</h3>
            {tier.price ? (
              <p className="text-3xl font-bold text-primary mb-3">{tier.price}</p>
            ) : (
              <p className="text-lg font-semibold text-primary mb-3">Contact for availability</p>
            )}
            <p className="text-sm text-background/50 mb-5">{tier.best}</p>
            <ul className="space-y-2.5 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-background/70">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-background/40 text-sm mt-10">Not sure which tier fits? Tell us your goal and we&apos;ll recommend the right plan.</p>
    </div>
  );
};

const VerifiedImpressions = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Why It Matters</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Real impressions. Real people.</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Unlike social media impressions that count bots, scrolls, and phantom views — every impression we report is a <strong className="text-foreground">verified unique email open</strong> from a real human inbox.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Users, title: 'Verified Unique Opens', desc: 'Every impression is tracked via unique email open — no inflated scroll counts, no bot traffic, no guesswork.' },
          { icon: Target, title: '47% Open Rate', desc: 'More than double the industry average. Our audience actively reads — they don\'t just scroll past.' },
          { icon: TrendingUp, title: 'Guaranteed Minimums', desc: 'Every tier comes with a guaranteed impression floor. If we don\'t hit it, we keep running your campaign until we do.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-7 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-foreground font-medium">
          &ldquo;50,000 impressions&rdquo; from us means <strong>50,000 real humans opened their email and saw your brand.</strong> That&apos;s not comparable to 50K impressions on social — it&apos;s far more valuable.
        </p>
      </div>
    </div>
  );
};

const AudienceAttributes = () => {
  const { ref, isVisible } = useScrollReveal();
  const attributes = ['Business Owners', 'Young Professionals', 'Families', 'Singles', 'Publicists', 'Artists', 'Creators', 'Investors', 'Operators', 'Founders', 'Media Professionals', 'Educators', 'Tech Workers', 'Freelancers', 'Foodies', 'Outdoor Enthusiasts', 'Fitness Community'];
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Audience</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Who you&apos;ll reach</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Our audience spans Denver&apos;s most engaged and influential demographics.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {attributes.map((attr) => (
          <span key={attr} className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 cursor-default">
            {attr}
          </span>
        ))}
      </div>
    </div>
  );
};

const CaseStudies = () => {
  const { ref, isVisible } = useScrollReveal();
  const cases = [
    { logo: '/denver-ramen-fest-logo.png', name: 'Denver Ramen Festival', url: 'https://denverramenfestival.com/', outcome: 'Sold Out festival', highlight: '1M impressions', description: "Multi-channel campaign across newsletter, podcast, and video drove massive awareness for Denver's largest ramen event." },
    { logo: '/samana-float-logo.png', name: 'Samana Float Center', url: 'https://samanafloat.com/', outcome: '50+ new customers', highlight: '250+ applicants', description: 'Targeted newsletter placements and host-read podcast ads converted curious readers into loyal float therapy customers.' },
    { logo: '/lovable-uploads/88367d92-e2c7-4696-a18c-ccbe99e04401.png', name: 'Kitcaster.com', url: 'https://kitcaster.com', outcome: '300+ clicks to website', highlight: '$70K in new revenue', description: 'Strategic content integration positioned Kitcaster as the go-to podcast booking agency for Denver professionals.' },
  ];
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-16">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Results</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Success stories</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Real brands. Real campaigns. Real results from our multi-channel partnership platform.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {cases.map((c, i) => (
          <div key={c.name} className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center">
                  <img src={c.logo} alt={c.name} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  Visit <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{c.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{c.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Outcome</p>
                  <p className="font-semibold text-foreground text-sm">{c.outcome}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Highlight</p>
                  <p className="text-xl font-black text-primary">{c.highlight}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplicationForm = ({ name, email, productLink, budgetRange, campaignGoals, timeline, message, isSubmitting,
  onNameChange, onEmailChange, onProductLinkChange, onBudgetRangeChange, onCampaignGoalsChange, onTimelineChange, onMessageChange, onSubmit }: {
  name: string; email: string; productLink: string; budgetRange: string; campaignGoals: string; timeline: string; message: string; isSubmitting: boolean;
  onNameChange: (v: string) => void; onEmailChange: (v: string) => void; onProductLinkChange: (v: string) => void;
  onBudgetRangeChange: (v: string) => void; onCampaignGoalsChange: (v: string) => void; onTimelineChange: (v: string) => void; onMessageChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const { ref, isVisible } = useScrollReveal();
  const inputClass = "mt-2 flex h-12 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground";
  const selectClass = "mt-2 flex h-12 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Apply</p>
        <h2 className="text-3xl font-bold text-foreground mb-2">Apply for partnership</h2>
        <p className="text-muted-foreground text-sm">Tell us about your brand and goals. We&apos;ll follow up within 48 hours.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div><label className="text-sm font-medium">Company/Brand Name</label>
            <input value={name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Enter your company name" className={inputClass} /></div>
          <div><label className="text-sm font-medium">Contact Email</label>
            <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required placeholder="Enter your email" className={inputClass} /></div>
          <div><label className="text-sm font-medium">Product/Service Website</label>
            <input type="url" value={productLink} onChange={(e) => onProductLinkChange(e.target.value)} required placeholder="https://yourwebsite.com" className={inputClass} /></div>
          <div><label className="text-sm font-medium">Budget Range</label>
            <select value={budgetRange} onChange={(e) => onBudgetRangeChange(e.target.value)} required className={selectClass}>
              <option value="">Select a range</option>
              <option value="$12,000 - Growth">$12,000 — Growth Visibility</option>
              <option value="$19,000 - Dominant">$19,000 — Dominant Visibility</option>
              <option value="Buyout">Buyout — Contact for availability</option>
              <option value="Custom">Custom / Not sure yet</option>
            </select></div>
          <div><label className="text-sm font-medium">Campaign Goals</label>
            <select value={campaignGoals} onChange={(e) => onCampaignGoalsChange(e.target.value)} required className={selectClass}>
              <option value="">Select a goal</option>
              <option value="Brand Awareness">Brand Awareness</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Event Promotion">Event Promotion</option>
              <option value="Other">Other</option>
            </select></div>
          <div><label className="text-sm font-medium">Preferred Timeline</label>
            <select value={timeline} onChange={(e) => onTimelineChange(e.target.value)} required className={selectClass}>
              <option value="">Select a timeline</option>
              <option value="ASAP">ASAP</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1-3 months">1–3 months</option>
              <option value="3+ months">3+ months</option>
            </select></div>
          <div><label className="text-sm font-medium">Anything else we should know?</label>
            <textarea value={message} onChange={(e) => onMessageChange(e.target.value)} placeholder="Tell us about your brand, goals, or questions..."
              className="mt-2 flex min-h-[100px] w-full rounded-xl border border-input bg-muted/50 px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" /></div>
          <button type="submit" className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all disabled:opacity-50" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};
