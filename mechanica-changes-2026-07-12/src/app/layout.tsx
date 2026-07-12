import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مکانیکا | خدمات خودرو سیار شیراز",
  description: "سرویس فوری خودرو در محل — مکانیک، باتری، یدک‌کش و تعویض روغن در شیراز",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-vazirmatn), Tahoma, Arial, sans-serif",
              direction: "rtl",
            },
          }}
        />
      </body>
    </html>
  );
}
