# نقشه‌ی کامل ریپازیتوری

این فایل هر فایل/پوشه‌ی مهم ریپو را توضیح می‌دهد. هدف: با دیدن یک مسیر بدانی «این فایل برای چیست و کجای معماری قرار می‌گیرد».

## ریشه‌ی ریپو

```
tr/
├── .claude/launch.json        ← کانفیگ اجرای دیباگ برای Claude Code (npm run dev, پورت 3000)
├── .env.example                ← لیست کامل متغیرهای محیطی موردنیاز (بدون مقدار واقعی)
├── .eslintrc.json               ← extends: "next/core-web-vitals"
├── .gitignore
├── firestore.rules             ← Security Rules پایگاه‌داده Firestore (نگاه کن به ARCHITECTURE.md)
├── next.config.mjs             ← کانفیگ Next.js (فعلاً فقط reactStrictMode + دامنه‌ی تصاویر Firebase Storage)
├── package.json / package-lock.json
├── postcss.config.js
├── tailwind.config.ts          ← تم رنگی/فونت/انیمیشن سفارشی پروژه
├── tsconfig.json                ← alias مسیر: "@/*" → "./src/*"
├── docs/                        ← همین پوشه‌ی مستندات
├── public/images/               ← تصاویر استفاده‌شده در لندینگ (landing-hero-car.png, landing-services-showcase.png)
├── src/                         ← تمام کد اپلیکیشن (پایین توضیح داده شده)
└── [چند فایل تصویری/آرشیو در ریشه]
```

### ⚠️ فایل‌های نامرتب در ریشه‌ی ریپو

فایل‌های زیر در ریشه (نه در `public/`) قرار دارند و به‌نظر باقیمانده‌ی سشن‌های قبلی کار روی UI هستند، نه بخشی از اپلیکیشن در حال اجرا:

- `Capture.JPG`, `Capture2.JPG`, `Capture3.JPG`, `adapt.JPG`, `car.JPG`, `circle-cinematic.JPG`, `fix-car.JPG`, `logo.JPG`, `sample.JPG`, `tempJPG.JPG` — تصاویر رفرنس/اسکرین‌شات، هیچ‌کدام در کد import نمی‌شوند.
- `mechanica-app-src.zip` — آرشیو کد (احتمالاً بک‌آپ سینک قبلی، به کامیت `a5eb886` مراجعه کن).
- `gray-text-sizes.patch` — یک patch قدیمی که ظاهراً قبلاً اعمال و باید حذف/آرشیو شود.

این فایل‌ها حجم ریپو را بالا می‌برند و باعث سردرگمی می‌شوند؛ پاک‌سازی‌شان یک تغییر جدا و آگاهانه است (خارج از اسکوپ این مستندسازی) — فقط اینجا مستند شده تا فراموش نشود.

## `src/app` — مسیرها و صفحات (Next.js App Router)

هر پوشه = یک segment مسیر. `page.tsx` = صفحه، `layout.tsx` = چیدمان مشترک، `route.ts` = API endpoint.

```
src/app/
├── layout.tsx                        ← RootLayout: تگ html[dir=rtl][lang=fa]، فونت Vazirmatn، globals.css
├── globals.css                       ← پایه‌ی Tailwind + توکن‌های سفارشی (btn-primary و...)
├── page.tsx                          ← صفحه‌ی اصلی/لندینگ ("/") — کامل و پرمحتوا (426 خط)
├── fonts/
│   ├── Vazirmatn-Variable.woff2      ← فونت خودمیزبان (self-hosted) نسخه‌ی variable
│   └── Vazirmatn-OFL.txt             ← لایسنس فونت (SIL Open Font License)
│
├── request/
│   ├── page.tsx                      ← فرم ثبت درخواست ("/request") — placeholder، TODO
│   └── confirm/page.tsx              ← صفحه‌ی تایید بعد از ثبت ("/request/confirm") — استاتیک، کامل
│
├── admin/
│   ├── layout.tsx                    ← چیدمان پنل ادمین (سایدبار ناوبری)؛ گارد واقعی در middleware.ts است
│   ├── page.tsx                      ← داشبورد اصلی ادمین ("/admin") — placeholder
│   ├── login/page.tsx                ← فرم ورود ادمین ("/admin/login") — placeholder، خارج از middleware guard
│   ├── orders/page.tsx               ← لیست سفارش‌ها ("/admin/orders") — placeholder
│   ├── orders/[id]/page.tsx          ← جزئیات یک سفارش ("/admin/orders/:id") — placeholder
│   ├── providers/page.tsx            ← لیست نیروهای خدماتی ("/admin/providers") — placeholder
│   ├── providers/new/page.tsx        ← افزودن نیرو ("/admin/providers/new") — placeholder
│   └── revenue/page.tsx              ← گزارش درآمد ("/admin/revenue") — placeholder
│
└── api/                               ← Route Handlers (بک‌اند)
    ├── admin/auth/route.ts           ← POST — ورود ادمین، صدور کوکی JWT
    ├── requests/route.ts             ← POST (ثبت درخواست مشتری) / GET (لیست همه، برای ادمین)
    ├── requests/[id]/route.ts        ← GET (جزئیات) / PATCH (تغییر وضعیت + تخصیص نیرو)
    ├── providers/route.ts            ← GET (لیست) / POST (افزودن نیرو)
    ├── providers/[id]/route.ts       ← PATCH (ویرایش) / DELETE (حذف)
    └── payments/route.ts             ← POST (ثبت پرداخت + محاسبه‌ی کمیسیون) / GET (درآمد روزانه)
```

## `src/components` — کامپوننت‌های قابل استفاده مجدد

```
src/components/
├── layout/
│   ├── Navbar.tsx     ← هدر ثابت (fixed)، حالت اسکرول‌شده، منوی موبایل با drawer
│   └── Footer.tsx     ← فوتر سایت
└── ui/
    └── Icons.tsx      ← مجموعه‌ی آیکون‌های SVG اینلاین (ZapIcon, WrenchIcon, LocationIcon, ...)
```

فعلاً همه‌ی کامپوننت‌های `ui/` در یک فایل (`Icons.tsx`) هستند؛ هیچ کامپوننت فرم/دکمه/کارت مشترکی هنوز استخراج نشده — فرم‌ها و صفحات ادمین از JSX/کلاس Tailwind درجا استفاده می‌کنند.

## `src/lib` — منطق سمت سرور و یوتیلیتی‌ها

```
src/lib/
├── auth.ts                 ← تولید/اعتبارسنجی JWT ادمین (jose) + مقایسه‌ی پسورد (bcryptjs)
├── commission.ts            ← محاسبه‌ی کمیسیون و سهم نیروی خدماتی
├── maps.ts                  ← ساخت لینک گوگل‌مپس از lat/lng (بدون SDK نقشه، فقط URL)
├── validators.ts            ← اسکیماهای Zod برای هر سه فرم اصلی (request/provider/payment)
└── firebase/
    ├── config.ts             ← Firebase Client SDK (برای کد سمت مرورگر)
    ├── admin.ts               ← Firebase Admin SDK با lazy-init proxy (برای Route Handlerها)
    ├── requests.ts            ← CRUD روی collection «requests»
    ├── providers.ts           ← CRUD روی collection «providers»
    └── payments.ts            ← ثبت پرداخت + محاسبه‌ی درآمد روزانه، روی collection «payments»
```

## `src/hooks`, `src/constants`, `src/types`

```
src/hooks/
├── useAuth.ts        ← چک وجود کوکی admin_token در کلاینت (client component)
└── useLocation.ts    ← wrapper روی navigator.geolocation

src/constants/
├── services.ts        ← SERVICE_OPTIONS: لیست ۴ نوع خدمت با لیبل فارسی + ایموجی
└── status.ts           ← STATUS_CONFIG: رنگ/لیبل هر OrderStatus برای UI

src/types/
├── enums.ts            ← ServiceType, OrderStatus
├── request.ts           ← ServiceRequest, CreateRequestInput
├── provider.ts          ← Provider, CreateProviderInput
└── payment.ts            ← Payment, CreatePaymentInput
```

## `src/middleware.ts`

میدل‌ور سراسری Next.js؛ فقط روی مسیرهای `/admin/*` (به‌جز `/admin/login`) اجرا می‌شود؛ توکن کوکی `admin_token` را با `verifyAdminToken` چک می‌کند و در صورت نامعتبر بودن، ریدایرکت به `/admin/login`.

## نقشه‌ی سریع «برای فلان کار کجا برم؟»

| می‌خوام... | فایل |
|---|---|
| متن/بخش لندینگ رو تغییر بدم | `src/app/page.tsx` |
| هدر/فوتر رو تغییر بدم | `src/components/layout/Navbar.tsx` / `Footer.tsx` |
| فرم ثبت درخواست رو بسازم | `src/app/request/page.tsx` (+ `lib/validators.ts`, `hooks/useLocation.ts`) |
| منطق کمیسیون رو تغییر بدم | `src/lib/commission.ts` |
| یک endpoint جدید اضافه کنم | پوشه‌ی جدید در `src/app/api/.../route.ts` |
| نوع خدمت جدید اضافه کنم | `src/types/enums.ts` (ServiceType) + `src/constants/services.ts` |
| قوانین امنیتی Firestore رو تغییر بدم | `firestore.rules` |
| رنگ/فونت/تم رو تغییر بدم | `tailwind.config.ts` + `src/app/globals.css` |
