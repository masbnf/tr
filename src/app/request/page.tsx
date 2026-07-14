import { Suspense } from "react";
import Link from "next/link";
import RequestForm from "@/components/forms/RequestForm";

export default function RequestPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061426] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,194,255,0.26),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(232,0,42,0.18),transparent_26%),linear-gradient(145deg,#061426_0%,#0b2440_50%,#07111f_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-45" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_440px] lg:items-center">
          <div className="hidden max-w-xl lg:block">
            <Link href="/" className="text-sm font-black tracking-widest text-cyan-200">
              MECHANICA
            </Link>
            <h1 className="mt-5 text-5xl font-black leading-tight">
              درخواست سرویس سریع، شفاف و حرفه‌ای
            </h1>
            <p className="mt-5 text-base leading-8 text-white/68">
              اطلاعاتت را ثبت کن، موقعیت را بفرست و نزدیک‌ترین متخصص برای پیگیری سرویس آماده می‌شود.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[440px]">
            <div className="relative rounded-[2rem] border border-cyan-200/30 bg-cyan-100/[0.08] p-5 shadow-[0_0_0_1px_rgba(125,211,252,0.14),0_28px_90px_rgba(8,145,178,0.24)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
              <div className="pointer-events-none absolute -left-2 top-24 h-24 w-1 rounded-full bg-cyan-300/70 blur-[2px]" />
              <div className="pointer-events-none absolute -right-2 bottom-20 h-28 w-1 rounded-full bg-cyan-300/60 blur-[2px]" />

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-200/35 bg-white/5 shadow-[0_0_32px_rgba(34,211,238,0.24)]">
                <span className="text-3xl" aria-hidden="true">⚙</span>
              </div>

              <div className="mb-6 text-center">
                <p className="text-xs font-black tracking-widest text-cyan-200">SERVICE REQUEST</p>
                <h2 className="mt-2 text-2xl font-black">ثبت درخواست</h2>
              </div>

              <Suspense fallback={null}>
                <RequestForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
