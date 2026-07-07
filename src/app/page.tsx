import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  WrenchIcon, BatteryIcon, TowTruckIcon, OilDropIcon,
  ZapIcon, ClockIcon, LocationIcon, CheckIcon, PhoneIcon,
} from "@/components/ui/Icons";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const SERVICES = [
  { icon: WrenchIcon,   title: "مکانیک سیار",  desc: "تشخیص و رفع خرابی خودرو در محل بدون نیاز به حمل.", blob: "#fee2e2", bg: "#e8002a", tag: "پرطرفدار" },
  { icon: BatteryIcon,  title: "تعویض باتری",  desc: "ارائه و نصب باتری مناسب در کوتاه‌ترین زمان ممکن.",  blob: "#e0e7ff", bg: "#6366f1", tag: null },
  { icon: TowTruckIcon, title: "یدک‌کش",        desc: "انتقال امن خودرو به تعمیرگاه یا مقصد دلخواه.",     blob: "#FEF9C3", bg: "#f59e0b", tag: null },
  { icon: OilDropIcon,  title: "تعویض روغن",   desc: "روغن‌موتور اورجینال، تعویض در محل بدون اتلاف وقت.", blob: "#DCFCE7", bg: "#10b981", tag: null },
];

const STEPS = [
  { icon: ZapIcon,      num: "۰۱", title: "درخواست ثبت کن",  desc: "نوع سرویس رو انتخاب و اطلاعات رو وارد کن — فقط ۳۰ ثانیه." },
  { icon: LocationIcon, num: "۰۲", title: "موقعیت بفرست",    desc: "GPS مرورگر لوکیشن دقیقت رو با یک لمس ثبت می‌کنه." },
  { icon: ClockIcon,    num: "۰۳", title: "متخصص می‌آید",    desc: "نزدیک‌ترین نیرو ظرف کمتر از ۳۰ دقیقه پیشت هست." },
];

const STATS = [
  { v: "+۵۰۰",    l: "سرویس موفق" },
  { v: "۲۸ دقیقه", l: "میانگین پاسخ" },
  { v: "+۲۰",     l: "متخصص فعال" },
  { v: "۲۴/۷",    l: "پشتیبانی" },
];

/* Clickable hotspots overlaid on the services showcase image — positions are
   percentages matched to each badge's center in landing-hero-car.png.
   Hrefs are placeholders until each service gets its own destination. */
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
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden flex flex-col" style={{ background: "#0d1035" }}>
        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col lg:flex-row">

          {/* ── LEFT panel: text content ── */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-24 lg:py-0 w-full lg:w-[46%] text-right order-2 lg:order-1">

            <p className="anim-fadeup text-white/50 text-[13px] font-bold tracking-[.16em] uppercase mb-6">
              خدمات سیار خودرو · شیراز
            </p>

            <h1 className="anim-fadeup delay-1 font-black text-white leading-[1.1] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
              خدمات سیار<br/>
              <span style={{ color: "#e8002a" }}>خودرو</span><br/>
              در محل شما
            </h1>

            <p className="anim-fadeup delay-2 text-white/60 leading-loose mb-8 max-w-md text-right text-[17px]">
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
              {["بدون ثبت‌نام", "پرداخت در محل", "متخصص تأیید‌شده", "ضمانت کیفیت"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-white/55 text-[13px]">
                  <CheckIcon size={13} className="shrink-0 text-[#e8002a]"/>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT panel: brand logo artwork ── */}
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
      </section>

      <main>

        {/* ══ STATS BAR ════════════════════════════════════════════════════ */}
        <section style={{ background: "#080d38" }}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.l} className={`text-center py-7 px-4 ${i % 2 === 0 && i < 2 ? "border-b md:border-b-0 border-white/10" : ""} ${i < 3 ? "md:border-l border-white/10" : ""}`}>
                <p className="font-black text-white mb-1" style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)" }}>{s.v}</p>
                <p className="text-[13px] text-white/35">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SERVICES ════════════════════════════════════════════════════ */}
        <section id="services" className="py-16 px-6 overflow-hidden" style={{ background: "#0a0d2e" }}>
          <div className="max-w-6xl mx-auto">
            <span className="section-eyebrow" style={{ color: "#ff7088" }}>خدماتی که ارائه می‌دهیم</span>
            <h2 className="section-title" style={{ color: "white" }}>چه کمکی می‌تونیم بکنیم؟</h2>

            {/* ── Provided services showcase image ── */}
            <div className="mt-8">
              <div className="relative mx-auto max-w-5xl rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] bg-[#070b24]">
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
                    className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_0_4px_var(--glow),0_0_30px_10px_var(--glow)]"
                    style={{ left: `${h.x}%`, top: `${h.y}%`, width: "12.5%", aspectRatio: "1 / 1", ["--glow" as string]: `${h.color}88` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
        <section id="how" className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto">
            <span className="section-eyebrow">روش کار ما</span>
            <h2 className="section-title">در سه قدم ساده</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="bg-white border border-slate-200 rounded-3xl p-7 text-center shadow-sm hover:shadow-[0_8px_28px_rgba(232,0,42,.12)] hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[12px] font-black text-brand-300 tracking-widest block mb-4">{step.num}</span>
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5">
                      <Icon size={22} className="text-brand-600"/>
                    </div>
                    <h3 className="font-black text-slate-900 mb-3 text-[34px] leading-snug">{step.title}</h3>
                    <p className="text-2xl text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/request" className="btn-primary text-[17px] py-4 px-10 rounded-2xl">
                <ZapIcon size={17}/> همین الان شروع کن
              </Link>
            </div>
          </div>
        </section>

        {/* ══ CTA BAND ════════════════════════════════════════════════════ */}
        <section className="relative py-20 px-6 overflow-hidden" style={{ background: "#0d1035" }}>
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
            <p className="mb-10 leading-relaxed" style={{ fontSize: "clamp(.875rem,2vw,1rem)", color: "rgba(255,255,255,0.6)" }}>
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
