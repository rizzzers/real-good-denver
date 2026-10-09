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
  const resend = new Resend(process.env.RESEND_API_KEY);
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { name, email, suggestion, postTitle } = payload;

  if (!name || !email || !suggestion || typeof suggestion !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const subject = `Tip for "${postTitle}"`;
  const html = `
    <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    <p><strong>Post:</strong> ${postTitle}</p>
    <hr />
    <p>${suggestion.replace(/\n/g, "<br/>")}</p>
  `;

  // Save to database first
  let emailSent = false;
  const db = getDb();
  const { data: saved, error: dbError } = await db
    .from("form_submissions")
    .insert({
      type: "suggestion",
      name,
      email,
      subject,
      body: { postTitle, suggestion },
      email_sent: false,
    })
    .select("id")
    .single();
  if (dbError) {
    console.error("[suggest] form_submissions insert failed:", dbError.message);
  }

  try {
    const { error: sendError } = await resend.emails.send({
      from: "Real Good Denver <noreply@ryanestes.info>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
      replyTo: email,
      subject,
      html,
    });
    if (sendError) {
      console.error("[suggest] Resend send failed:", sendError.message);
    } else {
      emailSent = true;
    }
  } catch (err) {
    console.error("[suggest] Resend send threw:", err);
  }

  if (emailSent && saved) {
    const { error: updateError } = await db
      .from("form_submissions")
      .update({ email_sent: true })
      .eq("id", saved.id);
    if (updateError) {
      console.error("[suggest] form_submissions update failed:", updateError.message);
    }
  }

  if (!saved && !emailSent) {
    return NextResponse.json(
      { error: "We couldn't send your tip. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, saved: Boolean(saved), emailed: emailSent });
}
