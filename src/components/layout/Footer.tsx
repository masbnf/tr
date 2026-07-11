import Link from "next/link";
import { PhoneIcon, LocationIcon } from "@/components/ui/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">

        {/* Brand */}
        <div>
          <p className="font-black text-white text-xl mb-3">
            مکانیکا<span className="text-brand-400">.</span>
          </p>
          <p className="text-sm sm:text-base leading-relaxed mb-5 text-slate-300">
            خدمات سیار خودرو در محل — مکانیک، باتری، یدک‌کش و تعویض روغن در شیراز.
          </p>
          <div className="flex items-center gap-2 text-sm sm:text-base text-slate-300">
            <LocationIcon size={16} className="text-brand-400 shrink-0"/>
            شیراز، ایران
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="font-bold text-white text-base mb-4">دسترسی سریع</p>
          <ul className="flex flex-col gap-2.5 text-sm sm:text-base">
            {[
              { href: "/",          label: "صفحه اصلی" },
              { href: "/request",   label: "درخواست سرویس" },
              { href: "/#services", label: "خدمات ما" },
              { href: "/#how",      label: "نحوه کار" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="inline-flex items-center min-h-[36px] hover:text-brand-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-bold text-white text-base mb-4">تماس با ما</p>
          <a href="tel:+98" className="flex items-center gap-2 min-h-[36px] text-sm sm:text-base hover:text-brand-400 transition-colors mb-3">
            <PhoneIcon size={16} className="text-brand-400 shrink-0"/>
            ۰۷۱-XXXX-XXXX
          </a>
          <p className="text-sm leading-relaxed text-slate-400">
            پاسخگوی شما هستیم<br/>۲۴ ساعته، ۷ روز هفته
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <p>© {year} مکانیکا — تمامی حقوق محفوظ است</p>
          <p>طراحی و توسعه با ❤️ در شیراز</p>
        </div>
      </div>
    </footer>
  );
}
