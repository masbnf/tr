import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(232,0,42,0.24),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(255,112,136,0.12),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-2xl">
            <Link href="/" className="text-sm font-black tracking-widest text-brand-300">
              MECHANICA
            </Link>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">ورود به پنل مدیریت</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
              مدیریت سفارش‌های امداد خودرو، اعزام متخصص‌ها و کنترل درآمد روزانه در محیطی هماهنگ با ظاهر اصلی سایت.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur sm:p-7">
            <p className="text-xs font-bold tracking-widest text-brand-300">SECURE AREA</p>
            <h2 className="mt-2 text-2xl font-black">دسترسی مدیر</h2>
            <AdminLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
