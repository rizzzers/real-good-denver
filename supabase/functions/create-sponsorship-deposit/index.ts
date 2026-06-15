import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const FROM_ADDRESS =
  Deno.env.get("RESEND_FROM") ?? "Real Good Denver <notifications@realgooddenver.com>";
const NOTIFY_TO = (Deno.env.get("SUBMISSION_NOTIFY_TO") ??
  "ryan@ryanestes.info,fernanda@ryanestes.info")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, productLink, budgetRange, campaignGoals, timeline, message } = await req.json();

    // 1) Persist FIRST so an application is never lost if the email fails.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabase.from("sponsorship_submissions").insert({
      name,
      email,
      product_link: productLink,
      budget_range: budgetRange,
      campaign_goals: campaignGoals,
      timeline,
      message,
    });

    if (dbError) {
      console.error("Failed to save sponsorship application:", dbError);
      throw new Error(`Failed to save application: ${dbError.message}`);
    }

    // 2) Send notification email. Non-fatal: the application is already saved.
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    let emailDelivered = false;
    try {
      const emailResponse = await resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_TO,
        subject: "New Sponsorship Application",
        html: `
          <h2>New Sponsorship Application</h2>
          <p><strong>Company/Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Product Link:</strong> ${productLink}</p>
          <p><strong>Budget Range:</strong> ${budgetRange || 'Not specified'}</p>
          <p><strong>Campaign Goals:</strong> ${campaignGoals || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
          <p><strong>Message:</strong> ${message || 'No message'}</p>
        `,
      });
      if (emailResponse.error) {
        console.error("Resend returned an error:", emailResponse.error);
      } else {
        emailDelivered = true;
      }
    } catch (emailErr) {
      console.error("Notification email failed (application was still saved):", emailErr);
    }

    return new Response(JSON.stringify({ success: true, saved: true, emailDelivered }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating sponsorship submission:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
