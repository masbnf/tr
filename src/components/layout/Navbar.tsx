"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_SITE_SETTINGS, SiteSettings, loadSiteSettings } from "@/lib/siteSettings";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const load = () => setSettings(loadSiteSettings());
    const handleSettings = (event: Event) => {
      const customEvent = event as CustomEvent<SiteSettings>;
      setSettings(customEvent.detail ?? loadSiteSettings());
    };

    load();
    window.addEventListener("mechanica:site-settings", handleSettings);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("mechanica:site-settings", handleSettings);
      window.removeEventListener("storage", load);
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = settings.navLinks.filter((link) => link.enabled);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      style={scrolled ? { background: "rgba(13,16,53,0.95)" } : {}}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        <Link href="/" className="font-black text-xl text-white tracking-tight shrink-0">
          {settings.siteName}<span className="text-white/50">.</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-[18px] font-medium text-white/75">
          {navLinks.map((link) =>
            link.href.startsWith("tel:") ? (
              <li key={link.id}>
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.id}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/request"
            className="font-black text-[15px] px-5 py-2 rounded-lg transition-colors shadow-md text-white hover:opacity-90"
            style={{ background: "#e8002a" }}
          >
            درخواست سرویس
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      <div id="mobile-nav-drawer" className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-1" style={{ background: "rgba(13,16,53,0.98)" }}>
          {navLinks.map((link) =>
            link.href.startsWith("tel:") ? (
              <a
                key={link.id}
                href={link.href}
                className="flex items-center text-white/80 hover:text-white font-medium text-sm min-h-[44px] py-2.5 border-b border-white/10 last:border-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center text-white/80 hover:text-white font-medium text-sm min-h-[44px] py-2.5 border-b border-white/10 last:border-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/request"
            className="mt-3 font-black text-sm py-3 rounded-xl text-center text-white hover:opacity-90 transition-opacity"
            style={{ background: "#e8002a" }}
            onClick={() => setOpen(false)}
          >
            درخواست سرویس
          </Link>
        </div>
      </div>
    </header>
  );
}
