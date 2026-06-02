import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, suggestion, postTitle } = await req.json();

  if (!name || !email || !suggestion) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Real Good Denver <onboarding@resend.dev>",
      to: ["ryan@ryanestes.info", "fernanda@ryanestes.info"],
      replyTo: email,
      subject: `Tip for "${postTitle}"`,
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Post:</strong> ${postTitle}</p>
        <hr />
        <p>${suggestion.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
