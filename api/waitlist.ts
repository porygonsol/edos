import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  "https://hzrthntphlqkkyqiorjg.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS for edos.porygonsol.com
  res.setHeader("Access-Control-Allow-Origin", "https://edos.porygonsol.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { name, email, role } = req.body ?? {};

  // Validation
  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  // Insert into Supabase (upsert on email to avoid duplicates)
  const { error: dbError } = await supabase.from("waitlist").upsert(
    {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || null,
      joined_at: new Date().toISOString(),
    },
    { onConflict: "email", ignoreDuplicates: false }
  );

  if (dbError) {
    console.error("Supabase error:", dbError);
    return res.status(500).json({ error: "Failed to save. Please try again." });
  }

  // Send confirmation email via Resend
  // Using resend.dev test domain until edos.porygonsol.com is verified in Resend.
  // Once domain is verified, change from to: "EdOS <hello@edos.porygonsol.com>"
  const { data: emailData, error: emailError } = await resend.emails.send({
    from: "EdOS <onboarding@resend.dev>",
    to: email.trim(),
    replyTo: "hello@porygonsol.com",
    subject: "You're on the EdOS waitlist!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the EdOS waitlist!</title>
</head>
<body style="margin:0;padding:0;background:#cce4ff;font-family:'Manrope',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#cce4ff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:white;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(10,25,90,0.12);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1060,#2d1fa3);padding:40px 48px 32px;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:white;letter-spacing:-0.04em;">EdOS</div>
              <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.2em;text-transform:uppercase;margin-top:4px;">The Learning OS</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#081139;letter-spacing:-0.045em;line-height:1.1;">
                You're on the list! &#127881;
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#4a5178;line-height:1.6;">
                Hey ${name.trim()},
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#4a5178;line-height:1.6;">
                Thanks for joining the EdOS early access waitlist. You're one step closer to a learning experience that actually shows what you understand — not just that you attended.
              </p>
              <div style="background:#f0f4ff;border-radius:16px;padding:24px;margin:0 0 28px;">
                <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#7c8ccc;letter-spacing:0.15em;text-transform:uppercase;">What to expect</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:#1a2050;">&#10003;&nbsp;&nbsp;Early access to EdOS when we launch</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:#1a2050;">&#10003;&nbsp;&nbsp;Updates on new features &amp; milestones</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:#1a2050;">&#10003;&nbsp;&nbsp;A chance to shape the product as an early user</td>
                  </tr>
                </table>
              </div>
              <p style="margin:0;font-size:14px;color:#6b75a1;line-height:1.6;">
                We'll reach out to <strong style="color:#081139;">${email.trim()}</strong> as soon as EdOS is ready for you.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 48px 36px;border-top:1px solid #eef0f8;">
              <p style="margin:0;font-size:12px;color:#9ba3c4;text-align:center;">
                Made with &#9829; by
                <a href="https://www.porygonsol.com/" style="color:#7c56ef;text-decoration:none;font-weight:700;">Porygon</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });

  if (emailError) {
    // Log but don't fail — entry is already saved in DB
    console.error("Resend error:", JSON.stringify(emailError));
  } else {
    console.log("Email sent:", emailData?.id);
  }

  return res.status(200).json({ ok: true });
}
