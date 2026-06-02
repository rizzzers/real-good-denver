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
  const { name, email, suggestion, postTitle } = await req.json();

  if (!name || !email || !suggestion) {
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
  await db.from("form_submissions").insert({
    type: "suggestion",
    name,
    email,
    subject,
    body: { postTitle, suggestion },
    email_sent: false,
  });

  try {
    await resend.emails.send({
      from: "Real Good Denver <noreply@ryanestes.info>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
      replyTo: email,
      subject,
      html,
    });
    emailSent = true;
    await db
      .from("form_submissions")
      .update({ email_sent: true })
      .eq("email", email)
      .eq("type", "suggestion")
      .order("created_at", { ascending: false })
      .limit(1);
  } catch {
    // Email failed — record is still in DB
  }

  return NextResponse.json({ ok: true, saved: true, emailed: emailSent });
}
