import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

interface NewsletterSignupRequest {
  name: string;
  email: string;
  source?: string; // 'newsletter' or 'bookclub'
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, source = 'newsletter' }: NewsletterSignupRequest = await req.json();

    // Determine email content based on source
    const isBookClub = source === 'bookclub';
    const subject = isBookClub ? "New Book Club Signup" : "New Newsletter Signup";
    const heading = isBookClub ? "New Book Club Signup" : "New Newsletter Signup";
    const description = isBookClub 
      ? "A new member has signed up for the Denver Book Club:"
      : "A new user has signed up for the newsletter:";

    // 1) Persist FIRST so a signup is never lost if the email fails.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Capture the event in form_submissions (full history)...
    const { error: submissionError } = await supabase
      .from("form_submissions")
      .insert({ type: "newsletter", name, email, source, data: { name, email, source } });

    if (submissionError) {
      console.error("Failed to save newsletter signup:", submissionError);
      throw new Error(`Failed to save signup: ${submissionError.message}`);
    }

    // ...and add to the mailing list (deduped by email; ignore duplicates).
    const { error: subscriberError } = await supabase
      .from("newsletter_subscribers")
      .upsert({ name, email, source }, { onConflict: "email", ignoreDuplicates: true });
    if (subscriberError) {
      // Non-fatal: the signup is already recorded in form_submissions.
      console.error("Could not upsert subscriber (signup still saved):", subscriberError);
    }

    // 2) Send notification email to admin. Non-fatal.
    let emailDelivered = false;
    try {
      const emailResponse = await resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_TO,
        subject,
        html: `
          <h1>${heading}</h1>
          <p>${description}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Source:</strong> ${isBookClub ? 'Book Club Page' : 'Home Page Newsletter'}</p>
          <p>Signed up at: ${new Date().toLocaleString()}</p>
        `,
      });
      if (emailResponse.error) {
        console.error("Resend returned an error:", emailResponse.error);
      } else {
        emailDelivered = true;
        console.log("Notification email sent:", emailResponse.data);
      }
    } catch (emailErr) {
      console.error("Notification email failed (signup was still saved):", emailErr);
    }

    return new Response(JSON.stringify({ success: true, saved: true, emailDelivered }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter-signup function:", error);
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