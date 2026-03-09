import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const {
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      MAIL_FROM,
    } = process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json(
        { error: "Lỗi máy chủ: Chưa cấu hình Google Sheets" },
        { status: 500 }
      );
    }

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
      return NextResponse.json(
        { error: "Lỗi máy chủ: Chưa cấu hình SMTP" },
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

    // 1. Lấy dữ liệu từ sheet
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
    });

    const rows = existing.data.values || [];

    // 2. Check trùng phone / email
    const duplicate = rows.find((row) => {
      const sheetPhone = row[2];
      const sheetEmail = row[3];

      return sheetPhone === phone || sheetEmail === email;
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Số điện thoại hoặc email đã đăng ký trước đó" },
        { status: 400 }
      );
    }

    // 3. Append data vào Google Sheet
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

    // 4. Gửi email thông báo
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: "Chúc mừng bạn đã đăng ký thi thử thành công",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #16325c; background: #f7faff; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #dbe7ff;">
            <h2 style="margin-top: 0; color: #1656D6;">
              Chúc mừng bạn đã đăng ký thành công 🎉
            </h2>

            <p>Xin chào <strong>${fullName}</strong>,</p>

            <p>
              Bạn đã đăng ký tham gia kỳ thi thử THPT môn Toán 2026 thành công.
            </p>

            <p>
              Hệ thống sẽ sử dụng thông tin sau để đăng nhập:
            </p>

            <div style="background: #F4F8FF; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Tài khoản thi:</strong> ${email}</p>
              <p style="margin: 0;"><strong>Mật khẩu đăng nhập:</strong> ${phone}</p>
            </div>

            <p>
              Vui lòng lưu lại thông tin để sử dụng khi hệ thống mở thi.
            </p>

            <p>
              Hẹn gặp bạn trong kỳ thi thử diễn ra vào <strong>tháng 5</strong>.
              Chúc bạn ôn tập hiệu quả và đạt kết quả thật tốt!
            </p>

            <p style="margin-top: 24px;">
              Trân trọng,<br />
              <strong>Ban tổ chức kỳ thi thử THPT</strong>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Google Sheets / SMTP error:", error);

    return NextResponse.json(
      { error: error.message || "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}