import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Configurable sender + recipients. Resend's sandbox sender
// (onboarding@resend.dev) can only deliver to the Resend account owner, so set
// RESEND_FROM to an address on a domain you've verified in Resend for delivery
// to actually work.
const FROM_ADDRESS =
  Deno.env.get("RESEND_FROM") ?? "Real Good Denver <notifications@realgooddenver.com>";
const NOTIFY_TO = (Deno.env.get("SUBMISSION_NOTIFY_TO") ??
  "ryan@ryanestes.info,fernanda@ryanestes.info")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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

    // 1) Persist to the database FIRST so a submission is never lost, even if
    //    the notification email fails to send.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Normalize the common fields across form types; `data` keeps the full payload.
    const flat: Record<string, any> = submission.type === "sponsor_onboarding"
      ? submission.data
      : (submission as unknown as Record<string, any>);
    const record = {
      type: submission.type,
      name: (flat as any).name ?? (flat as any).contactName ?? null,
      email: (flat as any).email ?? null,
      phone: (flat as any).phone ?? null,
      company: (flat as any).company ?? (flat as any).companyName ?? null,
      message: (flat as any).message ?? null,
      data: submission,
    };

    const { error: dbError } = await supabase
      .from("form_submissions")
      .insert(record);

    if (dbError) {
      // Saving is the critical path — if it fails, surface a real error.
      console.error("Failed to save submission:", dbError);
      throw new Error(`Failed to save submission: ${dbError.message}`);
    }

    // 2) Send the notification email. Non-fatal: the submission is already
    //    safely stored, so an email failure must not fail the request.
    let emailDelivered = false;
    try {
      const emailResponse = await resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_TO,
        subject: subject,
        html: htmlContent,
      });
      if (emailResponse.error) {
        console.error("Resend returned an error:", emailResponse.error);
      } else {
        emailDelivered = true;
        console.log("Notification email sent:", emailResponse.data);
      }
    } catch (emailErr) {
      console.error("Notification email failed (submission was still saved):", emailErr);
    }

    return new Response(JSON.stringify({ success: true, saved: true, emailDelivered }), {
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