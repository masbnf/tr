import Link from "next/link";
import { ReactNode } from "react";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/revenue", label: "درآمد" },
  { href: "/admin/settings", label: "تنظیمات" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <div className="fixed inset-0 pointer-events-none opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(232,0,42,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,112,136,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:py-6">
        <aside className="mb-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur lg:sticky lg:top-6 lg:mb-0 lg:flex lg:h-[calc(100vh-48px)] lg:w-72 lg:flex-col lg:p-5">
          <Link href="/" className="mb-5 block">
            <p className="text-xs font-bold tracking-widest text-brand-300">MECHANICA</p>
            <h1 className="mt-1 text-2xl font-black">پنل مدیریت</h1>
          </Link>

          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white/75 transition hover:border-brand-400/50 hover:bg-brand-500/20 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 rounded-2xl border border-brand-400/25 bg-brand-500/10 p-4 text-sm leading-7 text-white/75">
            <p className="font-black text-white">کنترل سریع عملیات</p>
            <p className="mt-1">سفارش‌ها، درآمد، لینک‌های سایت و پرسنل را از همین پنل مدیریت کن.</p>
          </div>

          <LogoutButton />
        </aside>

        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
