"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CarIcon, MotorcycleIcon, BicycleIcon, StoreIcon, CheckIcon, type IconProps,
} from "@/components/ui/Icons";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type VehicleType = "car" | "motorcycle" | "bicycle";

type VehicleService = {
  label: string;
  href: string;
  color: string;
  /* Hotspot position as a % of the image, matched by hand to the source
     artwork. Omitted (not guessed) for vehicles whose graphic doesn't exist
     yet — see MOTORCYCLE_SERVICES / BICYCLE_SERVICES below. */
  x?: number;
  y?: number;
};

type VehicleConfig = {
  id: VehicleType;
  label: string;
  shortLabel: string;
  /* null until the real illustration is supplied — the showcase then shows
     a "coming soon" placeholder instead of a fabricated/duplicated image. */
  image: string | null;
  alt: string;
  icon: ComponentType<IconProps>;
  services: VehicleService[];
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

/* Car — unchanged from the previous implementation: same hrefs, positions
   and colors, so no existing link or hotspot placement is disturbed. */
const CAR_SERVICES: VehicleService[] = [
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

/* Motorcycle / Bicycle — graphic not supplied yet, so no x/y hotspot
   coordinates are guessed. Service list + request links are ready so the
   chip grid works today; hotspots can be added once the artwork exists. */
const MOTORCYCLE_SERVICES: VehicleService[] = [
  { label: "تعمیر موتور",  href: "/request?vehicle=motorcycle&service=engine-repair", color: "#ef4444" },
  { label: "تعویض روغن",   href: "/request?vehicle=motorcycle&service=oil-change",    color: "#84cc16" },
  { label: "باتری",        href: "/request?vehicle=motorcycle&service=battery",       color: "#6366f1" },
  { label: "برق‌کشی",      href: "/request?vehicle=motorcycle&service=electrical",    color: "#eab308" },
  { label: "لاستیک",       href: "/request?vehicle=motorcycle&service=tire",          color: "#a855f7" },
  { label: "ترمز",         href: "/request?vehicle=motorcycle&service=brakes",        color: "#22d3ee" },
  { label: "زنجیر و دنده", href: "/request?vehicle=motorcycle&service=chain",         color: "#f97316" },
  { label: "امداد و حمل",  href: "/request?vehicle=motorcycle&service=transport",     color: "#10b981" },
];

const BICYCLE_SERVICES: VehicleService[] = [
  { label: "پنچرگیری",    href: "/request?vehicle=bicycle&service=puncture",     color: "#ef4444" },
  { label: "تعویض تیوب",  href: "/request?vehicle=bicycle&service=inner-tube",   color: "#84cc16" },
  { label: "تنظیم ترمز",  href: "/request?vehicle=bicycle&service=brakes",       color: "#22d3ee" },
  { label: "تنظیم دنده",  href: "/request?vehicle=bicycle&service=gears",       color: "#eab308" },
  { label: "تعمیر زنجیر", href: "/request?vehicle=bicycle&service=chain",       color: "#f97316" },
  { label: "تنظیم چرخ",   href: "/request?vehicle=bicycle&service=wheel",       color: "#a855f7" },
  { label: "سرویس کامل",  href: "/request?vehicle=bicycle&service=full-service", color: "#10b981" },
  { label: "حمل دوچرخه",  href: "/request?vehicle=bicycle&service=transport",   color: "#6366f1" },
];

const VEHICLES: VehicleConfig[] = [
  {
    id: "car", label: "خودرو", shortLabel: "خودرو",
    image: "/images/landing-hero-car.png",
    alt: "نمایش خدمات خودرو مکانیکا",
    icon: CarIcon, services: CAR_SERVICES,
  },
  {
    id: "motorcycle", label: "موتورسیکلت", shortLabel: "موتور",
    image: null,
    alt: "نمایش خدمات موتورسیکلت مکانیکا",
    icon: MotorcycleIcon, services: MOTORCYCLE_SERVICES,
  },
  {
    id: "bicycle", label: "دوچرخه", shortLabel: "دوچرخه",
    image: null,
    alt: "نمایش خدمات دوچرخه مکانیکا",
    icon: BicycleIcon, services: BICYCLE_SERVICES,
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function VehicleServiceShowcase() {
  const [activeVehicleId, setActiveVehicleId] = useState<VehicleType>("car");
  const activeVehicle = VEHICLES.find((v) => v.id === activeVehicleId) ?? VEHICLES[0];
  const ActiveIcon = activeVehicle.icon;

  return (
    <div>
      {/* ── Category selector ── */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto mb-7 sm:mb-9">
        {VEHICLES.map((vehicle) => {
          const Icon = vehicle.icon;
          const isActive = vehicle.id === activeVehicleId;
          return (
            <button
              key={vehicle.id}
              type="button"
              aria-pressed={isActive}
              aria-label={`نمایش خدمات ${vehicle.label}`}
              onClick={() => setActiveVehicleId(vehicle.id)}
              className="flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl py-1"
            >
              <span className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border transition-colors duration-200 ${
                isActive
                  ? "border-brand-500 bg-brand-500/15 shadow-[0_0_0_1px_rgba(232,0,42,0.4),0_0_22px_rgba(232,0,42,0.35)]"
                  : "border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]"
              }`}>
                <Icon size={24} className={isActive ? "text-white" : "text-white/70"} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white" aria-hidden="true">
                    <CheckIcon size={11} />
                  </span>
                )}
              </span>
              <span className={`text-[11px] sm:text-xs lg:text-sm font-bold leading-tight text-center transition-colors ${isActive ? "text-white" : "text-white/60"}`}>
                {vehicle.shortLabel}
              </span>
              <span className={`h-0.5 w-5 rounded-full transition-colors ${isActive ? "bg-brand-500" : "bg-transparent"}`} aria-hidden="true" />
            </button>
          );
        })}

        <Link
          href="/shop"
          aria-label="ورود به فروشگاه مکانیکا"
          className="flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl py-1"
        >
          <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border border-white/15 bg-white/[0.04] transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.07]">
            <StoreIcon size={24} className="text-white/70" />
          </span>
          <span className="text-[11px] sm:text-xs lg:text-sm font-bold leading-tight text-center text-white/60">
            فروشگاه
          </span>
          <span className="h-0.5 w-5 rounded-full bg-transparent" aria-hidden="true" />
        </Link>
      </div>

      {/* ── Glass frame + reflection — both driven by activeVehicle.image ── */}
      <div className="relative mx-auto max-w-5xl">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-2/3 h-10 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(232,0,42,0.35), transparent 70%)" }}
          aria-hidden="true" />

        <div className="relative rounded-[2rem] p-2 sm:p-2.5 backdrop-blur-xl bg-white/[0.06] border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 42%)" }}
            aria-hidden="true" />

          <div key={activeVehicle.id} className="anim-vehicle-fade relative aspect-square rounded-[1.6rem] overflow-hidden bg-[#070b24]">
            {activeVehicle.image ? (
              <>
                <Image
                  src={activeVehicle.image}
                  alt={activeVehicle.alt}
                  width={1254}
                  height={1254}
                  priority={activeVehicleId === "car"}
                  className="w-full h-full object-contain"
                />
                {activeVehicle.services.map((s) => (
                  s.x === undefined || s.y === undefined ? null : (
                    <Link
                      key={s.label}
                      href={s.href}
                      title={s.label}
                      aria-label={s.label}
                      className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_0_4px_var(--glow),0_0_30px_10px_var(--glow)] focus-visible:scale-110 focus-visible:shadow-[0_0_0_4px_var(--glow),0_0_30px_10px_var(--glow)]"
                      style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: "clamp(44px, 12.5%, 76px)",
                        aspectRatio: "1 / 1",
                        ["--glow" as string]: `${s.color}88`,
                      }}
                    />
                  )
                ))}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center">
                  <ActiveIcon size={30} className="text-white/60" />
                </div>
                <p className="text-white/70 font-bold text-sm sm:text-base">{activeVehicle.label}</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-sm font-bold text-brand-300 border border-brand-500/30 bg-brand-500/10 rounded-full px-3 py-1">
                  به‌زودی
                </span>
              </div>
            )}
          </div>
        </div>

        {activeVehicle.image && (
          <div className="relative h-16 sm:h-24 lg:h-32 overflow-hidden opacity-25 pointer-events-none select-none"
            style={{
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
            }}
            aria-hidden="true">
            <Image
              src={activeVehicle.image}
              alt=""
              width={1254}
              height={1254}
              className="w-full h-auto object-contain scale-y-[-1]"
            />
          </div>
        )}
      </div>

      {/* ── Service chip grid — reads from the same activeVehicle.services ── */}
      <ul key={`${activeVehicle.id}-chips`} className="anim-vehicle-fade mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-4xl mx-auto" role="list">
        {activeVehicle.services.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              title={s.label}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 min-h-[44px] text-[13px] sm:text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white active:bg-white/15 transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
