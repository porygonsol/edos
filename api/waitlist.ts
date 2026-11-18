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
    replyTo: "porygonsol@gmail.com",
    subject: "You're on the EdOS waitlist!",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(10,25,90,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1060,#2d1fa3);padding:36px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:800;color:white;letter-spacing:-0.04em;">EdOS</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:0.18em;text-transform:uppercase;margin-top:4px;">The Learning OS</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <p style="margin:0 0 18px;font-size:22px;font-weight:800;color:#081139;letter-spacing:-0.03em;">Hey ${name.trim()}! &#127881;</p>
            <p style="margin:0 0 16px;font-size:15px;color:#4a5178;line-height:1.7;">
              Thank you for your patience — we really appreciate it.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#4a5178;line-height:1.7;">
              You're on the <strong style="color:#081139;">EdOS early access waitlist</strong>. We're working hard to get everything ready, and we'll personally let you know the moment our application is ready for you.
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#4a5178;line-height:1.7;">
              Until then — keep learning. &#128218;
            </p>
            <p style="margin:0;font-size:13px;color:#9ba3c4;">
              — The EdOS team &nbsp;|&nbsp;
              <a href="https://www.porygonsol.com/" style="color:#7c56ef;text-decoration:none;font-weight:600;">porygonsol.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 40px 28px;border-top:1px solid #eef0f8;text-align:center;">
            <p style="margin:0;font-size:11px;color:#c0c8e0;">
              Made with &#9829; by <a href="https://www.porygonsol.com/" style="color:#7c56ef;text-decoration:none;font-weight:700;">Porygon</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  if (emailError) {
    // Log but don't fail — entry is already saved in DB
    console.error("Resend error:", JSON.stringify(emailError));
  } else {
    console.log("Email sent:", emailData?.id);
  }

  return res.status(200).json({ ok: true });
}
