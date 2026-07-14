"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { SERVICE_OPTIONS } from "@/constants/services";
import { ServiceType } from "@/types/enums";
import { CreateRequestInput } from "@/lib/validators";

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
  { name: "قصردشت", lat: 29.625, lng: 52.509, zone: "west" },
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

const DETAIL_OPTIONS = [
  "تعویض لنت جلو",
  "تعویض لنت عقب",
  "نیاز به تشخیص متخصص",
  "چک کردن روغن ترمز",
];

const DATE_OPTIONS = [
  { id: "today", title: "امروز", subtitle: "اولین زمان" },
  { id: "tomorrow", title: "فردا", subtitle: "نوبت بعدی" },
  { id: "calendar", title: "تقویم", subtitle: "انتخاب تاریخ" },
];

const TIME_OPTIONS = ["از ۹ تا ۱۲ صبح", "از ۱۲ تا ۱۶ ظهر", "از ۱۶ تا ۲۰ عصر", "توافق با متخصص"];

const STEPS = [
  "service",
  "vehicle",
  "details",
  "schedule",
  "neighborhood",
  "images",
  "notes",
  "phone",
] as const;

function serviceTypeFromSlug(slug: string | null): ServiceType | undefined {
  if (slug === "battery") return ServiceType.BATTERY;
  if (slug === "oil-change") return ServiceType.OIL_CHANGE;
  if (slug === "tow") return ServiceType.TOW;
  return undefined;
}

function zoneLabel(zone: ShirazNeighborhood["zone"]) {
  const labels = {
    central: "مرکزی",
    north: "شمال",
    south: "جنوب",
    east: "شرق",
    west: "غرب",
  };
  return labels[zone];
}

export default function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = serviceTypeFromSlug(searchParams.get("service")) ?? ServiceType.MECHANIC;

  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [vehicleModel, setVehicleModel] = useState("");
  const [details, setDetails] = useState<string[]>([]);
  const [date, setDate] = useState(DATE_OPTIONS[0].id);
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState<ShirazNeighborhood | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const currentStep = STEPS[step];

  const filteredNeighborhoods = useMemo(() => {
    const query = neighborhoodQuery.trim();
    if (!query) return SHIRAZ_NEIGHBORHOODS.slice(0, 6);
    return SHIRAZ_NEIGHBORHOODS.filter((item) => item.name.includes(query)).slice(0, 8);
  }, [neighborhoodQuery]);

  const selectedServiceLabel = SERVICE_OPTIONS.find((opt) => opt.value === serviceType)?.label ?? serviceType;

  const toggleDetail = (value: string) => {
    setDetails((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setImages(files.map((file) => file.name));
  };

  const validateStep = () => {
    if (currentStep === "vehicle" && vehicleModel.trim().length < 2) {
      toast.error("برند و مدل خودرو را وارد کنید.");
      return false;
    }
    if (currentStep === "details" && details.length === 0) {
      toast.error("حداقل یک مورد خدمت را انتخاب کنید.");
      return false;
    }
    if (currentStep === "neighborhood" && !neighborhood) {
      toast.error("محله خود را در شیراز انتخاب کنید.");
      return false;
    }
    if (currentStep === "phone") {
      if (name.trim().length < 2) {
        toast.error("نام خود را وارد کنید.");
        return false;
      }
      if (!/^09[0-9]{9}$/.test(phone)) {
        toast.error("شماره موبایل معتبر وارد کنید.");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  const submit = async () => {
    if (!validateStep() || !neighborhood) return;
    setSubmitting(true);

    const payload: CreateRequestInput = {
      name: name.trim(),
      phone,
      serviceType,
      locationLat: neighborhood.lat,
      locationLng: neighborhood.lng,
      description: [
        `خدمت اصلی: ${selectedServiceLabel}`,
        `خودرو: ${vehicleModel}`,
        `جزئیات خدمت: ${details.join("، ")}`,
        `زمان: ${DATE_OPTIONS.find((item) => item.id === date)?.title ?? date} - ${time}`,
        `محله شیراز: ${neighborhood.name} (${zoneLabel(neighborhood.zone)})`,
        images.length ? `تصاویر پیوست‌شده: ${images.join("، ")}` : "تصویر پیوست نشده",
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

  const primaryAction = currentStep === "phone" ? submit : next;

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-cyan-200/25 bg-white/[0.88] text-slate-950 shadow-[0_18px_70px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex items-center gap-4 px-5 pt-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="بستن"
        >
          ×
        </button>
        <div className="relative h-2 flex-1 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
          <span
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-cyan-500 px-2 py-0.5 text-[11px] font-black text-white shadow"
            style={{ left: `calc(${progress}% - 18px)` }}
          >
            {progress}٪
          </span>
        </div>
      </div>

      <div className="min-h-[480px] px-6 py-9 sm:px-8">
        {currentStep === "service" && (
          <section>
            <h2 className="text-center text-xl font-black">نوع خدمت اصلی را انتخاب کنید:</h2>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((option) => {
                const active = serviceType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setServiceType(option.value)}
                    className={`min-h-[74px] rounded-2xl border px-4 py-3 text-sm font-black transition ${
                      active ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white hover:border-cyan-400"
                    }`}
                  >
                    <span className="mb-1 block text-xl">{option.icon}</span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {currentStep === "vehicle" && (
          <section>
            <h2 className="text-center text-xl font-black">برند و مدل خودرو را در کادر زیر وارد کنید:</h2>
            <input
              value={vehicleModel}
              onChange={(event) => setVehicleModel(event.target.value)}
              className="mt-10 w-full rounded-lg border border-cyan-500 px-4 py-4 text-right text-lg outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="مثلا پژو ۲۰۶ مدل ۱۳۹۸"
              autoFocus
            />
          </section>
        )}

        {currentStep === "details" && (
          <section>
            <h2 className="text-center text-xl font-black">خدمت درخواستی را انتخاب کنید:</h2>
            <div className="mt-8 space-y-3">
              {DETAIL_OPTIONS.map((item) => {
                const checked = details.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDetail(item)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-4 text-right text-base transition ${
                      checked ? "border-cyan-500 bg-cyan-50 shadow-[inset_-5px_0_0_#06a8d8]" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span>{item}</span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded border text-white ${checked ? "border-cyan-500 bg-cyan-500" : "border-slate-300 bg-white"}`}>
                      {checked ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {currentStep === "schedule" && (
          <section>
            <h2 className="text-center text-xl font-black">چه زمانی به این خدمت نیاز دارید؟</h2>
            <h3 className="mt-8 text-center text-lg font-black">انتخاب تاریخ</h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {DATE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDate(item.id)}
                  className={`min-h-[112px] rounded-lg border p-3 text-sm font-black transition ${
                    date === item.id ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="block">{item.title}</span>
                  <span className="mt-3 block text-xs opacity-75">{item.subtitle}</span>
                </button>
              ))}
            </div>
            <div className="my-7 h-px bg-slate-200" />
            <h3 className="text-center text-lg font-black">انتخاب حدود ساعت</h3>
            <div className="mx-auto mt-5 max-w-[230px] space-y-3">
              {TIME_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTime(item)}
                  className={`w-full rounded-lg border px-4 py-3 text-sm font-black transition ${
                    time === item ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {currentStep === "neighborhood" && (
          <section>
            <h2 className="text-center text-xl font-black">در کدام محله شیراز هستید؟</h2>
            <input
              value={neighborhoodQuery}
              onChange={(event) => setNeighborhoodQuery(event.target.value)}
              className="mt-8 w-full rounded-lg border border-cyan-500 px-4 py-4 text-right text-lg outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="جستجوی محله در شیراز"
              autoFocus
            />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {filteredNeighborhoods.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setNeighborhood(item);
                    setNeighborhoodQuery(item.name);
                  }}
                  className={`rounded-xl border px-4 py-3 text-right text-sm font-bold transition ${
                    neighborhood?.name === item.name ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white"
                  }`}
                >
                  {item.name}
                  <span className="mt-1 block text-xs text-slate-400">زون قیمت‌گذاری آینده: {zoneLabel(item.zone)}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,#e0f7ff,#f8fbff)] p-4">
              <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-cyan-300 text-center text-sm font-black text-cyan-700">
                {neighborhood ? `محدوده ${neighborhood.name} روی نقشه شیراز انتخاب شد` : "نقشه جستجوی محله‌های شیراز"}
              </div>
            </div>
          </section>
        )}

        {currentStep === "images" && (
          <section>
            <h2 className="text-center text-xl font-black">در صورت تمایل، تصاویر مرتبط با سفارش خود را بارگذاری کنید</h2>
            <p className="mt-5 text-center text-lg">(اختیاری)</p>
            <label className="mx-auto mt-8 flex h-52 w-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-400 text-cyan-600 transition hover:border-cyan-500 hover:bg-cyan-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-xl font-black text-white">+</span>
              <span className="mt-4 text-sm font-black">افزودن تصویر</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>
            {images.length > 0 && <p className="mt-4 text-center text-sm font-bold text-slate-500">{images.length} تصویر انتخاب شد</p>}
          </section>
        )}

        {currentStep === "notes" && (
          <section>
            <h2 className="text-center text-xl font-black">با افزودن جزئیات بیشتر، قیمت‌های دقیق‌تری ارائه می‌شود.</h2>
            <p className="mt-5 text-center text-lg">(اختیاری)</p>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={7}
              className="mt-8 w-full resize-none rounded-lg border border-cyan-500 px-4 py-4 text-right text-lg outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="توضیحات تکمیلی خود را بنویسید"
            />
          </section>
        )}

        {currentStep === "phone" && (
          <section>
            <h2 className="text-center text-lg font-black leading-8">
              برای مطلع شدن از قیمت پیشنهادی متخصصین از طریق پیامک، اطلاعات خود را وارد نمایید.
            </h2>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-8 w-full rounded-lg border border-cyan-500 px-4 py-4 text-right text-lg outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="نام و نام خانوادگی"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={11}
              dir="ltr"
              className="mt-4 w-full rounded-lg border border-cyan-500 px-4 py-4 text-center text-lg tracking-[0.3em] outline-none focus:ring-4 focus:ring-cyan-100"
              placeholder="09*********"
            />
            <div className="mt-8 flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-500">
              <span className="text-4xl text-slate-300">🔒</span>
              <p>شماره موبایل شما پیش ما محفوظ خواهد ماند و تنها به درخواست خودتان در اختیار متخصصین قرار می‌گیرد.</p>
            </div>
          </section>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || submitting}
          className="rounded-lg border border-cyan-700 px-5 py-3 font-black text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          قبل
        </button>
        <button
          type="button"
          onClick={primaryAction}
          disabled={submitting}
          className="rounded-lg bg-[#2388bd] px-5 py-3 font-black text-white transition hover:bg-[#1677aa] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "در حال ارسال..." : currentStep === "phone" ? "دریافت کد" : "ادامه"}
        </button>
      </div>
    </div>
  );
}
