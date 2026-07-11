import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StoreIcon, ArrowLeftIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "فروشگاه مکانیکا | به‌زودی",
  description: "فروشگاه قطعات و لوازم خودرو به‌زودی راه‌اندازی می‌شود.",
};

/* Placeholder route — no products/cart/checkout yet, ready for future work. */
export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden flex flex-col min-h-screen" style={{ background: "#0d1035" }}>
        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-28 text-center">
          <div className="w-20 h-20 rounded-2xl border border-brand-500/40 bg-white/[0.04] flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(232,0,42,0.18)]">
            <StoreIcon size={34} className="text-brand-300" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-300 border border-brand-500/30 bg-brand-500/10 rounded-full px-4 py-1.5 mb-5">
            به‌زودی
          </span>

          <h1 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
            فروشگاه مکانیکا
          </h1>

          <p className="max-w-md text-white/65 leading-relaxed text-base sm:text-lg mb-10">
            فروشگاه قطعات و لوازم خودرو به‌زودی راه‌اندازی می‌شود.
          </p>

          <Link href="/"
            className="inline-flex items-center gap-2 font-bold text-white/80 hover:text-white border border-white/15 hover:border-white/30 rounded-xl px-6 py-3 transition-colors"
          >
            بازگشت به صفحه اصلی
            <ArrowLeftIcon size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
