import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const verificationSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be numeric"),
});

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

const buildHtmlBody = (code: string): string => {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Код подтверждения - MuseoNet</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <h1 style="margin: 0; color: #333333; font-size: 24px; font-weight: 600;">MuseoNet</h1>
                <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px;">Интерактивный музей архитектуры Казахстана</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px;">
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 0;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px; text-align: center;">
                <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: 500;">Ваш код подтверждения</h2>
                <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                  Используйте код ниже для подтверждения вашего email адреса:
                </p>
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <span style="font-size: 32px; font-family: 'Courier New', monospace; letter-spacing: 8px; color: #333333; font-weight: bold;">${code}</span>
                </div>
                <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px;">
                  Код действителен в течение 5 минут.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px;">
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 0;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px 40px 40px; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                  Если вы не запрашивали этот код, просто проигнорируйте это письмо.
                  <br />
                  Это автоматическое сообщение, пожалуйста, не отвечайте на него.
                </p>
                <p style="margin: 20px 0 0 0; color: #bbbbbb; font-size: 11px;">
                  © 2024 MuseoNet / TENGIR. Актау, Казахстан
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      console.log(`[SMTP] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Parse and validate input
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const validationResult = verificationSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.log(`[SMTP] Validation failed:`, validationResult.error.errors);
      return new Response(JSON.stringify({ error: "Invalid input", details: validationResult.error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email, code } = validationResult.data;

    console.log(`[SMTP] Sending verification code to ${email} from IP: ${clientIP}`);
    console.log(`[SMTP] Using host: ${SMTP_HOST}, port: ${SMTP_PORT}`);

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST!,
        port: SMTP_PORT,
        tls: true,
        auth: {
          username: SMTP_USERNAME!,
          password: SMTP_PASSWORD!,
        },
      },
    });

    const htmlBody = buildHtmlBody(code);
    const plainText = [
      "MuseoNet - Интерактивный музей архитектуры Казахстана",
      "",
      "Ваш код подтверждения: " + code,
      "",
      "Используйте этот код для подтверждения вашего email адреса.",
      "Код действителен в течение 5 минут.",
      "",
      "Если вы не запрашивали этот код, просто проигнорируйте это письмо.",
      "",
      "---",
      "© 2024 MuseoNet / TENGIR",
      "Актау, Казахстан",
    ].join("\n");

    await client.send({
      from: `MuseoNet <${SMTP_FROM_EMAIL!}>`,
      to: email,
      subject: "Код подтверждения MuseoNet",
      content: plainText,
      html: htmlBody,
    });

    await client.close();

    console.log("[SMTP] Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SMTP] Error in send-verification-email function:", error);

    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
