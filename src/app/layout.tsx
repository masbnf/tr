import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مکانیکا | خدمات خودرو سیار شیراز",
  description: "سرویس فوری خودرو در محل — مکانیک، باتری، یدک‌کش و تعویض روغن در شیراز",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
