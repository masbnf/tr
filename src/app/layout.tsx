import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const paeez = localFont({
  src: "./fonts/Paeez.ttf",
  variable: "--font-paeez",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مکانیکا | خدمات خودرو سیار شیراز",
  description: "سرویس فوری خودرو در محل — مکانیک، باتری، یدک‌کش و تعویض روغن در شیراز",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={paeez.variable}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
