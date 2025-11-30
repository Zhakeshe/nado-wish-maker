import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const smtpClient = new SMTPClient({
  connection: {
    hostname: Deno.env.get("SMTP_HOST") || "",
    port: parseInt(Deno.env.get("SMTP_PORT") || "465"),
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    },
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerificationEmailRequest = await req.json();

    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "no-reply@museonet.world";
    console.log(`Sending verification code to ${email} from ${fromEmail}`);

    await smtpClient.send({
      from: fromEmail,
      to: email,
      subject: "Верификациялық код / Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
              }
              .header {
                background: linear-gradient(135deg, #E33E64, #FFD166);
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 40px 30px;
                text-align: center;
              }
              .code-container {
                background: #F5EFE6;
                border: 2px solid #E33E64;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
              }
              .code {
                font-size: 42px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #E33E64;
                font-family: 'Courier New', monospace;
              }
              .message {
                color: #666666;
                font-size: 16px;
                line-height: 1.6;
                margin: 20px 0;
              }
              .warning {
                background: #fff8e1;
                border-left: 4px solid #FFD166;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
                font-size: 14px;
                color: #333333;
              }
              .footer {
                background: #F5EFE6;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #999999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>TENGIR</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Қазақстан археологиялық музейі</p>
              </div>
              
              <div class="content">
                <h2 style="color: #222222; margin-bottom: 20px;">Email верификациясы</h2>
                
                <p class="message">
                  <strong>Сәлеметсіз бе!</strong><br>
                  TENGIR платформасына қош келдіңіз! Тіркелуді аяқтау үшін төмендегі кодты енгізіңіз.
                </p>
                
                <div class="code-container">
                  <div style="font-size: 14px; color: #666666; margin-bottom: 10px;">Верификация коды:</div>
                  <div class="code">${code}</div>
                </div>
                
                <p class="message">
                  Бұл код <strong>5 минут</strong> ішінде жарамды.
                </p>
                
                <div class="warning">
                  ⚠️ <strong>Маңызды:</strong> Егер сіз тіркелмеген болсаңыз, бұл хатты елемеңіз. Кодты ешкіммен бөліспеңіз.
                </div>
                
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #666666; margin-top: 20px;">
                  Email расталғаннан кейін сіз мына мүмкіндіктерге қол жеткізе аласыз:<br>
                  🎮 Білім беру ойындары<br>
                  🗺️ Интерактивті карта<br>
                  📦 3D коллекция<br>
                  👤 Жеке кабинет
                </p>
              </div>
              
              <div class="footer">
                <p>© 2024 TENGIR / MuseoNet. Барлық құқықтар қорғалған.</p>
                <p>Ақтау, Қазақстан | +7 700 255 18 36</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    await smtpClient.close();

    console.log("Email sent successfully via SMTP");

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
