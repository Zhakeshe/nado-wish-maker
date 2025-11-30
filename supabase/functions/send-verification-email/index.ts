import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
<html lang="kk">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MuseoNet – Верификация</title>
  </head>
  <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;">
      <h1 style="color: #222222; margin: 0 0 20px 0; font-size: 24px;">MuseoNet – Верификация email</h1>
      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
        Сәлеметсіз бе! Тіркелуді аяқтау үшін төмендегі верификация кодын енгізіңіз:
      </p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 6px; text-align: center; margin: 0 0 20px 0;">
        <div style="font-size: 32px; font-weight: bold; color: #E33E64; letter-spacing: 4px; font-family: monospace;">
          ${code}
        </div>
      </div>
      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
        Бұл код <strong>5 минут</strong> ішінде жарамды.
      </p>
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 0;">
        Егер бұл әрекетті сіз жасамаған болсаңыз, хатты елемей-ақ қойыңыз.
      </p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px; text-align: center;">
        © 2025 TENGIR / MuseoNet<br>
        Ақтау, Қазақстан
      </div>
    </div>
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

    console.log(`[Resend] Sending verification code to ${email}`);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MuseoNet <onboarding@resend.dev>",
        to: email,
        subject: "MuseoNet – Email верификациясы",
        html: buildHtmlBody(code),
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("[Resend] Error:", resendData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        {
          status: resendResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("[Resend] Email sent successfully:", resendData);

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[Resend] Error in send-verification-email function:", error);

    return new Response(
      JSON.stringify({ error: error?.message ?? String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
