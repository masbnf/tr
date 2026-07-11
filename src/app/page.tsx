import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

/* Clickable hotspots overlaid on the services showcase image — positions are
   percentages matched to each badge's center in landing-hero-car.png.
   Hrefs are placeholders until each service gets its own destination.
   This is the single source of truth for the service list: both the image
   hotspots and the mobile-friendly chip grid below render from this array. */
const SERVICE_HOTSPOTS = [
  { label: "تعمیر موتور", href: "/request?service=engine-repair", x: 50.1, y: 16.3, color: "#ef4444" },
  { label: "تایر",        href: "/request?service=tire",          x: 72.4, y: 22.6, color: "#a855f7" },
  { label: "کارواش",      href: "/request?service=car-wash",      x: 86.8, y: 38.1, color: "#22d3ee" },
  { label: "برق‌کشی",     href: "/request?service=electrical",    x: 88.4, y: 61.0, color: "#eab308" },
  { label: "چراغ‌ها",     href: "/request?service=lights",        x: 74.2, y: 74.8, color: "#f97316" },
  { label: "لنت ترمز",    href: "/request?service=brake-pads",    x: 50.1, y: 82.4, color: "#ef4444" },
  { label: "بنزین",       href: "/request?service=fuel-delivery", x: 26.2, y: 74.8, color: "#10b981" },
  { label: "باتری",       href: "/request?service=battery",       x: 11.8, y: 61.0, color: "#6366f1" },
  { label: "رنگ خودرو",   href: "/request?service=paint",         x: 13.4, y: 38.1, color: "#ec4899" },
  { label: "تعویض روغن",  href: "/request?service=oil-change",    x: 27.8, y: 22.6, color: "#84cc16" },
];

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
      <section className="relative overflow-hidden flex flex-col lg:min-h-screen" style={{ background: "#0d1035" }}>
        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col">

          {/* ── Mobile hero: text-first, no image ── */}
          <div className="lg:hidden flex flex-col px-6 sm:px-8 pt-28 text-right">

            <p className="anim-fadeup text-white/70 text-sm font-bold tracking-[.1em] mb-3">
              خدمات سیار خودرو در شیراز
            </p>

            <h1 className="anim-fadeup delay-1 font-black text-white leading-[1.15] mb-4 text-4xl sm:text-[40px]">
              خدمات خودرو، <span style={{ color: "#ff6b82" }}>سریع</span> در محل شما
            </h1>

            <p className="anim-fadeup delay-2 text-white/80 mb-6 max-w-md text-base sm:text-lg" style={{ lineHeight: 1.9 }}>
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
                <div key={f} className="flex items-center gap-1.5 text-white/75 text-sm font-semibold">
                  <CheckIcon size={14} className="shrink-0 text-[#ff7088]"/>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* ── Desktop hero: original two-column layout (unchanged) ── */}
          <div className="hidden lg:flex flex-1 lg:flex-row">

            {/* LEFT panel: text content */}
            <div className="flex flex-col justify-center px-8 lg:px-16 py-24 lg:py-0 w-full lg:w-[46%] text-right order-2 lg:order-1">

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

            {/* RIGHT panel: brand logo artwork */}
            <div className="w-full lg:w-[54%] order-1 lg:order-2 flex items-center justify-center min-h-[380px] lg:min-h-0 anim-fadein relative overflow-hidden px-4 sm:px-8 py-8 lg:py-12">
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
            </div>
          </div>
        </div>
      </section>

      {/* Sections below are reordered on mobile (services first) via flex
          `order` utilities — no markup or assets are duplicated. Desktop
          keeps the original stats → services → how → cta order. */}
      <main className="flex flex-col">

        {/* ══ STATS BAR ════════════════════════════════════════════════════ */}
        <section className="order-2 lg:order-1" style={{ background: "#080d38" }}>
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
        <section id="services" className="order-1 lg:order-2 scroll-mt-24 pt-8 lg:pt-16 pb-16 px-3 sm:px-6" style={{ background: "#0a0d2e" }}>
          <div className="max-w-6xl mx-auto">
            {/* Heading is part of the desktop "چه کمکی می‌تونیم بکنیم؟" section
                intro; the mobile hero already introduces the service, so the
                heading is hidden on mobile to keep the circular image as the
                first thing seen after the hero CTAs. */}
            <div className="hidden lg:block">
              <span className="section-eyebrow" style={{ color: "#ff7088" }}>خدماتی که ارائه می‌دهیم</span>
              <h2 className="section-title" style={{ color: "white" }}>چه کمکی می‌تونیم بکنیم؟</h2>
            </div>

            {/* ── Provided services showcase image with clickable hotspots ──
                Frosted-glass frame (translucent + backdrop-blur + edge sheen)
                with a faded mirror-reflection strip beneath, so the tile
                reads as glass resting on a glossy floor rather than a flat
                opaque panel. */}
            <div className="lg:mt-8">
              <div className="relative mx-auto max-w-5xl">
                {/* Ambient floor glow under the glass */}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-2/3 h-10 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(232,0,42,0.35), transparent 70%)" }}
                  aria-hidden="true" />

                {/* Glass frame */}
                <div className="relative rounded-[2rem] p-2 sm:p-2.5 backdrop-blur-xl bg-white/[0.06] border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                  <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 42%)" }}
                    aria-hidden="true" />

                  <div className="relative rounded-[1.6rem] overflow-hidden bg-[#070b24]">
                    <Image
                      src="/images/landing-hero-car.png"
                      alt="نمایش خدمات خودرو مکانیکا"
                      width={1254}
                      height={1254}
                      className="w-full h-auto object-contain"
                    />
                    {SERVICE_HOTSPOTS.map((h) => (
                      <Link
                        key={h.label}
                        href={h.href}
                        title={h.label}
                        aria-label={h.label}
                        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_0_4px_var(--glow),0_0_30px_10px_var(--glow)] focus-visible:scale-110 focus-visible:shadow-[0_0_0_4px_var(--glow),0_0_30px_10px_var(--glow)]"
                        style={{
                          left: `${h.x}%`,
                          top: `${h.y}%`,
                          width: "clamp(44px, 12.5%, 76px)",
                          aspectRatio: "1 / 1",
                          ["--glow" as string]: `${h.color}88`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mirror reflection — faded, flipped duplicate resting under the glass */}
                <div className="relative h-16 sm:h-24 lg:h-32 overflow-hidden opacity-25 pointer-events-none select-none"
                  style={{
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
                  }}
                  aria-hidden="true">
                  <Image
                    src="/images/landing-hero-car.png"
                    alt=""
                    width={1254}
                    height={1254}
                    className="w-full h-auto object-contain scale-y-[-1]"
                  />
                </div>
              </div>

              {/* Service chip grid — mirrors the hotspots above so every
                  destination stays reachable & discoverable without relying
                  on hovering/tapping invisible hotspots. Reuses the same
                  SERVICE_HOTSPOTS data (no duplicated service list). */}
              <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-4xl mx-auto" role="list">
                {SERVICE_HOTSPOTS.map((h) => (
                  <li key={h.label}>
                    <Link
                      href={h.href}
                      title={h.label}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 min-h-[44px] text-[13px] sm:text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white active:bg-white/15 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: h.color }} aria-hidden="true" />
                      {h.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════
            Dark navy continuation of the hero/services brand — connected
            process timeline (horizontal on desktop, vertical on mobile),
            both rendered from the shared STEPS data source above.
        ══════════════════════════════════════════════════════════════════ */}
        <section id="how" className="order-3 scroll-mt-24 py-16 sm:py-20 lg:py-28 px-6 border-t border-white/5" style={{ background: "#080d38" }}>
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
        <section className="order-4 relative py-20 px-6 overflow-hidden" style={{ background: "#0d1035" }}>
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
