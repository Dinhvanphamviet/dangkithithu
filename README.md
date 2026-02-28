# Đăng Kí Thi Thử THPT Môn Toán - Online

Dự án landing page phục vụ việc đăng kí tham gia kỳ thi thử THPT Quốc gia môn Toán trực tuyến. Nền tảng cung cấp giao diện thân thiện, hiện đại, giúp học sinh dễ dàng ghi danh và theo dõi thông tin kỳ thi, đồng thời dữ liệu đăng kí được lưu trữ tự động vào Google Sheets thông qua API.

## 🚀 Tính Năng Chính

- **Giao diện Hero Banner thu hút**: Banner nổi bật với thông điệp rõ ràng và nút Đăng kí (Call To Action) ở trung tâm.
- **Form đăng kí thông minh**: Thu thập thông tin học sinh nhanh chóng. Sử dụng `react-hook-form` và `zod` để xác thực (validate) dữ liệu đầu vào một cách chặt chẽ.
- **Tích hợp Google Sheets API**: Dữ liệu đăng kí của học sinh được tự động đẩy lệnh và lưu trữ an toàn trên Google Sheets theo thời gian thực, giúp ban tổ chức dễ dàng quản lý.
- **UX/UI Hiện đại & Responsive**: Thiết kế tương thích mọi thiết bị (Mobile/Tablet/PC) kết hợp với các hiệu ứng mượt mà từ `framer-motion` và hệ thống component của `shadcn/ui`.

## 🛠️ Công Nghệ Sử Dụng

- **Core/Framework**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **UI/Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Database/ORM**: [Prisma](https://www.prisma.io/)
- **Third-party Integration**: `googleapis` (kết nối Google Sheets API)

## 📦 Cài Đặt & Chạy Môi Trường Phát Triển (Local)

### Yêu cầu hệ thống:
- Node.js (khuyến nghị phiên bản 20 trở lên)
- Trình quản lý gói: npm, yarn, pnpm, hoặc bun

### Các bước cài đặt:

1. **Clone repository và cài đặt thư viện**:

```bash
git clone <repository-url>
cd thi-thu-toan-online
npm install
```

2. **Cấu hình biến môi trường (`.env`)**:
Tạo file `.env.local` hoặc `.env` ở thư mục gốc của dự án. Bạn cần thiết lập các thông số sau để tích hợp Google Sheets (lấy từ Google Cloud Console):

```env
# Google Sheets Integration
GOOGLE_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-spreadsheet-id
```
*(Nếu dự án sử dụng database bằng Prisma, bạn cần cấu hình thêm `DATABASE_URL`)*.

3. **Khởi chạy ứng dụng**:

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🚀 Triển Khai (Deployment)

Cách dễ dàng nhất để triển khai ứng dụng Next.js là sử dụng nền tảng [Vercel](https://vercel.com/):
1. Đăng nhập vào Vercel và **Import Project** từ kho lưu trữ GitHub chứa mã nguồn này.
2. Vào phần **Environment Variables**, thêm đầy đủ các biến môi trường (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`) giống như ở local.
3. Nhấp vào **Deploy** và chờ quá trình hoàn tất.

---
*Dự án được xây dựng nhằm mang lại trải nghiệm ôn tập và ghi danh trực tuyến tốt nhất cho học sinh THPT.*
