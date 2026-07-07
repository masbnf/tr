import Link from "next/link";
import { PhoneIcon, LocationIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <p className="font-black text-white text-xl mb-3">
            مکانیکا<span className="text-brand-400">.</span>
          </p>
          <p className="text-lg leading-relaxed mb-5">
            خدمات سیار خودرو در محل — مکانیک، باتری، یدک‌کش و تعویض روغن در شیراز.
          </p>
          <div className="flex items-center gap-2 text-lg">
            <LocationIcon size={17} className="text-brand-400 shrink-0"/>
            شیراز، ایران
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="font-bold text-white text-lg mb-4">دسترسی سریع</p>
          <ul className="flex flex-col gap-2.5 text-lg">
            {[
              { href: "/",          label: "صفحه اصلی" },
              { href: "/request",   label: "درخواست سرویس" },
              { href: "/#services", label: "خدمات ما" },
              { href: "/#how",      label: "نحوه کار" },
              { href: "/admin",     label: "پنل مدیریت" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-brand-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-bold text-white text-lg mb-4">تماس با ما</p>
          <a href="tel:+98" className="flex items-center gap-2 text-lg hover:text-brand-400 transition-colors mb-3">
            <PhoneIcon size={17} className="text-brand-400 shrink-0"/>
            ۰۷۱-XXXX-XXXX
          </a>
          <p className="text-base leading-relaxed">
            پاسخگوی شما هستیم<br/>۲۴ ساعته، ۷ روز هفته
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
          <p>© ۱۴۰۳ مکانیکا — تمامی حقوق محفوظ است</p>
          <p>طراحی و توسعه با ❤️ در شیراز</p>
        </div>
      </div>
    </footer>
  );
}
