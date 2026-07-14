"use client";

import { FormEvent, useEffect, useState } from "react";
import { Provider } from "@/types/provider";
import { ServiceType } from "@/types/enums";
import { SERVICE_OPTIONS } from "@/constants/services";
import {
  DEFAULT_SITE_SETTINGS,
  SiteNavLink,
  SiteSettings,
  ServiceTag,
  VehicleId,
  loadSiteSettings,
  saveSiteSettings,
} from "@/lib/siteSettings";

const SERVICE_LABELS = Object.fromEntries(
  SERVICE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<ServiceType, string>;

function nextLinkId() {
  return `link-${Date.now()}`;
}

function nextTagId() {
  return `tag-${Date.now()}`;
}

const VEHICLE_OPTIONS: Array<{ value: VehicleId; label: string }> = [
  { value: "car", label: "خودرو" },
  { value: "motorcycle", label: "موتور" },
  { value: "bicycle", label: "دوچرخه" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [message, setMessage] = useState("");
  const [activeVehicle, setActiveVehicle] = useState<VehicleId>("car");

  const persistAndReload = (nextSettings: SiteSettings, alertMessage: string) => {
    saveSiteSettings(nextSettings);
    window.alert(alertMessage);
    window.location.reload();
  };

  const loadProviders = async () => {
    const res = await fetch("/api/providers", { cache: "no-store" });
    if (res.ok) setProviders(await res.json());
  };

  useEffect(() => {
    setSettings(loadSiteSettings());
    loadProviders();
  }, []);

  const updateLink = (id: string, patch: Partial<SiteNavLink>) => {
    setSettings((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    }));
  };

  const removeLink = (id: string) => {
    if (!window.confirm("این لینک حذف شود؟")) return;

    const nextSettings = {
      ...settings,
      navLinks: settings.navLinks.filter((link) => link.id !== id),
    };

    setSettings(nextSettings);
    persistAndReload(nextSettings, "لینک حذف شد. صفحه برای اعمال تغییرات reload می‌شود.");
  };

  const addLink = () => {
    setSettings((prev) => ({
      ...prev,
      navLinks: [...prev.navLinks, { id: nextLinkId(), label: "لینک جدید", href: "/", enabled: true }],
    }));
  };

  const updateTag = (id: string, patch: Partial<ServiceTag>) => {
    setSettings((prev) => ({
      ...prev,
      serviceTags: prev.serviceTags.map((tag) => (tag.id === id ? { ...tag, ...patch } : tag)),
    }));
  };

  const removeTag = (id: string) => {
    if (!window.confirm("این تگ از روی عکس و لیست خدمات حذف شود؟")) return;

    const nextSettings = {
      ...settings,
      serviceTags: settings.serviceTags.filter((tag) => tag.id !== id),
    };

    setSettings(nextSettings);
    persistAndReload(nextSettings, "تگ حذف شد. صفحه برای اعمال تغییرات reload می‌شود.");
  };

  const moveTag = (id: string, direction: -1 | 1) => {
    setSettings((prev) => {
      const vehicleTags = prev.serviceTags.filter((tag) => tag.vehicle === activeVehicle);
      const index = vehicleTags.findIndex((tag) => tag.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= vehicleTags.length) return prev;

      const reordered = [...vehicleTags];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];

      let cursor = 0;
      return {
        ...prev,
        serviceTags: prev.serviceTags.map((tag) => (tag.vehicle === activeVehicle ? reordered[cursor++] : tag)),
      };
    });
  };

  const addTag = () => {
    setSettings((prev) => ({
      ...prev,
      serviceTags: [
        ...prev.serviceTags,
        {
          id: nextTagId(),
          vehicle: activeVehicle,
          label: "خدمت جدید",
          href: `/request?vehicle=${activeVehicle}&service=new`,
          color: "#e8002a",
          enabled: true,
          ...(activeVehicle === "car" ? { x: 50, y: 50 } : {}),
        },
      ],
    }));
  };

  const submitSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = {
      ...settings,
      navLinks: settings.navLinks.map((link) =>
        link.id === "phone" ? { ...link, href: `tel:${settings.phone}` } : link
      ),
    };
    setSettings(normalized);
    saveSiteSettings(normalized);
    setMessage("تنظیمات ذخیره شد و روی منوی سایت اعمال شد.");
    window.alert("تغییرات ذخیره شد. صفحه برای اعمال تغییرات reload می‌شود.");
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:p-7">
        <p className="text-xs font-bold tracking-widest text-brand-300">SITE SETTINGS</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">تنظیمات سایت</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
          نام سایت، شماره تماس، لینک‌های منو و تعریف پرسنل را از همین بخش مدیریت کن.
        </p>
      </header>

      {message ? (
        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/15 p-4 text-sm font-bold text-emerald-50">
          {message}
        </div>
      ) : null}

      <form onSubmit={submitSettings} className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5">
          <p className="text-xs font-bold tracking-widest text-brand-600">IDENTITY</p>
          <h3 className="mt-2 text-xl font-black">اطلاعات اصلی سایت</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">نام سایت</span>
              <input
                className="input-field"
                value={settings.siteName}
                onChange={(event) => setSettings((prev) => ({ ...prev, siteName: event.target.value }))}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">شماره تماس سایت</span>
              <input
                className="input-field"
                value={settings.phone}
                onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))}
                dir="ltr"
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-card">
          <p className="text-xs font-bold tracking-widest text-brand-300">PREVIEW</p>
          <h3 className="mt-2 text-xl font-black text-white">{settings.siteName}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">شماره تماس فعال: <span dir="ltr">{settings.phone}</span></p>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-brand-500 px-5 py-3 font-black text-white transition hover:bg-brand-600">
            ذخیره تنظیمات
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-600">NAVIGATION</p>
              <h3 className="mt-2 text-xl font-black">لینک‌های سایت</h3>
            </div>
            <button type="button" onClick={addLink} className="rounded-2xl border border-brand-200 px-4 py-2 text-sm font-black text-brand-600 hover:bg-brand-50">
              افزودن لینک
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {settings.navLinks.map((link) => (
              <div key={link.id} className="grid gap-3 rounded-2xl border border-slate-200 p-3 lg:grid-cols-[1fr_1.5fr_auto_auto] lg:items-center">
                <input
                  className="input-field"
                  value={link.label}
                  onChange={(event) => updateLink(link.id, { label: event.target.value })}
                  placeholder="عنوان لینک"
                />
                <input
                  className="input-field"
                  value={link.href}
                  onChange={(event) => updateLink(link.id, { href: event.target.value })}
                  placeholder="/example"
                  dir="ltr"
                />
                <label className="flex items-center gap-2 text-sm font-black text-slate-600">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(event) => updateLink(link.id, { enabled: event.target.checked })}
                    className="h-4 w-4 accent-brand-500"
                  />
                  فعال
                </label>
                <button type="button" onClick={() => removeLink(link.id)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-600 hover:bg-brand-50 hover:text-brand-600">
                  حذف
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-600">SERVICE TAGS</p>
              <h3 className="mt-2 text-xl font-black">تگ‌های روی تصویر و لینک‌های خدمات</h3>
            </div>
            <button type="button" onClick={addTag} className="rounded-2xl border border-brand-200 px-4 py-2 text-sm font-black text-brand-600 hover:bg-brand-50">
              افزودن تگ
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {VEHICLE_OPTIONS.map((vehicle) => (
              <button
                key={vehicle.value}
                type="button"
                onClick={() => setActiveVehicle(vehicle.value)}
                className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                  activeVehicle === vehicle.value ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                {vehicle.label}
              </button>
            ))}
          </div>

          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold leading-7 text-slate-600">
            ترتیب همین لیست، ترتیب لینک‌های دور عکس ماشین است. اگر موردی حذف یا غیرفعال شود، بقیه بدون فاصله خالی با همین ترتیب دوباره روی مدار می‌نشینند.
          </p>

          <div className="mt-5 space-y-3">
            {settings.serviceTags.filter((tag) => tag.vehicle === activeVehicle).map((tag, index, tags) => (
              <div key={tag.id} className="grid gap-3 rounded-2xl border border-slate-200 p-3 xl:grid-cols-[88px_1fr_1.4fr_96px_auto_auto] xl:items-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveTag(tag.id, -1)}
                    disabled={index === 0}
                    className="h-10 w-10 rounded-xl bg-slate-100 text-sm font-black text-slate-600 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40"
                    aria-label="انتقال به بالا"
                    title="انتقال به بالا"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTag(tag.id, 1)}
                    disabled={index === tags.length - 1}
                    className="h-10 w-10 rounded-xl bg-slate-100 text-sm font-black text-slate-600 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40"
                    aria-label="انتقال به پایین"
                    title="انتقال به پایین"
                  >
                    ↓
                  </button>
                </div>
                <input
                  className="input-field"
                  value={tag.label}
                  onChange={(event) => updateTag(tag.id, { label: event.target.value })}
                  placeholder="نام تگ"
                />
                <input
                  className="input-field"
                  value={tag.href}
                  onChange={(event) => updateTag(tag.id, { href: event.target.value })}
                  placeholder="/request?service=..."
                  dir="ltr"
                />
                <input
                  type="color"
                  value={tag.color}
                  onChange={(event) => updateTag(tag.id, { color: event.target.value })}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-1"
                  aria-label="رنگ تگ"
                />
                <label className="flex items-center gap-2 text-sm font-black text-slate-600">
                  <input
                    type="checkbox"
                    checked={tag.enabled}
                    onChange={(event) => updateTag(tag.id, { enabled: event.target.checked })}
                    className="h-4 w-4 accent-brand-500"
                  />
                  فعال
                </label>
                <button type="button" onClick={() => removeTag(tag.id)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-600 hover:bg-brand-50 hover:text-brand-600">
                  حذف
                </button>
              </div>
            ))}
          </div>
        </section>
      </form>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5">
          <div className="mb-4">
            <p className="text-xs font-bold tracking-widest text-brand-600">PERSONNEL</p>
            <h3 className="text-xl font-black">پرسنل و متخصص‌ها</h3>
          </div>
          <ProvidersList providers={providers} />
        </div>
        <ProviderComposer onCreated={loadProviders} />
      </section>
    </div>
  );
}

function ProvidersList({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) {
    return <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">هنوز پرسنلی ثبت نشده است.</p>;
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <div key={provider.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-slate-900">{provider.name}</p>
            <p className="mt-1 text-sm font-bold text-slate-500" dir="ltr">{provider.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {SERVICE_LABELS[provider.serviceType] ?? provider.serviceType}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${provider.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {provider.isActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProviderComposer({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.MECHANIC);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, serviceType, isActive: true }),
      });
      if (res.ok) {
        setName("");
        setPhone("");
        setServiceType(ServiceType.MECHANIC);
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-card">
      <p className="text-xs font-bold tracking-widest text-brand-300">NEW PERSONNEL</p>
      <h3 className="mt-2 text-xl font-black text-white">ثبت پرسنل جدید</h3>
      <div className="mt-5 space-y-3">
        <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="نام پرسنل" required />
        <input className="input-field" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="شماره تماس" dir="ltr" required />
        <select className="input-field" value={serviceType} onChange={(event) => setServiceType(event.target.value as ServiceType)}>
          {SERVICE_OPTIONS.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand-500 px-5 py-3 font-black text-white transition hover:bg-brand-600 disabled:opacity-60">
          {loading ? "در حال ثبت..." : "ثبت پرسنل"}
        </button>
      </div>
    </form>
  );
}
