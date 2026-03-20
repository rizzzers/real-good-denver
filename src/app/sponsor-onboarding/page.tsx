"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function SponsorOnboardingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "", websiteUrl: "", brandDescription: "", contactName: "",
    email: "", phone: "", socialMediaLinks: "", campaignObjective: "",
    brandAssetsLink: "", taglineLink: "", pressKitLink: "", adCopyLink: "",
    cta: "", promoCode: "", trackingUrl: "", keyBrandMessage: "",
    audioJingleLink: "", includeLink: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-form-submission", {
        body: { type: "sponsor_onboarding", data: formData },
      });
      if (error) throw error;
      toast({ title: "Success!", description: "Your partner onboarding form has been submitted successfully." });
      setFormData({ companyName: "", websiteUrl: "", brandDescription: "", contactName: "", email: "", phone: "", socialMediaLinks: "", campaignObjective: "", brandAssetsLink: "", taglineLink: "", pressKitLink: "", adCopyLink: "", cta: "", promoCode: "", trackingUrl: "", keyBrandMessage: "", audioJingleLink: "", includeLink: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "Error", description: "There was an error submitting your form. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground";
  const textareaClass = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground resize-none";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mt-[110px] mb-[55px]">
          <h1 className="text-4xl font-bold mb-2">Partner Onboarding</h1>
          <p className="text-muted-foreground mb-8">
            Welcome! Please fill out the form below to get started with your partnership campaign.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name *</label>
              <input name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL *</label>
              <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Brand Description (1–2 sentences) *</label>
              <textarea name="brandDescription" value={formData.brandDescription} onChange={handleChange} required rows={3} className={textareaClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Contact Name *</label>
              <input name="contactName" value={formData.contactName} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address *</label>
              <input name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Links to Social Media Profiles</label>
              <textarea name="socialMediaLinks" value={formData.socialMediaLinks} onChange={handleChange} placeholder="Enter social media links (one per line)" rows={3} className={textareaClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Objective of the Campaign *</label>
              <textarea name="campaignObjective" value={formData.campaignObjective} onChange={handleChange} required rows={3} className={textareaClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Brand Assets (Logo, Images, Artwork, Colors, Fonts)</label>
              <input name="brandAssetsLink" value={formData.brandAssetsLink} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Tagline / Slogan</label>
              <input name="taglineLink" value={formData.taglineLink} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Links to Press Kit / Media Kit</label>
              <input name="pressKitLink" value={formData.pressKitLink} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Links to Ad Copy / Talking Points</label>
              <input name="adCopyLink" value={formData.adCopyLink} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA (Call-to-Action) *</label>
              <input name="cta" value={formData.cta} onChange={handleChange} required placeholder="e.g., Visit our website, Use code XYZ" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Promo Code</label>
              <input name="promoCode" value={formData.promoCode} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tracking URL</label>
              <input name="trackingUrl" value={formData.trackingUrl} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Brand Message (1–2 sentences) *</label>
              <textarea name="keyBrandMessage" value={formData.keyBrandMessage} onChange={handleChange} required rows={3} className={textareaClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio / Jingle Link (optional)</label>
              <input name="audioJingleLink" value={formData.audioJingleLink} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Include (URL)</label>
              <input name="includeLink" value={formData.includeLink} onChange={handleChange} className={inputClass} />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 bg-primary text-primary-foreground rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Submit Onboarding Form"}
            </button>
          </form>
        </div>
      </main>
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
