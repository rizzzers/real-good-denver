import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  type: "contact";
  name: string;
  email: string;
  message: string;
}

interface NewsletterSubmission {
  type: "newsletter";
  name: string;
  email: string;
}

interface PartnershipSubmission {
  type: "partnership";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interests: string[];
  message: string;
}

interface SponsorOnboardingSubmission {
  type: "sponsor_onboarding";
  data: {
    companyName: string;
    websiteUrl: string;
    brandDescription: string;
    contactName: string;
    email: string;
    phone: string;
    socialMediaLinks: string;
    campaignObjective: string;
    brandAssetsLink: string;
    taglineLink: string;
    pressKitLink: string;
    adCopyLink: string;
    cta: string;
    promoCode: string;
    trackingUrl: string;
    keyBrandMessage: string;
    audioJingleLink: string;
    includeLink: string;
  };
}

type FormSubmission = ContactSubmission | NewsletterSubmission | PartnershipSubmission | SponsorOnboardingSubmission;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission: FormSubmission = await req.json();
    console.log("Received form submission:", submission);

    let subject: string;
    let htmlContent: string;

    if (submission.type === "contact") {
      subject = "New Contact Form Submission - Real Good Denver";
      htmlContent = `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Message:</strong></p>
        <p>${submission.message.replace(/\n/g, '<br>')}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (submission.type === "newsletter") {
      subject = "New Newsletter Signup - Real Good Denver";
      htmlContent = `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (submission.type === "partnership") {
      subject = "New Partnership Inquiry - Real Good Denver";
      htmlContent = `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        ${submission.phone ? `<p><strong>Phone:</strong> ${submission.phone}</p>` : ''}
        ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
        <p><strong>Interests:</strong> ${submission.interests.join(', ')}</p>
        <p><strong>Message:</strong></p>
        <p>${submission.message.replace(/\n/g, '<br>')}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (submission.type === "sponsor_onboarding") {
      subject = "New Sponsor Onboarding Submission - Real Good Denver";
      htmlContent = `
        <h1>New Sponsor Onboarding Submission</h1>
        
        <h2>Company Information</h2>
        <p><strong>Company Name:</strong> ${submission.data.companyName}</p>
        <p><strong>Website URL:</strong> <a href="${submission.data.websiteUrl}">${submission.data.websiteUrl}</a></p>
        <p><strong>Brand Description:</strong> ${submission.data.brandDescription}</p>
        
        <h2>Contact Information</h2>
        <p><strong>Primary Contact Name:</strong> ${submission.data.contactName}</p>
        <p><strong>Email:</strong> ${submission.data.email}</p>
        <p><strong>Phone:</strong> ${submission.data.phone}</p>
        <p><strong>Social Media Links:</strong></p>
        <p>${submission.data.socialMediaLinks ? submission.data.socialMediaLinks.replace(/\n/g, '<br>') : 'N/A'}</p>
        
        <h2>Campaign Details</h2>
        <p><strong>Primary Objective:</strong> ${submission.data.campaignObjective}</p>
        <p><strong>Key Brand Message:</strong> ${submission.data.keyBrandMessage}</p>
        <p><strong>CTA:</strong> ${submission.data.cta}</p>
        
        <h2>Brand Assets & Materials</h2>
        <p><strong>Brand Assets Link:</strong> ${submission.data.brandAssetsLink ? `<a href="${submission.data.brandAssetsLink}">${submission.data.brandAssetsLink}</a>` : 'N/A'}</p>
        <p><strong>Tagline/Slogan:</strong> ${submission.data.taglineLink || 'N/A'}</p>
        <p><strong>Press Kit Link:</strong> ${submission.data.pressKitLink ? `<a href="${submission.data.pressKitLink}">${submission.data.pressKitLink}</a>` : 'N/A'}</p>
        <p><strong>Ad Copy Link:</strong> ${submission.data.adCopyLink || 'N/A'}</p>
        <p><strong>Audio/Jingle Link:</strong> ${submission.data.audioJingleLink ? `<a href="${submission.data.audioJingleLink}">${submission.data.audioJingleLink}</a>` : 'N/A'}</p>
        
        <h2>Tracking & Codes</h2>
        <p><strong>Promo Code:</strong> ${submission.data.promoCode || 'N/A'}</p>
        <p><strong>Tracking URL:</strong> ${submission.data.trackingUrl ? `<a href="${submission.data.trackingUrl}">${submission.data.trackingUrl}</a>` : 'N/A'}</p>
        <p><strong>Include Link:</strong> ${submission.data.includeLink ? `<a href="${submission.data.includeLink}">${submission.data.includeLink}</a>` : 'N/A'}</p>
        
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else {
      throw new Error("Invalid submission type");
    }

    const emailResponse = await resend.emails.send({
      from: "Real Good Denver <onboarding@resend.dev>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-form-submission function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);