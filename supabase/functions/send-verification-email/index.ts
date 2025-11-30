import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPHandler } from "https://deno.land/x/denomailer@1.6.0/client/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationPayload {
  email: string;
  code: string;
}

// Create a single SMTP client instance reused across invocations
const smtpClient = new SMTPHandler({
  connection: {
    hostname: Deno.env.get("SMTP_HOST") ?? "mail.spacemail.com",
    port: Number(Deno.env.get("SMTP_PORT") ?? "465"),
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME") ?? "",
      password: Deno.env.get("SMTP_PASSWORD") ?? "",
    },
  },
  debug: {
    log: true,
    allowUnsecure: false,
    encodeLB: false,
    noStartTLS: false,
  },
});

const buildPlainTextBody = (code: string): string => {
  return [
    "Сәлеметсіз бе!",
    "",
    "MuseoNet жүйесіне тіркелуді растау үшін төмендегі кодты қолданыңыз:",
    "",
    `Код: ${code}`,
    "",
    "Бұл код 5 минут ішінде жарамды.",
    "Егер сіз MuseoNet сайтында тіркелуді бастамаған болсаңыз, бұл хатты елемеуге болады.",
    "",
    "Құрметпен,",
    "MuseoNet командасы",
  ].join("\n");
};

const buildHtmlBody = (code: string): string => {
  return `<!DOCTYPE html>
<html lang="kk">
  <head>
    <meta charset="UTF-8" />
    <title>MuseoNet – email растау коды</title>
  </head>
  <body>
    <p>Сәлеметсіз бе!</p>
    <p>MuseoNet жүйесіне тіркелуді растау үшін төмендегі кодты қолданыңыз:</p>
    <p><strong>Код: ${code}</strong></p>
    <p>Бұл код 5 минут ішінде жарамды.</p>
    <p>Егер сіз MuseoNet сайтында тіркелуді бастамаған болсаңыз, бұл хатты елемеуге болады.</p>
    <p>Құрметпен,<br />MuseoNet командасы</p>
  </body>
</html>`;
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
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

    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") ?? "no-reply@museonet.world";
    const from = `MuseoNet <${fromEmail}>`;

    console.log(`[SMTP] Sending verification code to ${email} from ${from}`);

    await smtpClient.send({
      from,
      to: email,
      subject: "MuseoNet – email растау коды",
      content: buildPlainTextBody(code),
      html: buildHtmlBody(code),
      priority: "normal",
    });

    console.log("[SMTP] Email sent successfully via SMTP");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);

    return new Response(
      JSON.stringify({ error: error?.message ?? String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
