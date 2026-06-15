import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Send notification email to admin
    const emailResponse = await resend.emails.send({
      from: "Real Good Denver <onboarding@resend.dev>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
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

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
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