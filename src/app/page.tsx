"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import IMask from "imask";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  BookOpen,
  Clock,
  BarChart3,
  Lightbulb,
  CalendarDays,
  Monitor,
  Timer,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "./globals.css";

/* ─── Zod Schema ─── */
const schema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ"),
  school: z.string().min(2, "Vui lòng nhập tên trường"),
  // honeypot
  website: z.string().max(0, "Bot detected"),
});

type FormData = z.infer<typeof schema>;

const examInfo = [
  { icon: CalendarDays, label: "15 – 20 / 05" },
  { icon: Monitor, label: "Thi online" },
  { icon: Timer, label: "90 phút" },
];

/* ─── Animation variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/* ─── Page ─── */
export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      school: "",
      website: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website) return;

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
          result.error || "Đăng ký thất bại. Vui lòng thử lại sau.",
        );
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      alert(
        error.message ||
          "Đã xảy ra lỗi hệ thống khi đăng ký. Vui lòng liên hệ ban tổ chức.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background font-sans selection:bg-blue-200">
      <main>
        {/* ── Hero Banner ── */}
        <section
          className="relative w-full min-h-screen flex flex-col items-center justify-start pt-[5vh] sm:pt-[7vh] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #F7FBFF 0%, #F0F7FC 40%, #E6F1FA 100%)",
          }}
        >
          {/* Soft decorative blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[100px] pointer-events-none" />
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-sky-200/30 blur-[100px] pointer-events-none" />

          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative z-20 mb-6 sm:mb-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logofinal.png"
              alt="Logo"
              className="h-12 sm:h-16 w-auto object-contain"
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative z-20 text-center flex flex-col items-center px-4 w-full max-w-4xl"
          >
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-[#2D6EB5] leading-[1.2] mb-4 sm:mb-6">
              ĐĂNG KÍ THI THỬ
              <br />
              THPT MÔN TOÁN
            </h1>

            {/* CTA Button */}
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                document
                  .getElementById("registration-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              className="relative group rounded-full px-10 py-5 sm:px-14 sm:py-7
  text-sm sm:text-lg font-bold uppercase tracking-wider
  bg-[#4A90D9] hover:bg-[#3A7BC8] text-white
  shadow-[0_4px_20px_-4px_rgba(74,144,217,0.5)]
  transition-all duration-300
  hover:scale-105
  overflow-hidden
  animate-[pulseSoft_3s_ease-in-out_infinite]"
            >
              <span className="relative z-10">ĐĂNG KÍ NGAY</span>

              {/* shimmer auto chạy chậm */}
              <div
                className="absolute inset-0 h-full w-full 
  bg-gradient-to-r from-transparent via-white/20 to-transparent
  -translate-x-full animate-[shimmerSlow_4s_linear_infinite]"
              />
            </Button>
          </motion.div>

          {/* Iconedu Image */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-4xl px-4 mt-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/iconedu.png"
              alt="Học sinh"
              className="w-full h-auto object-contain max-h-[55vh]"
            />
          </motion.div>
        </section>

        {/* ── Registration Form Section ── */}
        <section
          id="registration-form"
          className="relative w-full min-h-[80vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-[#4A8FCE] to-[#2E6B9E]"
        >
          <div className="text-center mb-10 w-full px-4 relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-3 drop-shadow-md">
              ĐĂNG KÍ THI THỬ THPT MÔN TOÁN
            </h2>
            <div className="text-sm md:text-lg font-bold text-[#BEE3FA] drop-shadow-sm uppercase tracking-widest">
              Tháng 5 này • Làm bài Online • 90 phút thử sức • Biết điểm ngay
            </div>
          </div>

          <div className="w-full max-w-[600px] px-4 relative z-10">
            <div className="bg-white rounded-3xl p-2 sm:p-3 border-4 sm:border-[6px] border-dashed border-white/80 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
              {!submitted ? (
                <form
                  onSubmit={handleSubmit(onSubmit, (errors) =>
                    console.log("Form validation errors:", errors),
                  )}
                  className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#55abfa] to-[#3a71f0] p-6 sm:p-12 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
                  noValidate
                >
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-white mb-10 drop-shadow-md uppercase text-center w-full tracking-wider">
                    THÔNG TIN ĐĂNG KÝ
                  </h3>

                  <div className="w-full space-y-6">
                    {/* Honeypot */}
                    <div
                      className="absolute -left-[9999px] opacity-0"
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register("website")}
                      />
                    </div>

                    <div className="relative">
                      <Input
                        id="fullName"
                        placeholder="Họ và Tên"
                        {...register("fullName")}
                        className="w-full bg-[#f4f4f4] border-0 rounded-none h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg font-semibold text-gray-900 placeholder:text-gray-900 focus-visible:ring-2 focus-visible:ring-white/30 shadow-none"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-100 mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Số điện thoại"
                        {...register("phone")}
                        className="w-full bg-[#f4f4f4] border-0 rounded-none h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg font-semibold text-gray-900 placeholder:text-gray-900 focus-visible:ring-2 focus-visible:ring-white/30 shadow-none"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-100 mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        id="school"
                        placeholder="Trường THPT đang theo học"
                        {...register("school")}
                        className="w-full bg-[#f4f4f4] border-0 rounded-none h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg font-semibold text-gray-900 placeholder:text-gray-900 focus-visible:ring-2 focus-visible:ring-white/30 shadow-none"
                      />
                      {errors.school && (
                        <p className="text-sm text-red-100 mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 w-full">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="relative group font-heading w-full h-16 sm:h-20
  inline-flex items-center justify-center
  rounded-none
  bg-gradient-to-r from-[#EF6538] via-[#E8404E] to-[#DC1F68]
  text-2xl sm:text-3xl font-black text-white
  uppercase tracking-wider
  transition-all duration-300
  hover:scale-[1.02]
  overflow-hidden
  animate-[pulseSoft_3s_ease-in-out_infinite]
  disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-6 animate-spin mr-2" />
                            Đang gửi...
                          </>
                        ) : (
                          "ĐĂNG KÝ THI"
                        )}
                      </span>

                      {/* shimmer */}
                      {!isSubmitting && (
                        <div
                          className="absolute inset-0 h-full w-full
      bg-gradient-to-r from-transparent via-white/25 to-transparent
      -translate-x-[120%]
      animate-[shimmerSlow_3.5s_linear_infinite]"
                        />
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Success State */}
                  <div className="relative bg-white text-center rounded-2xl h-[520px] flex flex-col items-center justify-center px-6 sm:px-10 overflow-hidden">
                    {/* subtle background glow */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 16,
                      }}
                      className="relative z-10 mb-7"
                    >
                      <div className="flex size-28 items-center justify-center rounded-full bg-emerald-100/70 shadow-[0_18px_55px_rgba(16,185,129,0.28)]">
                        <div className="flex size-16 items-center justify-center rounded-full bg-white ring-4 ring-emerald-500/30">
                          <CheckCircle2 className="size-10 text-emerald-600" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.08,
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                      className="relative z-10"
                    >
                      <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Đăng ký thành công!
                      </h2>

                      <p className="mt-3 text-slate-600 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
                        Chúng tôi đã nhận thông tin đăng ký của bạn.
                        <br />
                        Trung tâm sẽ sớm liên hệ qua số điện thoại để tư vấn và
                        hoàn tất thủ tục.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.16,
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                      className="relative z-10 mt-8"
                    >
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          document
                            .getElementById("registration-form")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="relative group rounded-full px-10 py-5 sm:px-14 sm:py-7
  text-sm sm:text-lg font-bold uppercase tracking-wider
  bg-[#4A90D9] hover:bg-[#3A7BC8] text-white
  shadow-[0_4px_20px_-4px_rgba(74,144,217,0.5)]
  transition-all duration-300
  hover:scale-105
  overflow-hidden
  animate-[pulseSoft_3s_ease-in-out_infinite]"
                      >
                        <span className="relative z-10">Đăng ký thêm</span>

                        {/* shimmer auto */}
                        <div
                          className="absolute inset-0 h-full w-full
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    -translate-x-[120%]
    animate-[shimmerSlow_4s_linear_infinite]"
                        />
                      </Button>

                      <div className="mt-4 text-xs text-slate-500">
                        Bạn có thể đăng ký thêm cho bạn bè hoặc người thân.
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Thông tin được bảo mật và chỉ dùng để gửi hướng dẫn/kết quả.
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60">
          © 2026 Thi thử Toán Online
        </p>
      </motion.footer>
    </div>
  );
}
