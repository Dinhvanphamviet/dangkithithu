import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, phone, school } = body;

        // Validate required fields
        if (!fullName || !phone || !school) {
            return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
        }

        const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

        // Server configuration check
        if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
            console.error("Missing Google credentials in environment variables.");
            return NextResponse.json({ error: 'Lỗi máy chủ: Chưa cấu hình kết nối Google Sheets' }, { status: 500 });
        }

        // Authenticate with Google
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines from .env string
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Format current timestamp gracefully
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'Asia/Ho_Chi_Minh'
        }).format(now);

        // Append a row to 'Sheet1'
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [
                        formattedDate, // Timestamp (Cột A)
                        fullName,      // Cột B
                        phone,         // Cột D
                        school         // Cột E
                    ]
                ],
            },
        });

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error('Error appending to Google Sheets:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
