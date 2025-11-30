<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f4f4f7;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 580px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 30px;
        border: 1px solid #e2e2e2;
      }
      h1 {
        font-size: 22px;
        color: #333333;
        margin-top: 0;
        text-align: center;
      }
      p {
        font-size: 15px;
        color: #444444;
        line-height: 1.5;
      }
      .code-box {
        margin: 25px 0;
        padding: 18px;
        background: #f9f9fb;
        border: 1px solid #d8d8dd;
        border-radius: 8px;
        text-align: center;
      }
      .code {
        font-size: 36px;
        letter-spacing: 6px;
        font-weight: bold;
        color: #d9374a;
        font-family: "Courier New", monospace;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Museonet — Email верификация</h1>

      <p>Сәлеметсіз бе! Тіркелуді аяқтау үшін төмендегі верификация кодын енгізіңіз.</p>

      <div class="code-box">
        <div class="code">${code}</div>
      </div>

      <p>Бұл код <strong>5 минут</strong> ішінде жарамды.</p>

      <p style="font-size: 13px; color: #666;">
        Егер бұл әрекетті сіз жасамаған болсаңыз, хатты елемей-ақ қойыңыз.
      </p>

      <div class="footer">
        © 2025 TENGIR / MuseoNet<br />
        Ақтау, Қазақстан
      </div>
    </div>
  </body>
</html>
