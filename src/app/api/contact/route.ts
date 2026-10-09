import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  return createClient(
    "https://xrpbjtdbwuodfixgpapx.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { type, name, email } = body;
  if (!type || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let subject = "New form submission: Real Good Denver";
  let html = "";

  if (type === "newsletter_signup") {
    subject = "RGD - New Subscriber";
    html = `
      <p><strong>Name:</strong> ${name || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Source:</strong> ${body.source || "N/A"}</p>
    `;
  } else if (type === "sponsorship") {
    subject = `Sponsorship inquiry from ${name}`;
    html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product Link:</strong> ${body.productLink || "N/A"}</p>
      <p><strong>Budget Range:</strong> ${body.budgetRange || "N/A"}</p>
      <p><strong>Timeline:</strong> ${body.timeline || "N/A"}</p>
      <p><strong>Campaign Goals:</strong></p>
      <p>${(body.campaignGoals || "").replace(/\n/g, "<br/>")}</p>
      <p><strong>Message:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "contact") {
    subject = `Message from ${name}: Real Good Denver`;
    html = `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Message:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "partnership") {
    subject = `Partnership inquiry from ${name}`;
    html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${body.phone || "N/A"}</p>
      <p><strong>Interests:</strong> ${(body.interests || []).join(", ") || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "event") {
    subject = `Event submission: ${body.eventName || "N/A"}`;
    html = `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Event:</strong> ${body.eventName || "N/A"}</p>
      <p><strong>Details:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "sponsor_onboarding") {
    subject = `Sponsor onboarding: ${body.data?.companyName || "N/A"}`;
    const d = body.data || {};
    html = `
      <p><strong>Company:</strong> ${d.companyName}</p>
      <p><strong>Contact:</strong> ${d.contactName} &lt;${d.email}&gt;</p>
      <p><strong>Phone:</strong> ${d.phone}</p>
      <p><strong>Website:</strong> ${d.websiteUrl}</p>
      <p><strong>Campaign Objective:</strong> ${d.campaignObjective}</p>
      <p><strong>Brand Description:</strong></p>
      <p>${(d.brandDescription || "").replace(/\n/g, "<br/>")}</p>
      <p><strong>Key Brand Message:</strong> ${d.keyBrandMessage}</p>
      <p><strong>CTA:</strong> ${d.cta}</p>
      <p><strong>Promo Code:</strong> ${d.promoCode}</p>
      <p><strong>Tracking URL:</strong> ${d.trackingUrl}</p>
      <p><strong>Assets Link:</strong> ${d.brandAssetsLink}</p>
    `;
  } else {
    subject = `Form submission (${type})`;
    html = `<pre>${JSON.stringify(body, null, 2)}</pre>`;
  }

  // Save to database first: record persists even if email fails
  let emailSent = false;
  const db = getDb();
  const { data: saved, error: dbError } = await db
    .from("form_submissions")
    .insert({
      type,
      name: name || null,
      email,
      subject,
      body,
      email_sent: false,
    })
    .select("id")
    .single();
  if (dbError) {
    console.error("[contact] form_submissions insert failed:", dbError.message);
  }

  const isSignup = type === "newsletter_signup";
  const recipients = isSignup
    ? ["ryan@inboxalchemy.co"]
    : ["ryan@ryanestes.info", "fernanda@ryanestes.info"];
  if (type === "event") {
    recipients.push("marie@ryanestes.info");
  }
  // Signups CC the Inbox Alchemy team plus the client's Beehiiv login (estes@gooddenver.com).
  const cc = isSignup
    ? ["fernanda@inboxalchemy.co", "marie@inboxalchemy.co", "estes@gooddenver.com"]
    : undefined;

  try {
    const { error: sendError } = await resend.emails.send({
      from: "Real Good Denver <noreply@ryanestes.info>",
      to: recipients,
      cc,
      replyTo: email,
      subject,
      html,
    });
    if (sendError) {
      console.error("[contact] Resend send failed:", sendError.message);
    } else {
      emailSent = true;
    }
  } catch (err) {
    console.error("[contact] Resend send threw:", err);
  }

  if (emailSent && saved) {
    // Mark the saved record as emailed
    const { error: updateError } = await db
      .from("form_submissions")
      .update({ email_sent: true })
      .eq("id", saved.id);
    if (updateError) {
      console.error("[contact] form_submissions update failed:", updateError.message);
    }
  }

  if (!saved && !emailSent) {
    return NextResponse.json(
      { error: "We couldn't submit your form. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, saved: Boolean(saved), emailed: emailSent });
}
