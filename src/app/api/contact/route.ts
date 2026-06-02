import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { type, name, email } = body;
  if (!type || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let subject = "New form submission — Real Good Denver";
  let html = "";

  if (type === "newsletter_signup") {
    subject = `New newsletter signup: ${name || email}`;
    html = `
      <p><strong>Name:</strong> ${name || "—"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Source:</strong> ${body.source || "—"}</p>
    `;
  } else if (type === "sponsorship") {
    subject = `Sponsorship inquiry from ${name}`;
    html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product Link:</strong> ${body.productLink || "—"}</p>
      <p><strong>Budget Range:</strong> ${body.budgetRange || "—"}</p>
      <p><strong>Timeline:</strong> ${body.timeline || "—"}</p>
      <p><strong>Campaign Goals:</strong></p>
      <p>${(body.campaignGoals || "").replace(/\n/g, "<br/>")}</p>
      <p><strong>Message:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "contact") {
    subject = `Message from ${name} — Real Good Denver`;
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
      <p><strong>Phone:</strong> ${body.phone || "—"}</p>
      <p><strong>Interests:</strong> ${(body.interests || []).join(", ") || "—"}</p>
      <p><strong>Message:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "event") {
    subject = `Event submission: ${body.eventName || "—"}`;
    html = `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Event:</strong> ${body.eventName || "—"}</p>
      <p><strong>Details:</strong></p>
      <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
    `;
  } else if (type === "sponsor_onboarding") {
    subject = `Sponsor onboarding: ${body.data?.companyName || "—"}`;
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

  try {
    await resend.emails.send({
      from: "Real Good Denver <onboarding@resend.dev>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
      replyTo: email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
