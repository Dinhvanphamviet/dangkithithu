import { after, NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

type RegistrationPayload = {
  fullName: string;
  phone: string;
  email: string;
};

function getSmtpConfig() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: MAIL_FROM,
  };
}

async function sendConfirmationEmail({
  fullName,
  phone,
  email,
}: RegistrationPayload) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    console.error("Confirmation email skipped: SMTP is not configured.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  await transporter.sendMail({
    from: smtpConfig.from,
    to: email,
    subject: "ChÃºc má»«ng báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ thi thá»­ thÃ nh cÃ´ng",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #16325c; background: #f7faff; padding: 24px;">
        <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #dbe7ff;">
          <h2 style="margin-top: 0; color: #1656D6;">
            ChÃºc má»«ng báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ thÃ nh cÃ´ng ðŸŽ‰
          </h2>

          <p>Xin chÃ o <strong>${fullName}</strong>,</p>

          <p>
            Báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ tham gia ká»³ thi thá»­ THPT mÃ´n ToÃ¡n 2026 thÃ nh cÃ´ng.
          </p>

          <p>
            Há»‡ thá»‘ng sáº½ sá»­ dá»¥ng thÃ´ng tin sau Ä‘á»ƒ Ä‘Äƒng nháº­p:
          </p>

          <div style="background: #F4F8FF; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>TÃ i khoáº£n thi:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Máº­t kháº©u Ä‘Äƒng nháº­p:</strong> ${phone}</p>
          </div>

          <p>
            Vui lÃ²ng lÆ°u láº¡i thÃ´ng tin Ä‘á»ƒ sá»­ dá»¥ng khi há»‡ thá»‘ng má»Ÿ thi.
          </p>

          <p>
            Háº¹n gáº·p báº¡n trong ká»³ thi thá»­ diá»…n ra vÃ o <strong>thÃ¡ng 5</strong>.
            ChÃºc báº¡n Ã´n táº­p hiá»‡u quáº£ vÃ  Ä‘áº¡t káº¿t quáº£ tháº­t tá»‘t!
          </p>

          <p style="margin-top: 24px;">
            TrÃ¢n trá»ng,<br />
            <strong>Ban tá»• chá»©c ká»³ thi thá»­ THPT</strong>
          </p>
        </div>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email } = body as Partial<RegistrationPayload>;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin" },
        { status: 400 }
      );
    }

    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
      process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json(
        { error: "Lá»—i mÃ¡y chá»§: ChÆ°a cáº¥u hÃ¬nh Google Sheets" },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
    });

    const rows = existing.data.values || [];

    const duplicate = rows.find((row) => {
      const sheetPhone = row[2];
      const sheetEmail = row[3];

      return sheetPhone === phone || sheetEmail === email;
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Sá»‘ Ä‘iá»‡n thoáº¡i hoáº·c email Ä‘Ã£ Ä‘Äƒng kÃ½ trÆ°á»›c Ä‘Ã³" },
        { status: 400 }
      );
    }

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(now);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[formattedDate, fullName, phone, email]],
      },
    });

    after(async () => {
      try {
        await sendConfirmationEmail({ fullName, phone, email });
      } catch (error) {
        console.error("Confirmation email failed:", error);
      }
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Google Sheets error:", error);

    return NextResponse.json(
      { error: error.message || "Lá»—i há»‡ thá»‘ng" },
      { status: 500 }
    );
  }
}
