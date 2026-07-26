"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  DEFAULT_SITE_SETTINGS,
  RequestServiceCopy,
  ServiceTag,
  SiteSettings,
  VehicleId,
  loadSiteSettings,
} from "@/lib/siteSettings";
import { CreateRequestInput } from "@/lib/validators";
import { ServiceType } from "@/types/enums";

type ShirazNeighborhood = {
  name: string;
  lat: number;
  lng: number;
  zone: "central" | "north" | "south" | "east" | "west";
};

const SHIRAZ_NEIGHBORHOODS: ShirazNeighborhood[] = [
  { name: "معالی آباد", lat: 29.641, lng: 52.478, zone: "north" },
  { name: "قدوسی غربی", lat: 29.634, lng: 52.496, zone: "north" },
  { name: "فرهنگ شهر", lat: 29.649, lng: 52.487, zone: "north" },
  { name: "قصرالدشت", lat: 29.625, lng: 52.509, zone: "west" },
  { name: "ستارخان", lat: 29.627, lng: 52.519, zone: "central" },
  { name: "عفیف آباد", lat: 29.629, lng: 52.531, zone: "central" },
  { name: "زرگری", lat: 29.624, lng: 52.545, zone: "central" },
  { name: "مطهری", lat: 29.611, lng: 52.538, zone: "central" },
  { name: "زند", lat: 29.616, lng: 52.543, zone: "central" },
  { name: "نمازی", lat: 29.617, lng: 52.531, zone: "central" },
  { name: "ارم", lat: 29.634, lng: 52.526, zone: "north" },
  { name: "چمران", lat: 29.641, lng: 52.514, zone: "north" },
  { name: "پاسداران", lat: 29.604, lng: 52.529, zone: "central" },
  { name: "کوی زهرا", lat: 29.582, lng: 52.559, zone: "south" },
  { name: "بلوار مدرس", lat: 29.596, lng: 52.583, zone: "east" },
  { name: "زرهی", lat: 29.592, lng: 52.541, zone: "south" },
  { name: "دروازه قرآن", lat: 29.633, lng: 52.559, zone: "north" },
  { name: "سعدیه", lat: 29.626, lng: 52.590, zone: "east" },
];

const SLUG_TO_SERVICE: Record<string, ServiceType> = {
  battery: ServiceType.BATTERY,
  "oil-change": ServiceType.OIL_CHANGE,
  tow: ServiceType.TOW,
  transport: ServiceType.TOW,
  "fuel-delivery": ServiceType.FUEL_DELIVERY,
  "engine-repair": ServiceType.MECHANIC,
  tire: ServiceType.MECHANIC,
  "car-wash": ServiceType.MECHANIC,
  electrical: ServiceType.MECHANIC,
  lights: ServiceType.MECHANIC,
  "brake-pads": ServiceType.MECHANIC,
  paint: ServiceType.MECHANIC,
  brakes: ServiceType.MECHANIC,
  chain: ServiceType.MECHANIC,
  puncture: ServiceType.MECHANIC,
  "inner-tube": ServiceType.MECHANIC,
  gears: ServiceType.MECHANIC,
  wheel: ServiceType.MECHANIC,
  "full-service": ServiceType.MECHANIC,
};

const DEFAULT_DETAILS = [
  "نیاز به بررسی متخصص",
  "مشکل فوری است",
  "نیاز به اعلام قیمت قبل از اعزام",
  "هماهنگی تلفنی لازم است",
];

function getSlugFromHref(href: string) {
  try {
    return new URL(href, "http://local").searchParams.get("service");
  } catch {
    return null;
  }
}

function getVehicleFromQuery(value: string | null): VehicleId {
  return value === "motorcycle" || value === "bicycle" ? value : "car";
}

function getServiceType(tag: ServiceTag): ServiceType {
  const slug = getSlugFromHref(tag.href);
  return slug ? SLUG_TO_SERVICE[slug] ?? ServiceType.MECHANIC : ServiceType.MECHANIC;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDateOptions(value: string) {
  const rows = splitLines(value);
  return rows.length
    ? rows.map((row, index) => {
        const [title, subtitle] = row.split("|").map((part) => part.trim());
        return { id: `date-${index}`, title, subtitle: subtitle || "زمان پیشنهادی" };
      })
    : [{ id: "date-0", title: "امروز", subtitle: "اولین زمان آزاد" }];
}

function getFallbackCopy(tag: ServiceTag): RequestServiceCopy {
  return {
    summary: `درخواست ${tag.label} با هماهنگی سریع متخصص`,
    lead: `برای ${tag.label}، مشخصات خودرو و شرایط فعلی را وارد کنید.`,
    vehiclePlaceholder: DEFAULT_SITE_SETTINGS.requestFormTexts.vehiclePlaceholder,
    detailsCsv: DEFAULT_DETAILS.join("\n"),
    notesPlaceholder: DEFAULT_SITE_SETTINGS.requestFormTexts.notesPlaceholder,
  };
}

function zoneLabel(zone: ShirazNeighborhood["zone"]) {
  const labels = { central: "مرکزی", north: "شمال", south: "جنوب", east: "شرق", west: "غرب" };
  return labels[zone];
}

export default function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVehicle = getVehicleFromQuery(searchParams.get("vehicle"));
  const initialSlug = searchParams.get("service");

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [details, setDetails] = useState<string[]>([]);
  const [date, setDate] = useState("date-0");
  const [time, setTime] = useState("");
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState<ShirazNeighborhood | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const serviceTags = useMemo(() => {
    const tags = settings.serviceTags.filter((tag) => tag.enabled && tag.vehicle === initialVehicle);
    return tags.length ? tags : settings.serviceTags.filter((tag) => tag.enabled);
  }, [initialVehicle, settings.serviceTags]);

  useEffect(() => {
    if (selectedTagId && serviceTags.some((tag) => tag.id === selectedTagId)) return;
    const matchingTag = serviceTags.find((tag) => getSlugFromHref(tag.href) === initialSlug);
    setSelectedTagId(matchingTag?.id ?? serviceTags[0]?.id ?? "");
    setDetails([]);
  }, [initialSlug, selectedTagId, serviceTags]);

  const text = settings.requestFormTexts;
  const selectedTag = serviceTags.find((tag) => tag.id === selectedTagId) ?? serviceTags[0];
  const selectedCopy = selectedTag
    ? { ...getFallbackCopy(selectedTag), ...(settings.requestServiceCopies[selectedTag.id] ?? {}) }
    : getFallbackCopy({
        id: "fallback",
        vehicle: "car",
        label: "سرویس",
        href: "/request",
        color: "#06b6d4",
        enabled: true,
      });
  const dateOptions = parseDateOptions(text.dateOptionsCsv);
  const timeOptions = splitLines(text.timeOptionsCsv);
  const detailOptions = splitLines(selectedCopy.detailsCsv);

  useEffect(() => {
    if (!time && timeOptions[0]) setTime(timeOptions[0]);
  }, [time, timeOptions]);

  const filteredNeighborhoods = useMemo(() => {
    const query = neighborhoodQuery.trim();
    if (!query) return SHIRAZ_NEIGHBORHOODS.slice(0, 8);
    return SHIRAZ_NEIGHBORHOODS.filter((item) => item.name.includes(query)).slice(0, 8);
  }, [neighborhoodQuery]);

  const toggleDetail = (value: string) => {
    setDetails((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setImages(files.map((file) => file.name));
  };

  const validateAll = () => {
    if (!selectedTag) {
      toast.error("نوع سرویس را انتخاب کنید.");
      return false;
    }
    if (vehicleModel.trim().length < 2) {
      toast.error("مشخصات خودرو را وارد کنید.");
      return false;
    }
    if (details.length === 0) {
      toast.error("حداقل یک مورد از جزئیات سرویس را انتخاب کنید.");
      return false;
    }
    if (!neighborhood) {
      toast.error("محله خود را در شیراز انتخاب کنید.");
      return false;
    }
    if (name.trim().length < 2) {
      toast.error("نام خود را وارد کنید.");
      return false;
    }
    if (!/^09[0-9]{9}$/.test(phone)) {
      toast.error("شماره موبایل معتبر وارد کنید.");
      return false;
    }
    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll() || !selectedTag || !neighborhood) return;
    setSubmitting(true);

    const selectedDate = dateOptions.find((item) => item.id === date)?.title ?? dateOptions[0]?.title ?? "";
    const payload: CreateRequestInput = {
      name: name.trim(),
      phone,
      serviceType: getServiceType(selectedTag),
      locationLat: neighborhood.lat,
      locationLng: neighborhood.lng,
      description: [
        `خدمت انتخابی: ${selectedTag.label}`,
        `لینک/اسلاگ خدمت: ${selectedTag.href}`,
        `خودرو: ${vehicleModel}`,
        `جزئیات خدمت: ${details.join("، ")}`,
        `زمان: ${selectedDate} - ${time}`,
        `محله شیراز: ${neighborhood.name} (${zoneLabel(neighborhood.zone)})`,
        images.length ? `تصاویر انتخاب‌شده: ${images.join("، ")}` : "تصویر انتخاب نشده",
        description ? `توضیحات: ${description}` : "",
        "قیمت: در انتظار فرمول محاسبه",
      ]
        .filter(Boolean)
        .join("\n"),
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("ثبت درخواست ناموفق بود. لطفا دوباره تلاش کنید.");
        return;
      }

      router.push("/request/confirm");
    } catch {
      toast.error("خطا در ارتباط با سرور. اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[1.15rem] border border-slate-200 bg-white p-3 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:rounded-3xl sm:p-7">
      <header className="mb-4 border-b border-slate-200 pb-4 sm:mb-7 sm:pb-6">
        <button type="button" onClick={() => router.push("/")} className="mb-3 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition sm:mb-5 sm:px-4 sm:text-sm sm:hover:border-cyan-400 sm:hover:text-cyan-700">
          بازگشت
        </button>
        <p className="text-xs font-black tracking-widest text-cyan-600">{text.badge}</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-4xl">{text.title}</h1>
        <p className="mt-2 max-w-3xl text-xs font-bold leading-6 text-slate-500 sm:mt-3 sm:text-sm sm:leading-7">{text.intro}</p>
      </header>

      <div className="grid gap-3 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="-mx-3 border-y border-slate-200 bg-slate-50/70 px-3 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:p-4 xl:col-span-2">
          <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5">
            <div className="min-w-0">
              <h2 className="text-lg font-black sm:text-xl">{text.serviceTitle}</h2>
              <p className="mt-1 line-clamp-2 text-xs font-bold leading-6 text-slate-500 sm:mt-2 sm:text-sm sm:leading-7">{text.serviceDescription}</p>
            </div>
            <span className="text-xs font-black text-slate-400">{serviceTags.length} خدمت فعال</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-5">
            {serviceTags.map((tag, index) => {
              const active = tag.id === selectedTag?.id;
              const copy = { ...getFallbackCopy(tag), ...(settings.requestServiceCopies[tag.id] ?? {}) };
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSelectedTagId(tag.id);
                    setDetails([]);
                  }}
                  className={`relative min-h-[96px] w-full overflow-hidden rounded-2xl border p-2.5 text-right transition sm:min-h-[132px] sm:p-4 xl:min-h-[150px] ${
                    active ? "border-slate-950 bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.22)]" : "border-slate-200 bg-white sm:bg-slate-50 sm:hover:border-slate-300 sm:hover:bg-white"
                  }`}
                >
                  <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: tag.color }} />
                  <span className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-black sm:mb-4 sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs ${active ? "bg-white text-slate-950" : "bg-slate-100 text-slate-500 shadow-sm sm:bg-white"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="line-clamp-2 block break-words text-[13px] font-black leading-5 sm:text-base sm:leading-7">{tag.label}</span>
                  <span className={`mt-1 hidden text-xs font-bold leading-6 sm:line-clamp-2 ${active ? "text-white/70" : "text-slate-500"}`}>{copy.summary}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold leading-6 text-slate-500 shadow-sm sm:hidden">
            {text.selectedServiceLabel}: <span className="font-black text-slate-950">{selectedTag?.label ?? "انتخاب نشده"}</span>
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4">
          <h2 className="text-lg font-black sm:text-xl">{text.vehicleTitle}</h2>
          <p className="mt-1 text-xs font-bold leading-6 text-slate-500 sm:mt-2 sm:text-sm sm:leading-7">{selectedCopy.lead}</p>
          <input
            value={vehicleModel}
            onChange={(event) => setVehicleModel(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right text-sm font-bold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:mt-4 sm:py-4 sm:text-base"
            placeholder={selectedCopy.vehiclePlaceholder || text.vehiclePlaceholder}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4">
          <h2 className="text-lg font-black sm:text-xl">{text.detailsTitle}</h2>
          <p className="mt-1 text-xs font-bold leading-6 text-slate-500 sm:mt-2 sm:text-sm sm:leading-7">{text.detailsDescription}</p>
          <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
            {detailOptions.map((item) => {
              const checked = details.includes(item);
              return (
                <button key={item} type="button" onClick={() => toggleDetail(item)} className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-right text-xs font-black transition sm:px-4 sm:py-4 sm:text-sm ${checked ? "border-cyan-500 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-50 sm:hover:border-cyan-300"}`}>
                  <span>{item}</span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs ${checked ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-300 bg-white text-transparent"}`}>
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4">
          <h2 className="text-lg font-black sm:text-xl">{text.scheduleTitle}</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {dateOptions.map((item) => (
              <button key={item.id} type="button" onClick={() => setDate(item.id)} className={`rounded-2xl border p-2.5 text-right transition sm:p-4 ${date === item.id ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-slate-50"}`}>
                <span className="block text-xs font-black sm:text-sm">{item.title}</span>
                <span className="mt-1 block text-xs font-bold opacity-75">{item.subtitle}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
            {timeOptions.map((item) => (
              <button key={item} type="button" onClick={() => setTime(item)} className={`rounded-xl border px-3 py-3 text-xs font-black transition sm:text-sm ${time === item ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white"}`}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4">
          <h2 className="text-lg font-black sm:text-xl">{text.neighborhoodTitle}</h2>
          <input value={neighborhoodQuery} onChange={(event) => setNeighborhoodQuery(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right text-sm font-bold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:mt-4 sm:py-4 sm:text-base" placeholder={text.neighborhoodPlaceholder} />
          <div className="mt-3 grid max-h-[260px] gap-2 overflow-y-auto pr-1 sm:mt-4 sm:max-h-none sm:grid-cols-2 sm:overflow-visible sm:pr-0">
            {filteredNeighborhoods.map((item) => (
              <button key={item.name} type="button" onClick={() => { setNeighborhood(item); setNeighborhoodQuery(item.name); }} className={`rounded-xl border px-3 py-2.5 text-right text-xs font-bold transition sm:px-4 sm:py-3 sm:text-sm ${neighborhood?.name === item.name ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white"}`}>
                {item.name}
                <span className="mt-1 block text-xs text-slate-400">زون: {zoneLabel(item.zone)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4">
          <h2 className="text-lg font-black sm:text-xl">{text.imagesTitle}</h2>
          <label className="mt-3 flex min-h-[104px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition sm:mt-4 sm:min-h-[150px] sm:hover:border-cyan-400 sm:hover:bg-cyan-50">
            <span className="text-2xl font-black text-cyan-600 sm:text-3xl">+</span>
            <span className="mt-2 text-xs font-black text-slate-700 sm:text-sm">{text.imageUploadLabel}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </label>
          {images.length > 0 ? <p className="mt-3 text-sm font-bold text-slate-500">{images.length} تصویر انتخاب شد</p> : null}
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4 xl:col-span-2">
          <h2 className="text-lg font-black sm:text-xl">{text.notesTitle}</h2>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right text-sm font-bold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:mt-4 sm:py-4 sm:text-base" placeholder={selectedCopy.notesPlaceholder || text.notesPlaceholder} />
        </section>

        <section className="rounded-2xl border border-slate-200 p-3 sm:p-4 xl:col-span-2">
          <h2 className="text-lg font-black sm:text-xl">{text.contactTitle}</h2>
          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right text-sm font-bold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:py-4 sm:text-base" placeholder={text.namePlaceholder} />
            <input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={11} dir="ltr" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-sm font-bold tracking-[0.18em] outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:py-4 sm:text-base" placeholder={text.phonePlaceholder} />
          </div>
          <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs font-bold leading-6 text-slate-500 sm:mt-4 sm:px-4 sm:py-3 sm:text-sm sm:leading-7">{text.privacyNote}</p>
        </section>
      </div>

      <footer className="sticky bottom-0 -mx-3 mt-5 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-3 pb-2 pt-3 backdrop-blur sm:static sm:mx-0 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-5 sm:backdrop-blur-0">
        <div className="hidden text-sm font-bold text-slate-500 sm:block">
          {text.selectedServiceLabel}: <span className="text-slate-900">{selectedTag?.label ?? "انتخاب نشده"}</span>
        </div>
        <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#2388bd] px-8 py-3.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-4 sm:text-base sm:hover:bg-[#1677aa]">
          {submitting ? text.submitLoadingLabel : text.submitLabel}
        </button>
      </footer>
    </form>
  );
}
