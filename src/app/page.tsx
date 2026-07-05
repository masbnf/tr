import Link from "next/link";
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

            <p className="anim-fadeup text-white/50 text-[11px] font-bold tracking-[.16em] uppercase mb-6">
              خدمات سیار خودرو · شیراز
            </p>

            <h1 className="anim-fadeup delay-1 font-black text-white leading-[1.1] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
              خدمات سیار<br/>
              <span style={{ color: "#e8002a" }}>خودرو</span><br/>
              در محل شما
            </h1>

            <p className="anim-fadeup delay-2 text-white/60 leading-loose mb-8 max-w-md text-right text-[15px]">
              مکانیک، باتری، یدک‌کش و تعویض روغن — سریع، مطمئن،
              در کمتر از ۳۰ دقیقه در شیراز.
            </p>

            {/* CTA buttons */}
            <div className="anim-fadeup delay-3 flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
              <Link href="/request"
                className="flex items-center justify-center gap-2 font-black px-8 py-4 rounded-xl text-[15px] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(232,0,42,0.4)]"
                style={{ background: "#e8002a", color: "#fff" }}>
                <ZapIcon size={17}/>
                درخواست سرویس
              </Link>
              <a href="tel:+98"
                className="flex items-center justify-center gap-2 border-2 text-white font-bold px-6 py-4 rounded-xl text-[15px] hover:bg-white/10 transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}>
                <PhoneIcon size={17}/>
                تماس مستقیم
              </a>
            </div>

            {/* Trust badges */}
            <div className="anim-fadeup delay-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {["بدون ثبت‌نام", "پرداخت در محل", "متخصص تأیید‌شده", "ضمانت کیفیت"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-white/55 text-[13px]">
                  <CheckIcon size={13} className="shrink-0" style={{ color: "#e8002a" }}/>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT panel: circular orbital icons ── */}
          <div className="w-full lg:w-[54%] order-1 lg:order-2 flex items-center justify-center min-h-[380px] lg:min-h-0 anim-fadein relative overflow-hidden">
            <svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full" style={{ maxHeight: "100vh" }}>

              {/* ── Decorative concentric dot rings (3 rings, varying size) ── */}
              {/* Ring 1 — outermost, tiny dots */}
              {Array.from({ length: 72 }).map((_, i) => {
                const a = (i * (360 / 72)) * Math.PI / 180;
                return <circle key={`r1-${i}`} cx={290 + 268 * Math.cos(a)} cy={290 + 268 * Math.sin(a)} r={2} fill="rgba(255,255,255,0.14)"/>;
              })}
              {/* Ring 2 — medium dots */}
              {Array.from({ length: 56 }).map((_, i) => {
                const a = (i * (360 / 56) + 3.2) * Math.PI / 180;
                return <circle key={`r2-${i}`} cx={290 + 250 * Math.cos(a)} cy={290 + 250 * Math.sin(a)} r={3.2} fill="rgba(255,255,255,0.16)"/>;
              })}
              {/* Ring 3 — innermost, larger dots */}
              {Array.from({ length: 40 }).map((_, i) => {
                const a = (i * (360 / 40) + 7) * Math.PI / 180;
                return <circle key={`r3-${i}`} cx={290 + 232 * Math.cos(a)} cy={290 + 232 * Math.sin(a)} r={4.5} fill="rgba(255,255,255,0.12)"/>;
              })}

              {/* ── Outer dashed orbit ring — red left half, blue right half ── */}
              <path d="M 290 95 A 195 195 0 0 0 290 485" fill="none" stroke="#e8002a" strokeWidth="1.5" strokeDasharray="6,7" opacity="0.55"/>
              <path d="M 290 95 A 195 195 0 0 1 290 485" fill="none" stroke="#2f6fff" strokeWidth="1.5" strokeDasharray="6,7" opacity="0.55"/>

              {/* ══════════════════════════════════
                  CENTER LOGO AREA
                  Black circle + sleek car silhouette
                  + مکانیکا brand text below
                  ══════════════════════════════════ */}

              {/* Outer glow halo */}
              <circle cx="290" cy="290" r="126" fill="rgba(232,0,42,0.05)"/>
              {/* Split border ring — red left half, blue right half */}
              <path d="M 290 170 A 120 120 0 0 0 290 410" fill="none" stroke="#e8002a" strokeWidth="2.5" opacity="0.9"/>
              <path d="M 290 170 A 120 120 0 0 1 290 410" fill="none" stroke="#2f6fff" strokeWidth="2.5" opacity="0.9"/>
              {/* Black logo background */}
              <circle cx="290" cy="290" r="115" fill="#06080f"/>

              {/* ── Sleek supercar silhouette (nose right, rear left) ── */}
              <g transform="translate(277,252) scale(1.17)">
                {/* Main body outline — angular panel lines, rear to nose */}
                <path
                  d="M -58 13
                     L -58 5
                     L -50 -3
                     L -38 -4
                     L -24 -19
                     L 0 -20
                     L 14 -19
                     L 34 -10
                     L 60 -4
                     L 74 3
                     L 80 8
                     L 80 12"
                  fill="none" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Cabin / window */}
                <path d="M -34 -5 L -22 -17 L 0 -18 L 12 -17 L 26 -10 L 18 -6 L -4 -7 L -22 -5.5 Z"
                  fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.6" strokeLinejoin="round"/>
                {/* Shoulder / character line */}
                <path d="M -54 4 L -30 0 L 10 -1 L 40 -5 L 58 -3"
                  fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Side vent (rear quarter) */}
                <path d="M -26 2 L -14 0 M -25 5.5 L -13 3.5" stroke="white" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round"/>
                {/* Mirror */}
                <path d="M 4 -13 C 7 -15.5 11 -15.5 13 -13.5 L 14 -11 L 5 -10.5 Z" fill="none" stroke="white" strokeWidth="1.1" strokeOpacity="0.55"/>
                {/* Sill between wheel arches */}
                <path d="M -58 13 L -46 13 M -26 13 L 68 13" stroke="white" strokeWidth="2.1" strokeLinecap="round"/>
                {/* Wheels */}
                <circle cx="-36" cy="13" r="12.5" fill="#06080f" stroke="white" strokeWidth="2.1"/>
                <circle cx="-36" cy="13" r="5" fill="none" stroke="white" strokeWidth="1.2"/>
                <circle cx="55" cy="13" r="12.5" fill="#06080f" stroke="white" strokeWidth="2.1"/>
                <circle cx="55" cy="13" r="5" fill="none" stroke="white" strokeWidth="1.2"/>
                {/* Headlight + taillight accents */}
                <path d="M 72 4.5 L 76 6.5" stroke="#2f6fff" strokeWidth="2" strokeLinecap="round"/>
                <path d="M -57 6 L -57 10" stroke="#e8002a" strokeWidth="2" strokeLinecap="round"/>
              </g>

              {/* ── Brand name ── */}
              <text x="290" y="322"
                textAnchor="middle"
                fill="white" fontSize="26" fontWeight="900"
                fontFamily="Vazirmatn,system-ui,sans-serif"
                letterSpacing="-0.3">
                مکانیکا
              </text>
              {/* Underline accent */}
              <line x1="244" y1="330" x2="336" y2="330"
                stroke="#e8002a" strokeWidth="1.5" strokeOpacity="0.7"/>
              {/* Tagline */}
              <text x="290" y="346"
                textAnchor="middle"
                fill="rgba(255,255,255,0.32)" fontSize="9.5"
                fontFamily="Vazirmatn,system-ui,sans-serif">
                خدمات سیار خودرو · شیراز
              </text>

              {/* ── 8 Service badges in orbit at r=195 — bordered tiles + labels ── */}
              {/* Starting from top (270°), clockwise every 45°. Left half = red border, right half = blue. */}

              {/* 0: 270° TOP — مکانیک سیار (red) */}
              <g transform={`translate(${290 + 195 * Math.cos(270 * Math.PI / 180)},${290 + 195 * Math.sin(270 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#e8002a" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                    stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">مکانیک سیار</text>
              </g>

              {/* 1: 315° TOP-RIGHT — باتری (blue) */}
              <g transform={`translate(${290 + 195 * Math.cos(315 * Math.PI / 180)},${290 + 195 * Math.sin(315 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#2f6fff" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <rect x="2" y="7" width="16" height="10" rx="2" stroke="white" strokeWidth="1.8" fill="none"/>
                  <path d="M22 11v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <path d="M7 11l2 2-2 2M11 11h3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">باتری</text>
              </g>

              {/* 2: 0° RIGHT — برق‌کشی (blue) */}
              <g transform={`translate(${290 + 195 * Math.cos(0 * Math.PI / 180)},${290 + 195 * Math.sin(0 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#2f6fff" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                    stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">برق‌کشی</text>
              </g>

              {/* 3: 45° BOTTOM-RIGHT — یدک‌کش (blue) */}
              <g transform={`translate(${290 + 195 * Math.cos(45 * Math.PI / 180)},${290 + 195 * Math.sin(45 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#2f6fff" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v2" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="17" r="2" stroke="white" strokeWidth="1.8" fill="none"/>
                  <circle cx="17" cy="17" r="2" stroke="white" strokeWidth="1.8" fill="none"/>
                  <path d="M14 17h-5M21 17h-2M15 7h5l2 4H15V7z" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">یدک‌کش</text>
              </g>

              {/* 4: 90° BOTTOM — تعویض روغن (blue) */}
              <g transform={`translate(${290 + 195 * Math.cos(90 * Math.PI / 180)},${290 + 195 * Math.sin(90 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#2f6fff" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <path d="M12 2C6.48 2 2 8 2 13a10 10 0 0 0 20 0c0-5-4.48-11-10-11z"
                    stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 14a4.5 4.5 0 0 0 9 0" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">تعویض روغن</text>
              </g>

              {/* 5: 135° BOTTOM-LEFT — موقعیت (red) */}
              <g transform={`translate(${290 + 195 * Math.cos(135 * Math.PI / 180)},${290 + 195 * Math.sin(135 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#e8002a" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.8" fill="none"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">موقعیت</text>
              </g>

              {/* 6: 180° LEFT — تماس (red) */}
              <g transform={`translate(${290 + 195 * Math.cos(180 * Math.PI / 180)},${290 + 195 * Math.sin(180 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#e8002a" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">تماس</text>
              </g>

              {/* 7: 225° TOP-LEFT — ساعت / پاسخ سریع (red) */}
              <g transform={`translate(${290 + 195 * Math.cos(225 * Math.PI / 180)},${290 + 195 * Math.sin(225 * Math.PI / 180)})`}>
                <rect x="-31" y="-31" width="62" height="62" rx="15" fill="#06080f" stroke="#e8002a" strokeWidth="1.8" strokeOpacity="0.85"/>
                <g transform="translate(-13,-13) scale(1.08)">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" fill="none"/>
                  <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </g>
                <text x="0" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Vazirmatn,system-ui,sans-serif">پاسخ سریع</text>
              </g>

            </svg>
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
                <p className="text-[11px] text-white/35">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SERVICES ════════════════════════════════════════════════════ */}
        <section id="services" className="py-16 px-6 overflow-hidden" style={{ background: "#0a0d2e" }}>
          <div className="max-w-6xl mx-auto">
            <span className="section-eyebrow" style={{ color: "#ff7088" }}>خدماتی که ارائه می‌دهیم</span>
            <h2 className="section-title" style={{ color: "white" }}>چه کمکی می‌تونیم بکنیم؟</h2>

            {/* ── Desktop: car infographic SVG ── */}
            <div className="hidden sm:block" style={{ width: "130%", marginLeft: "-15%", marginRight: "-15%" }}>
              <svg viewBox="0 0 1100 620" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-label="خدمات مکانیکا">
                <defs>
                  <filter id="bs" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="5" stdDeviation="12" floodColor="rgba(0,0,0,0.10)"/>
                  </filter>
                  <filter id="bs-hover" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="rgba(0,0,0,0.22)"/>
                  </filter>
                  <style>{`
                    .svc-badge { cursor: pointer; transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), filter 0.25s ease; transform-box: fill-box; transform-origin: center; }
                    .svc-badge:hover { transform: scale(1.18); filter: drop-shadow(0 8px 22px rgba(0,0,0,0.26)); }
                    .svc-badge:hover .badge-ring { stroke-width: 3.5; }
                  `}</style>
                </defs>

                {/* ══════════════════════════════════
                    SLEEK CAR SILHOUETTE
                    Same mark used in the hero, scaled up
                    ══════════════════════════════════ */}
                {/* Subtle glow behind logo */}
                <ellipse cx="560" cy="345" rx="210" ry="100" fill="rgba(232,0,42,0.05)"/>

                <g transform="translate(534,353) scale(2.4)">
                  {/* Main body outline — angular panel lines, rear to nose */}
                  <path
                    d="M -58 13
                       L -58 5
                       L -50 -3
                       L -38 -4
                       L -24 -19
                       L 0 -20
                       L 14 -19
                       L 34 -10
                       L 60 -4
                       L 74 3
                       L 80 8
                       L 80 12"
                    fill="none" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Cabin / window */}
                  <path d="M -34 -5 L -22 -17 L 0 -18 L 12 -17 L 26 -10 L 18 -6 L -4 -7 L -22 -5.5 Z"
                    fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.6" strokeLinejoin="round"/>
                  {/* Shoulder / character line */}
                  <path d="M -54 4 L -30 0 L 10 -1 L 40 -5 L 58 -3"
                    fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Side vent (rear quarter) */}
                  <path d="M -26 2 L -14 0 M -25 5.5 L -13 3.5" stroke="white" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round"/>
                  {/* Mirror */}
                  <path d="M 4 -13 C 7 -15.5 11 -15.5 13 -13.5 L 14 -11 L 5 -10.5 Z" fill="none" stroke="white" strokeWidth="1.1" strokeOpacity="0.55"/>
                  {/* Sill between wheel arches */}
                  <path d="M -58 13 L -46 13 M -26 13 L 68 13" stroke="white" strokeWidth="2.1" strokeLinecap="round"/>
                  {/* Wheels */}
                  <circle cx="-36" cy="13" r="12.5" fill="#0a0d2e" stroke="white" strokeWidth="2.1"/>
                  <circle cx="-36" cy="13" r="5" fill="none" stroke="white" strokeWidth="1.2"/>
                  <circle cx="55" cy="13" r="12.5" fill="#0a0d2e" stroke="white" strokeWidth="2.1"/>
                  <circle cx="55" cy="13" r="5" fill="none" stroke="white" strokeWidth="1.2"/>
                  {/* Headlight + taillight accents */}
                  <path d="M 72 4.5 L 76 6.5" stroke="#2f6fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M -57 6 L -57 10" stroke="#e8002a" strokeWidth="2" strokeLinecap="round"/>
                </g>

                {/* ══════════════════════════════════
                    10 SERVICE BADGES in ellipse
                    center=(550,310), rx=390, ry=205
                    badges at 36° steps from 270°
                    ══════════════════════════════════ */}

                {/* ── DASHED CONNECTOR LINES — endpoints mapped to car+wrench logo ── */}
                {/* scale 1.4, logo origin (148,62), SVG center (550,310) */}
                {/* 1: تعمیر موتور (550,105) → roof */}
                <line x1="550" y1="147" x2="536" y2="234" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 2: تایر (779,144) → front upper roofline */}
                <line x1="779" y1="186" x2="614" y2="254" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 3: کارواش (921,247) → jaw upper prong */}
                <line x1="879" y1="247" x2="715" y2="282" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 4: برق‌کشی (921,373) → jaw lower prong */}
                <line x1="879" y1="373" x2="715" y2="394" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 5: چراغ‌ها (779,476) → handle right end */}
                <line x1="770" y1="440" x2="690" y2="355" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 6: لنت ترمز (550,515) → handle center bottom */}
                <line x1="550" y1="473" x2="550" y2="355" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 7: بنزین (321,476) → socket bottom */}
                <line x1="338" y1="440" x2="413" y2="404" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 8: باتری (179,373) → socket left */}
                <line x1="221" y1="373" x2="347" y2="338" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 9: رنگ خودرو (179,247) → socket upper-left */}
                <line x1="221" y1="262" x2="364" y2="276" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>
                {/* 10: تعویض روغن (321,144) → cabin/rear roof */}
                <line x1="342" y1="186" x2="468" y2="248" stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" strokeDasharray="7,5"/>

                {/* Connection dots on logo */}
                <circle cx="536" cy="234" r="5" fill="white" stroke="#e8002a" strokeWidth="2"/>
                <circle cx="614" cy="254" r="5" fill="white" stroke="#8b5cf6" strokeWidth="2"/>
                <circle cx="715" cy="282" r="5" fill="white" stroke="#06b6d4" strokeWidth="2"/>
                <circle cx="715" cy="394" r="5" fill="white" stroke="#eab308" strokeWidth="2"/>
                <circle cx="690" cy="355" r="5" fill="white" stroke="#f59e0b" strokeWidth="2"/>
                <circle cx="550" cy="355" r="5" fill="white" stroke="#ef4444" strokeWidth="2"/>
                <circle cx="413" cy="404" r="5" fill="white" stroke="#10b981" strokeWidth="2"/>
                <circle cx="347" cy="338" r="5" fill="white" stroke="#6366f1" strokeWidth="2"/>
                <circle cx="364" cy="276" r="5" fill="white" stroke="#ec4899" strokeWidth="2"/>
                <circle cx="468" cy="248" r="5" fill="white" stroke="#84cc16" strokeWidth="2"/>

                {/* ══ BADGE 1: تعمیر موتور (550,105) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="550" cy="105" r="42" fill="white" stroke="#e8002a" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(550,105) scale(1.65) translate(-12,-12)">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                        stroke="#e8002a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </g>
                  <text x="550" y="160" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">تعمیر موتور</text>
                </g>

                {/* ══ BADGE 2: تایر (779,144) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="779" cy="144" r="42" fill="white" stroke="#8b5cf6" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(779,144) scale(1.65) translate(-12,-12)">
                      <circle cx="12" cy="12" r="9" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
                      <circle cx="12" cy="12" r="4" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
                      {[0,90,180,270].map((d,i)=>{ const rr=(d*Math.PI)/180; return <line key={i} x1={12+Math.cos(rr)*4} y1={12+Math.sin(rr)*4} x2={12+Math.cos(rr)*9} y2={12+Math.sin(rr)*9} stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>; })}
                    </g>
                  </g>
                  <text x="779" y="199" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">تایر</text>
                </g>

                {/* ══ BADGE 3: کارواش (921,247) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="921" cy="247" r="42" fill="white" stroke="#06b6d4" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(921,247) scale(1.65) translate(-12,-12)">
                      <path d="M12 2C9 6 5 10 5 14a7 7 0 0 0 14 0c0-4-4-8-7-12z"
                        stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 20l1.5-1.5M11 22l1-1.5M14 22l-1-1.5M17 20l-1.5-1.5"
                        stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
                    </g>
                  </g>
                  <text x="921" y="302" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">کارواش</text>
                </g>

                {/* ══ BADGE 4: برق‌کشی (921,373) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="921" cy="373" r="42" fill="white" stroke="#eab308" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(921,373) scale(1.65) translate(-12,-12)">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                        stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </g>
                  <text x="921" y="428" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">برق‌کشی</text>
                </g>

                {/* ══ BADGE 5: چراغ‌ها (779,476) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="779" cy="476" r="42" fill="white" stroke="#f59e0b" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(779,476) scale(1.65) translate(-12,-12)">
                      <circle cx="12" cy="12" r="4" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                        stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                    </g>
                  </g>
                  <text x="779" y="531" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">چراغ‌ها</text>
                </g>

                {/* ══ BADGE 6: لنت ترمز (550,515) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="550" cy="515" r="42" fill="white" stroke="#ef4444" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(550,515) scale(1.65) translate(-12,-12)">
                      <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="1.5" fill="none"/>
                      <circle cx="12" cy="12" r="4" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
                      <path d="M12 3 A9 9 0 0 1 20.2 16.5" stroke="#ef4444" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                    </g>
                  </g>
                  <text x="550" y="570" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">لنت ترمز</text>
                </g>

                {/* ══ BADGE 7: بنزین (321,476) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="321" cy="476" r="42" fill="white" stroke="#10b981" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(321,476) scale(1.65) translate(-12,-12)">
                      <path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"
                        stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 22h11M6 9h5" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <path d="M17 8l2-2 2 2v7a1 1 0 0 1-2 0v-2a1 1 0 0 0-2 0v2a1 1 0 0 1-2 0V8z"
                        stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </g>
                  <text x="321" y="531" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">بنزین</text>
                </g>

                {/* ══ BADGE 8: باتری (179,373) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="179" cy="373" r="42" fill="white" stroke="#6366f1" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(179,373) scale(1.65) translate(-12,-12)">
                      <rect x="2" y="7" width="16" height="10" rx="2" stroke="#6366f1" strokeWidth="1.5" fill="none"/>
                      <path d="M22 11v2" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      <path d="M7 11l2 2-2 2M11 11h3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </g>
                  </g>
                  <text x="179" y="428" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">باتری</text>
                </g>

                {/* ══ BADGE 9: رنگ خودرو (179,247) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="179" cy="247" r="42" fill="white" stroke="#ec4899" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(179,247) scale(1.65) translate(-12,-12)">
                      <rect x="5" y="3" width="8" height="3" rx="1" fill="none" stroke="#ec4899" strokeWidth="1.5"/>
                      <path d="M4 6h10v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"
                        fill="none" stroke="#ec4899" strokeWidth="1.5"/>
                      <path d="M14 8l3-2" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="17.5" cy="5.5" r="1.5" fill="#ec4899"/>
                      <circle cx="19.5" cy="8" r="1" fill="#ec4899" opacity="0.6"/>
                      <circle cx="18.5" cy="3.5" r="1" fill="#ec4899" opacity="0.6"/>
                    </g>
                  </g>
                  <text x="179" y="302" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">رنگ خودرو</text>
                </g>

                {/* ══ BADGE 10: تعویض روغن (321,144) ══ */}
                <g className="svc-badge">
                  <g filter="url(#bs)">
                    <circle cx="321" cy="144" r="42" fill="white" stroke="#84cc16" strokeWidth="2.5" className="badge-ring"/>
                    <g transform="translate(321,144) scale(1.65) translate(-12,-12)">
                      <path d="M12 2C6.48 2 2 8 2 13a10 10 0 0 0 20 0c0-5-4.48-11-10-11z"
                        stroke="#84cc16" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 14a4.5 4.5 0 0 0 9 0"
                        stroke="#84cc16" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </g>
                  </g>
                  <text x="321" y="199" textAnchor="middle" fontSize="12.5" fontFamily="Vazirmatn,system-ui,sans-serif" fill="white" fontWeight="700">تعویض روغن</text>
                </g>

              </svg>
            </div>

            {/* ── Mobile fallback: 2×5 grid ── */}
            <div className="sm:hidden grid grid-cols-2 gap-5 mt-4">
              {[
                { icon: WrenchIcon,   title: "تعمیر موتور",  color: "#e8002a" },
                { icon: BatteryIcon,  title: "باتری",        color: "#6366f1" },
                { icon: TowTruckIcon, title: "یدک‌کش",       color: "#f59e0b" },
                { icon: OilDropIcon,  title: "تعویض روغن",   color: "#84cc16" },
                { icon: ZapIcon,      title: "برق‌کشی",      color: "#eab308" },
                { icon: PhoneIcon,    title: "پشتیبانی",     color: "#06b6d4" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Link key={s.title} href="/request"
                    className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-white/[0.07] shadow-sm hover:bg-white/[0.12] transition-all">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.color + "30" }}>
                      <Icon size={20} style={{ color: s.color }}/>
                    </div>
                    <span className="font-bold text-white/90 text-[13px]">{s.title}</span>
                  </Link>
                );
              })}
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
                    <span className="text-[10px] font-black text-brand-300 tracking-widest block mb-4">{step.num}</span>
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5">
                      <Icon size={22} className="text-brand-600"/>
                    </div>
                    <h3 className="font-black text-slate-900 mb-2 text-[15px]">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/request" className="btn-primary text-[15px] py-4 px-10 rounded-2xl">
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
                className="flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl text-[15px] transition-all hover:-translate-y-0.5 duration-200 shadow-[0_8px_28px_rgba(232,0,42,0.4)]"
                style={{ background: "#e8002a" }}>
                <ZapIcon size={17}/> درخواست فوری
              </Link>
              <a href="tel:+98"
                className="flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-xl text-[15px] hover:bg-white/10 transition-colors"
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
