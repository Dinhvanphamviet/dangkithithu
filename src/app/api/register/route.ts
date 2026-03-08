import { NextResponse } from "next/server";
import { google } from "googleapis";

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

    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
      process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json(
        { error: "Lỗi máy chủ: Chưa cấu hình Google Sheets" },
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

    // ===== 1️⃣ LẤY DỮ LIỆU TỪ SHEET =====

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
    });

    const rows = existing.data.values || [];

    // ===== 2️⃣ CHECK TRÙNG PHONE / EMAIL =====

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

    // ===== 3️⃣ APPEND DATA =====

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

    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    console.error("Google Sheets error:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}