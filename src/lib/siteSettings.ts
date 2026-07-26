export type SiteNavLink = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
};

export type VehicleId = "car" | "motorcycle" | "bicycle";

export type ServiceTag = {
  id: string;
  vehicle: VehicleId;
  label: string;
  href: string;
  color: string;
  enabled: boolean;
  x?: number;
  y?: number;
};

export type RequestFormTexts = {
  badge: string;
  title: string;
  intro: string;
  serviceTitle: string;
  serviceDescription: string;
  vehicleTitle: string;
  vehiclePlaceholder: string;
  detailsTitle: string;
  detailsDescription: string;
  scheduleTitle: string;
  neighborhoodTitle: string;
  neighborhoodPlaceholder: string;
  imagesTitle: string;
  imageUploadLabel: string;
  notesTitle: string;
  notesPlaceholder: string;
  contactTitle: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  selectedServiceLabel: string;
  submitLabel: string;
  submitLoadingLabel: string;
  privacyNote: string;
  dateOptionsCsv: string;
  timeOptionsCsv: string;
};

export type RequestServiceCopy = {
  summary: string;
  lead: string;
  vehiclePlaceholder: string;
  detailsCsv: string;
  notesPlaceholder: string;
};

export type SiteSettings = {
  siteName: string;
  phone: string;
  navLinks: SiteNavLink[];
  serviceTags: ServiceTag[];
  requestFormTexts: RequestFormTexts;
  requestServiceCopies: Record<string, RequestServiceCopy>;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "مکانیکا",
  phone: "+98",
  navLinks: [
    { id: "home", label: "خانه", href: "/", enabled: true },
    { id: "services", label: "خدمات", href: "/#services", enabled: true },
    { id: "how", label: "نحوه کار", href: "/#how", enabled: true },
    { id: "phone", label: "تماس با ما", href: "tel:+98", enabled: true },
  ],
  serviceTags: [
    { id: "car-engine", vehicle: "car", label: "تعمیر موتور", href: "/request?service=engine-repair", x: 50.1, y: 16.3, color: "#ef4444", enabled: true },
    { id: "car-tire", vehicle: "car", label: "تایر", href: "/request?service=tire", x: 72.4, y: 22.6, color: "#a855f7", enabled: true },
    { id: "car-wash", vehicle: "car", label: "کارواش", href: "/request?service=car-wash", x: 86.8, y: 38.1, color: "#22d3ee", enabled: true },
    { id: "car-electrical", vehicle: "car", label: "برق‌کشی", href: "/request?service=electrical", x: 88.4, y: 61.0, color: "#eab308", enabled: true },
    { id: "car-lights", vehicle: "car", label: "چراغ‌ها", href: "/request?service=lights", x: 74.2, y: 74.8, color: "#f97316", enabled: true },
    { id: "car-brakes", vehicle: "car", label: "لنت ترمز", href: "/request?service=brake-pads", x: 50.1, y: 82.4, color: "#ef4444", enabled: true },
    { id: "car-fuel", vehicle: "car", label: "بنزین", href: "/request?service=fuel-delivery", x: 26.2, y: 74.8, color: "#10b981", enabled: true },
    { id: "car-battery", vehicle: "car", label: "باتری", href: "/request?service=battery", x: 11.8, y: 61.0, color: "#6366f1", enabled: true },
    { id: "car-paint", vehicle: "car", label: "رنگ خودرو", href: "/request?service=paint", x: 13.4, y: 38.1, color: "#ec4899", enabled: true },
    { id: "car-oil", vehicle: "car", label: "تعویض روغن", href: "/request?service=oil-change", x: 27.8, y: 22.6, color: "#84cc16", enabled: true },
    { id: "motor-engine", vehicle: "motorcycle", label: "تعمیر موتور", href: "/request?vehicle=motorcycle&service=engine-repair", color: "#ef4444", enabled: true },
    { id: "motor-oil", vehicle: "motorcycle", label: "تعویض روغن", href: "/request?vehicle=motorcycle&service=oil-change", color: "#84cc16", enabled: true },
    { id: "motor-battery", vehicle: "motorcycle", label: "باتری", href: "/request?vehicle=motorcycle&service=battery", color: "#6366f1", enabled: true },
    { id: "motor-electrical", vehicle: "motorcycle", label: "برق‌کشی", href: "/request?vehicle=motorcycle&service=electrical", color: "#eab308", enabled: true },
    { id: "motor-tire", vehicle: "motorcycle", label: "لاستیک", href: "/request?vehicle=motorcycle&service=tire", color: "#a855f7", enabled: true },
    { id: "motor-brakes", vehicle: "motorcycle", label: "ترمز", href: "/request?vehicle=motorcycle&service=brakes", color: "#22d3ee", enabled: true },
    { id: "motor-chain", vehicle: "motorcycle", label: "زنجیر و دنده", href: "/request?vehicle=motorcycle&service=chain", color: "#f97316", enabled: true },
    { id: "motor-transport", vehicle: "motorcycle", label: "امداد و حمل", href: "/request?vehicle=motorcycle&service=transport", color: "#10b981", enabled: true },
    { id: "bike-puncture", vehicle: "bicycle", label: "پنچرگیری", href: "/request?vehicle=bicycle&service=puncture", color: "#ef4444", enabled: true },
    { id: "bike-tube", vehicle: "bicycle", label: "تعویض تیوب", href: "/request?vehicle=bicycle&service=inner-tube", color: "#84cc16", enabled: true },
    { id: "bike-brakes", vehicle: "bicycle", label: "تنظیم ترمز", href: "/request?vehicle=bicycle&service=brakes", color: "#22d3ee", enabled: true },
    { id: "bike-gears", vehicle: "bicycle", label: "تنظیم دنده", href: "/request?vehicle=bicycle&service=gears", color: "#eab308", enabled: true },
    { id: "bike-chain", vehicle: "bicycle", label: "تعمیر زنجیر", href: "/request?vehicle=bicycle&service=chain", color: "#f97316", enabled: true },
    { id: "bike-wheel", vehicle: "bicycle", label: "تنظیم چرخ", href: "/request?vehicle=bicycle&service=wheel", color: "#a855f7", enabled: true },
    { id: "bike-full", vehicle: "bicycle", label: "سرویس کامل", href: "/request?vehicle=bicycle&service=full-service", color: "#10b981", enabled: true },
    { id: "bike-transport", vehicle: "bicycle", label: "حمل دوچرخه", href: "/request?vehicle=bicycle&service=transport", color: "#6366f1", enabled: true },
  ],
  requestFormTexts: {
    badge: "درخواست سرویس",
    title: "فرم درخواست خدمات خودرو",
    intro: "اطلاعات خودرو، سرویس مورد نیاز، زمان و محدوده اعزام را وارد کن تا درخواست دقیق‌تر ثبت شود.",
    serviceTitle: "نوع سرویس",
    serviceDescription: "سرویس‌هایی که در پنل مدیریت فعال باشند، اینجا نمایش داده می‌شوند.",
    vehicleTitle: "مشخصات خودرو",
    vehiclePlaceholder: "مثلا پژو ۲۰۶ مدل ۱۳۹۸",
    detailsTitle: "جزئیات سرویس",
    detailsDescription: "موارد مرتبط با خدمت انتخاب‌شده را مشخص کنید.",
    scheduleTitle: "زمان مراجعه",
    neighborhoodTitle: "محدوده اعزام",
    neighborhoodPlaceholder: "جستجوی محله در شیراز",
    imagesTitle: "تصاویر",
    imageUploadLabel: "افزودن تصویر اختیاری",
    notesTitle: "توضیحات تکمیلی",
    notesPlaceholder: "توضیحات تکمیلی خود را بنویسید",
    contactTitle: "اطلاعات تماس",
    namePlaceholder: "نام و نام خانوادگی",
    phonePlaceholder: "09*********",
    selectedServiceLabel: "سرویس انتخابی",
    submitLabel: "ثبت درخواست",
    submitLoadingLabel: "در حال ارسال...",
    privacyNote: "شماره موبایل شما فقط برای پیگیری همین درخواست استفاده می‌شود.",
    dateOptionsCsv: "امروز|اولین زمان آزاد\nفردا|نوبت بعدی\nهماهنگی|تماس برای زمان",
    timeOptionsCsv: "از ۹ تا ۱۲ صبح\nاز ۱۲ تا ۱۶ ظهر\nاز ۱۶ تا ۲۰ عصر\nتوافق با متخصص",
  },
  requestServiceCopies: {},
};

const STORAGE_KEY = "mechanica.siteSettings";

export function loadSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SITE_SETTINGS;

    const parsed = JSON.parse(stored) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      navLinks: Array.isArray(parsed.navLinks) ? parsed.navLinks : DEFAULT_SITE_SETTINGS.navLinks,
      serviceTags: Array.isArray(parsed.serviceTags) ? parsed.serviceTags : DEFAULT_SITE_SETTINGS.serviceTags,
      requestFormTexts: {
        ...DEFAULT_SITE_SETTINGS.requestFormTexts,
        ...(parsed.requestFormTexts ?? {}),
      },
      requestServiceCopies: {
        ...DEFAULT_SITE_SETTINGS.requestServiceCopies,
        ...(parsed.requestServiceCopies ?? {}),
      },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("mechanica:site-settings", { detail: settings }));
}
