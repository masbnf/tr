import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleServiceShowcase from "@/components/landing/VehicleServiceShowcase";
import {
  ZapIcon, WrenchIcon, LocationIcon, CheckIcon, PhoneIcon,
} from "@/components/ui/Icons";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: WrenchIcon,   num: "۰۱", title: "سرویس را انتخاب کن",   desc: "نوع خدمات موردنیازت را انتخاب کن و اطلاعات خودرو را وارد کن." },
  { icon: LocationIcon, num: "۰۲", title: "موقعیتت را ثبت کن",   desc: "آدرس یا موقعیت دقیق خودت را برای اعزام متخصص مشخص کن." },
  { icon: CheckIcon,    num: "۰۳", title: "متخصص به محل می‌رسد", desc: "نزدیک‌ترین متخصص درخواست را دریافت می‌کند و به محل شما می‌آید." },
];

const STATS = [
  { v: "+۵۰۰",    l: "سرویس موفق" },
  { v: "۲۸ دقیقه", l: "میانگین پاسخ" },
  { v: "+۲۰",     l: "متخصص فعال" },
  { v: "۲۴/۷",    l: "پشتیبانی" },
];

/* Trust badges shown alongside the desktop hero CTAs. */
const TRUST = ["بدون ثبت‌نام", "پرداخت در محل", "متخصص تأیید‌شده", "ضمانت کیفیت"];

/* The three trust indicators shown in the mobile hero (distinct, shorter
   copy tailored for the compact mobile layout). */
const MOBILE_TRUST = ["اعزام سریع", "متخصص تأییدشده", "پرداخت در محل"];

/* ─── Mock dashboard data ───────────────────────────────────────────────── */
const MOCK_STATS = [
  { l: "سفارش امروز",  v: "۱۴", cls: "bg-blue-50 text-blue-700" },
  { l: "در حال انجام", v: "۳",  cls: "bg-amber-50 text-amber-700" },
  { l: "تکمیل‌شده",   v: "۱۱", cls: "bg-green-50 text-green-700" },
  { l: "درآمد (هزار)", v: "۲۴۰۰", cls: "bg-violet-50 text-violet-700" },
];

const MOCK_ORDERS = [
  { n: "علی رضایی",   s: "مکانیک سیار", st: "در حال انجام", c: "text-amber-500" },
  { n: "سارا محمدی",  s: "تعویض باتری", st: "اعزام شد",      c: "text-brand-500" },
  { n: "رضا کریمی",   s: "یدک‌کش",      st: "تکمیل شد",     c: "text-green-500" },
  { n: "مریم احمدی",  s: "تعویض روغن",  st: "تکمیل شد",     c: "text-green-500" },
];

/* ─── Bar chart heights ─────────────────────────────────────────────────── */
const BARS = [30, 55, 40, 70, 60, 88, 50, 75, 45, 90, 65, 50, 80];

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          HERO  —  Navy + Red geometric grid
          Mobile: text-first (no image), Desktop: original two-column layout.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex min-h-screen flex-col overflow-hidden bg-[#080d1f]"
        style={{
          backgroundImage: "url('/images/garage-hero-bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_0%,transparent_25%,rgba(8,13,31,0.28)_50%,rgba(8,13,31,0.58)_75%,rgba(8,13,31,0.9)_100%)] lg:block" />
        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col">

          {/* ── Mobile hero: text-first, no image ── */}
          <div className="flex flex-1 flex-col justify-center px-6 pb-14 pt-28 text-right sm:px-8 lg:hidden">
            <div className="-mx-6 px-6 py-6 sm:-mx-8 sm:px-8">

            <p className="anim-fadeup mb-3 text-sm font-black tracking-[.1em] text-white">
              خدمات سیار خودرو در شیراز
            </p>

            <h1 className="anim-fadeup delay-1 font-black text-white leading-[1.15] mb-4 text-4xl sm:text-[40px]">
              خدمات خودرو، <span style={{ color: "#ff6b82" }}>سریع</span> در محل شما
            </h1>

            <p className="anim-fadeup delay-2 mb-6 max-w-md text-base font-extrabold text-white sm:text-lg" style={{ lineHeight: 1.9 }}>
              مکانیکا راه سریع و مطمئن برای درخواست خدمات سیار خودرو است؛ از مکانیک و باتری تا یدک‌کش و تعویض روغن، بدون دردسر و در کمترین زمان.
            </p>

            {/* CTA buttons */}
            <div className="anim-fadeup delay-3 flex flex-col gap-3 mb-5">
              <Link href="/request"
                className="flex items-center justify-center gap-2 font-black w-full px-6 py-4 rounded-xl text-base transition-all duration-200 active:scale-[0.98] shadow-[0_8px_32px_rgba(232,0,42,0.4)]"
                style={{ background: "#e8002a", color: "#fff" }}>
                <ZapIcon size={18}/>
                درخواست سرویس
              </Link>
              <a href="tel:+98"
                className="flex items-center justify-center gap-2 border-2 text-white font-bold w-full px-6 py-4 rounded-xl text-base hover:bg-white/10 active:scale-[0.98] transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.35)" }}>
                <PhoneIcon size={18}/>
                تماس مستقیم
              </a>
            </div>

            {/* Trust indicators — three compact badges */}
            <div className="anim-fadeup delay-4 flex flex-wrap gap-x-5 gap-y-2">
              {MOBILE_TRUST.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                  <CheckIcon size={14} className="shrink-0 text-[#ff7088]"/>
                  {f}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* ── Desktop hero: original two-column layout (unchanged) ── */}
          <div className="hidden flex-1 lg:flex">

            {/* LEFT panel: text content */}
            <div className="ml-auto flex w-full max-w-[760px] flex-col justify-center px-8 py-24 text-right lg:px-16 lg:py-0">
              <div className="-mr-16 py-10 pr-16 pl-10">

              <p className="anim-fadeup text-white/60 text-[17px] font-bold tracking-[.16em] uppercase mb-6">
                خدمات سیار خودرو · شیراز
              </p>

              <h1 className="anim-fadeup delay-1 font-black text-white leading-[1.1] mb-6"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
                خدمات سیار<br/>
                <span style={{ color: "#e8002a" }}>خودرو</span><br/>
                در محل شما
              </h1>

              <p className="anim-fadeup delay-2 text-white/70 leading-loose mb-8 max-w-lg text-right text-[22px]">
                مکانیک، باتری، یدک‌کش و تعویض روغن — سریع، مطمئن،
                در کمتر از ۳۰ دقیقه در شیراز.
              </p>

              {/* CTA buttons */}
              <div className="anim-fadeup delay-3 flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
                <Link href="/request"
                  className="flex items-center justify-center gap-2 font-black px-8 py-4 rounded-xl text-[17px] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(232,0,42,0.4)]"
                  style={{ background: "#e8002a", color: "#fff" }}>
                  <ZapIcon size={17}/>
                  درخواست سرویس
                </Link>
                <a href="tel:+98"
                  className="flex items-center justify-center gap-2 border-2 text-white font-bold px-6 py-4 rounded-xl text-[17px] hover:bg-white/10 transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}>
                  <PhoneIcon size={17}/>
                  تماس مستقیم
                </a>
              </div>

              {/* Trust badges */}
              <div className="anim-fadeup delay-4 grid grid-cols-2 gap-x-8 gap-y-3">
                {TRUST.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-white/65 text-[17px]">
                    <CheckIcon size={16} className="shrink-0 text-[#e8002a]"/>
                    {f}
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* RIGHT panel: brand logo artwork */}
            {false ? (
              <div className="relative w-full max-w-[760px] rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.35)] border border-white/10">
                <Image
                  src="/images/landing-services-showcase.png"
                  alt="مکانیکا — خدمات هوشمند خودرو"
                  width={1212}
                  height={1298}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Sections below are reordered on mobile (services first) via flex
          `order` utilities — no markup or assets are duplicated. Desktop
          keeps the original stats → services → how → cta order. */}
      <main
        className="relative flex flex-col overflow-hidden bg-[#090b12]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(6,8,14,0.48) 0%, rgba(6,8,14,0.58) 38%, rgba(6,8,14,0.68) 100%), url('/images/industrial-sections-bg.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
        }}
      >

        {/* ══ STATS BAR ════════════════════════════════════════════════════ */}
        <section className="order-2 bg-black/12 backdrop-blur-[1px] lg:order-1">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.l} className={`text-center py-7 px-4 ${i % 2 === 0 && i < 2 ? "border-b md:border-b-0 border-white/10" : ""} ${i < 3 ? "md:border-l border-white/10" : ""}`}>
                <p className="font-black text-white mb-1" style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)" }}>{s.v}</p>
                <p className="text-sm sm:text-[15px] text-white/65">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SERVICES ════════════════════════════════════════════════════ */}
        <section id="services" className="order-1 scroll-mt-24 bg-black/10 px-3 pb-16 pt-8 backdrop-blur-[1px] sm:px-6 lg:order-2 lg:pt-16">
          <div className="max-w-6xl mx-auto">
            {/* Heading is part of the desktop "چه کمکی می‌تونیم بکنیم؟" section
                intro; the mobile hero already introduces the service, so the
                heading is hidden on mobile to keep the circular image as the
                first thing seen after the hero CTAs. */}
            <div className="hidden lg:block">
              <span className="section-eyebrow" style={{ color: "#ff7088" }}>خدماتی که ارائه می‌دهیم</span>
              <h2 className="section-title" style={{ color: "white" }}>چه کمکی می‌تونیم بکنیم؟</h2>
            </div>

            {/* ── Vehicle selector + showcase image + hotspots + chips ──
                Extracted into a client component since it owns interactive
                state (selected vehicle); the heading above stays part of
                this server component. */}
            <div className="lg:mt-8">
              <VehicleServiceShowcase />
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════
            Dark navy continuation of the hero/services brand — connected
            process timeline (horizontal on desktop, vertical on mobile),
            both rendered from the shared STEPS data source above.
        ══════════════════════════════════════════════════════════════════ */}
        <section id="how" className="order-3 scroll-mt-24 border-t border-white/10 bg-black/16 px-6 py-16 backdrop-blur-[1px] sm:py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12 lg:mb-16">
              <span className="text-[13px] sm:text-sm lg:text-[15px] font-bold tracking-widest uppercase mb-3 block" style={{ color: "#ff7088" }}>
                مراحل درخواست سرویس
              </span>
              <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
                فقط سه قدم تا رسیدن متخصص
              </h2>
              <p className="max-w-xl mx-auto text-white/65 leading-relaxed text-[15px] sm:text-base lg:text-lg">
                درخواستت را ثبت کن، موقعیتت را بفرست و منتظر رسیدن نزدیک‌ترین متخصص باش.
              </p>
            </div>

            {/* ── Desktop: connected horizontal timeline ── */}
            <ol className="hidden lg:grid grid-cols-3 gap-6 relative mb-14">
              <li
                className="absolute top-8 h-px pointer-events-none"
                style={{
                  left: "16.6667%",
                  right: "16.6667%",
                  background: "linear-gradient(90deg, rgba(232,0,42,0) 0%, rgba(232,0,42,0.35) 15%, rgba(232,0,42,0.35) 85%, rgba(232,0,42,0) 100%)",
                }}
                aria-hidden="true"
              />
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.num}
                    className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center transition-colors duration-300 hover:border-brand-500/30 hover:shadow-[0_8px_28px_rgba(232,0,42,0.12)]"
                  >
                    <div className="relative mx-auto mb-5 w-16 h-16 rounded-2xl border border-brand-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(232,0,42,0.15)]" style={{ background: "#0a0d2e" }}>
                      <Icon size={26} className="text-brand-300"/>
                      <span className="absolute -top-2.5 -right-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white text-[11px] font-black">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-black text-white mb-2 text-[20px] xl:text-[22px] leading-snug">{step.title}</h3>
                    <p className="text-[15px] xl:text-base text-white/65 leading-relaxed">{step.desc}</p>
                  </li>
                );
              })}
            </ol>

            {/* ── Mobile/tablet: connected vertical timeline ── */}
            <ol className="lg:hidden flex flex-col mb-10">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === STEPS.length - 1;
                return (
                  <li key={step.num} className="relative flex gap-4 pb-8 last:pb-0 text-right">
                    {!isLast && (
                      <span
                        className="absolute top-14 bottom-0 w-px"
                        style={{ right: "27px", background: "linear-gradient(180deg, rgba(232,0,42,0.35), rgba(232,0,42,0.05))" }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative shrink-0 w-14 h-14 rounded-2xl border border-brand-500/40 flex items-center justify-center" style={{ background: "#0a0d2e" }}>
                      <Icon size={22} className="text-brand-300"/>
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] font-black">
                        {step.num}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-black text-white mb-1.5 text-[18px] sm:text-xl leading-snug">{step.title}</h3>
                      <p className="text-sm sm:text-[15px] text-white/65 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="text-center">
              <Link href="/request" className="btn-primary text-base sm:text-[17px] py-3.5 sm:py-4 px-8 sm:px-10 rounded-2xl w-full sm:w-auto">
                <ZapIcon size={17}/> همین حالا درخواست بده
              </Link>
            </div>
          </div>
        </section>

        {/* ══ CTA BAND ════════════════════════════════════════════════════ */}
        <section className="relative order-4 overflow-hidden bg-black/18 px-6 py-20 backdrop-blur-[1px]">
          {/* Geometric accent shapes */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
            <div className="absolute rounded-full"
              style={{ width: "320px", height: "320px", background: "#c40028", opacity: 0.18, top: "-80px", left: "-60px" }}/>
            <div className="absolute rounded-full"
              style={{ width: "240px", height: "240px", background: "#c40028", opacity: 0.12, bottom: "-60px", right: "-40px" }}/>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)" }}>
              آماده کمک هستیم
            </h2>
            <p className="mb-10 leading-relaxed" style={{ fontSize: "clamp(1.125rem,2.5vw,1.375rem)", color: "rgba(255,255,255,0.72)" }}>
              ۲۴ ساعته در شیراز · پاسخ در کمتر از ۳۰ دقیقه · بدون معطلی
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request"
                className="flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl text-[17px] transition-all hover:-translate-y-0.5 duration-200 shadow-[0_8px_28px_rgba(232,0,42,0.4)]"
                style={{ background: "#e8002a" }}>
                <ZapIcon size={17}/> درخواست فوری
              </Link>
              <a href="tel:+98"
                className="flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-xl text-[17px] hover:bg-white/10 transition-colors"
                style={{ border: "2px solid rgba(255,255,255,0.25)" }}>
                <PhoneIcon size={17}/> تماس مستقیم
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
