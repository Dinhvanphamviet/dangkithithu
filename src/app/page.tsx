"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  CircleCheckBig,
  NotebookText,
  SearchCheck,
  BadgeCheck,
  ArrowRight,
  Users,
  Monitor,
  Clock,
  CheckCircle,
} from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const FACEBOOK_PAGE_URL =
    "https://www.facebook.com/profile.php?id=61579516583941";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Đăng ký thất bại. Vui lòng thử lại sau."
        );
      }

      toast.success("Đăng ký thành công 🎉");
      setSubmitted(true);
      reset();
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Đã xảy ra lỗi hệ thống khi đăng ký. Vui lòng liên hệ ban tổ chức."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-white">
          <div className="bg-[#0E55D8] px-4 py-5 sm:py-6">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-lg font-extrabold uppercase tracking-wide sm:text-2xl md:text-3xl">
                HỆ THỐNG LUYỆN THI THPT QUỐC GIA
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full overflow-hidden h-[520px] md:h-auto">
          <img
            src="/banner.png"
            alt="banner"
            className="absolute inset-0 h-full w-full object-cover md:static md:h-auto md:w-full md:object-contain"
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:absolute md:inset-0">
            <h1 className="text-3xl font-extrabold uppercase text-[#1E5ED6] md:text-6xl">
              THI THỬ THPT MÔN TOÁN 2026
            </h1>

            <p className="mt-4 text-lg font-semibold text-[#1E5ED6] md:text-xl">
              Tổng duyệt trước kỳ thi thật - Biết điểm thật - Tăng điểm thật
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("registration-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 rounded-full bg-[#F4D75C] px-8 py-4 text-lg font-bold text-[#1E5ED6] shadow-lg transition hover:scale-105 md:text-2xl"
            >
              ĐĂNG KÝ THI THỬ
            </button>
          </div>
        </section>

        <section className="w-full bg-[#F3F7FB] px-6 py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-extrabold uppercase text-[#1E5ED6] md:text-4xl">
              HỆ THỐNG LUYỆN THI TIÊU CHUẨN
            </h2>

            <p className="mt-4 text-lg text-[#1E5ED6] md:text-xl">
              Đề thi được xây dựng bám sát định hướng ra đề của Bộ Giáo dục và
              Đào tạo Việt Nam:
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[28px] bg-[#1656D6] px-6 py-10 text-center text-lg font-bold text-white md:text-xl">
                ĐÚNG CHUẨN <br /> CẤU TRÚC ĐỀ THI
              </div>

              <div className="rounded-[28px] bg-[#1656D6] px-6 py-10 text-center text-lg font-bold text-white md:text-xl">
                PHÂN BỔ <br /> THEO 4 MỨC ĐỘ
              </div>

              <div className="rounded-[28px] bg-[#1656D6] px-6 py-10 text-center text-lg font-bold text-white md:text-xl">
                CÂU HỎI CHỌN LỌC <br /> PHÂN BỔ RÕ RÀNG
              </div>

              <div className="rounded-[28px] bg-[#1656D6] px-6 py-10 text-center text-lg font-bold text-white md:text-xl">
                BÁM SÁT CHUYÊN ĐỀ <br /> TRỌNG TÂM
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-7xl items-stretch gap-10 lg:grid-cols-2">
            <div className="flex h-full">
              <div className="flex w-full flex-col justify-center text-[#1656D6]">
                <h2 className="text-3xl font-extrabold uppercase leading-tight md:text-4xl">
                  THI THỬ SỚM - LỢI THẾ SỚM
                </h2>

                <p className="mt-4 text-lg leading-relaxed md:text-2xl">
                  Rất nhiều học sinh đợi “gần thi mới test thử”.
                  <br />
                  Nhưng khi đó, nếu điểm thấp... sẽ rất khó cải thiện nhanh.
                </p>

                <div className="mt-10">
                  <h3 className="text-2xl font-extrabold uppercase md:text-2xl">
                    ĐĂNG KÝ THI THỬ NGAY ĐỂ:
                  </h3>

                  <ul className="mt-4 space-y-0 text-lg leading-relaxed md:text-2xl">
                    <li className="flex items-start gap-3">
                      <CircleCheckBig
                        className="mt-1 text-[#1E5ED6]"
                        size={22}
                      />
                      <span>Chủ động điều chỉnh lộ trình ôn tập</span>
                    </li>

                    <li className="flex items-start gap-3">
                      <CircleCheckBig
                        className="mt-1 text-[#1E5ED6]"
                        size={22}
                      />
                      <span>Xác định mục tiêu điểm rõ ràng (7+ | 8+ | 9+)</span>
                    </li>

                    <li className="flex items-start gap-3">
                      <CircleCheckBig
                        className="mt-1 text-[#1E5ED6]"
                        size={22}
                      />
                      <span>
                        Tăng 1 - 2 điểm sau mỗi lần điều chỉnh đúng cách
                      </span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("registration-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-12 inline-flex w-fit items-center rounded-full bg-[#F2DD63] px-10 py-5 text-lg font-extrabold uppercase text-[#1656D6] transition hover:scale-[1.02] md:text-2xl"
                >
                  Đăng ký ngay
                  <span className="ml-3 text-4xl leading-none">→</span>
                </button>
              </div>
            </div>

            <div className="flex h-full items-center justify-center overflow-hidden rounded-[40px] bg-[#F3F6FF] p-6 md:p-8">
              <img
                src="/feature.png"
                alt="Thi thử sớm lợi thế sớm"
                className="block max-h-full w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="w-full bg-[#EEF3F9] px-6 pt-14 pb-6 md:px-10 md:pt-16 md:pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center text-[#1656D6]">
              <h2 className="text-3xl font-extrabold uppercase md:text-4xl">
                QUYỀN LỢI KHI ĐĂNG KÝ SỚM
              </h2>
              <p className="mt-4 text-lg md:text-xl">
                Đăng ký sớm để nhận ngay nhiều phần quà giá trị!
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-2">
              <div className="flex items-center gap-5 rounded-[36px] bg-[#1557DD] px-8 py-10 text-white md:px-12">
                <GraduationCap
                  className="h-12 w-12 shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-xl font-extrabold uppercase leading-snug md:text-2xl">
                  THAM GIA THI THỬ MIỄN PHÍ
                </span>
              </div>

              <div className="flex items-center gap-5 rounded-[36px] bg-[#1557DD] px-8 py-10 text-white md:px-12">
                <NotebookText
                  className="h-12 w-12 shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-xl font-extrabold uppercase leading-snug md:text-2xl">
                  NHẬN TÀI LIỆU ÔN TẬP
                </span>
              </div>

              <div className="flex items-center gap-5 rounded-[36px] bg-[#1557DD] px-8 py-10 text-white md:px-12">
                <SearchCheck className="h-12 w-12 shrink-0" strokeWidth={2.5} />
                <span className="text-xl font-extrabold uppercase leading-snug md:text-2xl">
                  NHẬN FILE PHÂN TÍCH CHI TIẾT
                </span>
              </div>

              <div className="flex items-center gap-5 rounded-[36px] bg-[#1557DD] px-8 py-10 text-white md:px-12">
                <BadgeCheck className="h-12 w-12 shrink-0" strokeWidth={2.5} />
                <span className="text-xl font-extrabold uppercase leading-snug md:text-2xl">
                  NHẬN TƯ VẤN CẢI THIỆN
                </span>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("registration-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center rounded-full bg-[#F2DD63] px-8 py-4 text-xl font-extrabold uppercase text-[#1656D6] transition hover:scale-[1.02] md:px-10 md:py-5 md:text-2xl"
              >
                Đăng ký ngay
                <ArrowRight className="ml-3 h-7 w-7" strokeWidth={3} />
              </button>
            </div>
          </div>
        </section>

        <section id="registration-form" className="relative w-full overflow-hidden">
          <img
            src="/form.png"
            alt="banner"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:hidden"
          />

          <img
            src="/form.png"
            alt="banner"
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
          />

          <div className="relative z-10">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="text-[#1E5ED6]">
                <h2 className="text-3xl font-extrabold uppercase leading-tight md:text-4xl">
                  ĐĂNG KÝ THAM GIA THI THỬ
                </h2>

                <h3 className="mt-8 text-xl font-bold uppercase md:text-3xl">
                  THÔNG TIN KỲ THI
                </h3>

                <ul className="mt-4 space-y-4 text-lg md:text-2xl">
                  <li className="flex items-start gap-3">
                    <Users className="mt-1 shrink-0 text-[#1E5ED6]" size={24} />
                    <span>Đối tượng: Học sinh lớp 12</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Monitor
                      className="mt-1 shrink-0 text-[#1E5ED6]"
                      size={24}
                    />
                    <span>Hình thức: Online</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="mt-1 shrink-0 text-[#1E5ED6]" size={24} />
                    <span>Thời gian: 90 phút</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle
                      className="mt-1 shrink-0 text-[#1E5ED6]"
                      size={24}
                    />
                    <span>Công bố điểm ngay sau khi nộp bài</span>
                  </li>
                </ul>
              </div>

              <div className="text-[#1E5ED6]">
                {!submitted ? (
                  <>
                    <h3 className="text-center text-xl font-bold uppercase md:text-3xl">
                      THÔNG TIN CÁ NHÂN
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">

                      <div>
                        <label className="mb-2 block text-sm md:text-lg">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          {...register("fullName")}
                          autoComplete="name"
                          placeholder="Nhập họ và tên"
                          className="w-full rounded-full bg-[#F4D75C] px-6 py-3 outline-none md:py-4"
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm md:text-lg">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          autoComplete="tel"
                          placeholder="Nhập số điện thoại"
                          className="w-full rounded-full bg-[#F4D75C] px-6 py-3 outline-none md:py-4"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm md:text-lg">
                          Email
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          autoComplete="email"
                          placeholder="Nhập chính xác Email để nhận tài khoản thi"
                          className="w-full rounded-full bg-[#F4D75C] px-6 py-3 outline-none md:py-4"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-full bg-[#F4D75C] px-8 py-3 text-lg font-bold text-[#1E5ED6] transition hover:scale-105 disabled:opacity-70 md:text-xl"
                        >
                          {isSubmitting ? "ĐANG GỬI..." : "ĐĂNG KÝ"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="mx-auto max-w-xl rounded-[32px] bg-white/95 p-8 text-center shadow-[0_20px_60px_rgba(30,94,214,0.18)] backdrop-blur">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F2FF]">
                      <CheckCircle className="h-10 w-10 text-[#1E5ED6]" />
                    </div>

                    <h3 className="mt-6 text-2xl font-extrabold uppercase md:text-3xl">
                      ĐĂNG KÝ THÀNH CÔNG!
                    </h3>

                    <p className="mt-4 text-base leading-relaxed md:text-lg">
                      Chúc mừng bạn đã đăng ký tham gia kỳ thi thử THPT môn Toán
                      2026.
                      <br />
                      Ban tổ chức sẽ sớm gửi thông tin chi tiết đến bạn qua email
                      hoặc số điện thoại.
                    </p>

                    <p className="mt-4 text-base font-semibold leading-relaxed md:text-lg">
                      Đừng quên follow fanpage Facebook để cập nhật lịch thi, tài
                      liệu ôn tập và các thông báo mới nhất nhé.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <a
                        href={FACEBOOK_PAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-[#1E5ED6] px-8 py-3 text-base font-bold text-white transition hover:scale-105 md:text-lg"
                      >
                        Follow fanpage Facebook
                      </a>

                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center rounded-full border-2 border-[#1E5ED6] px-8 py-3 text-base font-bold text-[#1E5ED6] transition hover:scale-105 md:text-lg"
                      >
                        Đăng ký lại
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-b from-[#0E55D8] to-[#1D73E8] px-4 py-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="text-lg font-extrabold uppercase tracking-wide sm:text-2xl md:text-3xl">
            HỆ THỐNG LUYỆN THI THPT QUỐC GIA
          </div>
        </div>
      </footer>
    </div>
  );
}
