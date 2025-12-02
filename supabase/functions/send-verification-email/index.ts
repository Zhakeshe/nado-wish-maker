import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationPayload {
  email: string;
  code: string;
}

const buildHtmlBody = (code: string): string => {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Код подтверждения</title>
  </head>
  <body style="background-color: #ffffff; color: #222222; font-family: Arial, sans-serif;">
    <p>Код подтверждения:</p>
    <pre style="font-size: 20px; font-family: monospace; margin: 8px 0;">${code}</pre>
    <p>Код действует 5 минут. Если вы не запрашивали письмо, просто игнорируйте его.</p>
    <p style="color: #555555; font-size: 12px;">Это автоматическое письмо, отвечать не нужно.</p>
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

    const { email, code } = (await req.json()) as VerificationPayload;

    if (!email || !code) {
      return new Response(JSON.stringify({ error: "Missing email or code" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`[SMTP] Sending verification code to ${email}`);
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
      "Код подтверждения:",
      `${code}`,
      "Код действует 5 минут. Если вы не запрашивали письмо, просто игнорируйте его.",
      "Отвечать не нужно — письмо отправлено автоматически.",
    ].join("\n");

    await client.send({
      from: `MuseoNet <${SMTP_FROM_EMAIL!}>`,
      to: email,
      subject: "Код подтверждения",
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

    return new Response(JSON.stringify({ error: error?.message ?? String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
