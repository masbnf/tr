# تکنولوژی‌های پروژه

هر بخش فقط بر اساس **استفاده‌ی واقعی این پروژه** از تکنولوژی نوشته شده، نه توضیح عمومی.

## Next.js 14 (App Router)

**چرا:** یک فریم‌ورک فول‌استک که صفحات (App Router)، API (Route Handlers)، و میدل‌ور را در یک پروژه با یک مدل دیپلوی (Vercel) ترکیب می‌کند — مناسب برای اپ کوچک/متوسط تک‌تیمی مثل مکانیکا که نیازی به بک‌اند جدا ندارد.

**کجا در این پروژه:**
- `src/app/**/page.tsx` → صفحات.
- `src/app/**/route.ts` → API (`GET`, `POST`, `PATCH`, `DELETE` به‌عنوان named export).
- `src/middleware.ts` → روی Edge Runtime، قبل از رسیدن request به هر صفحه‌ی `/admin/*` اجرا می‌شود.
- Dynamic segments: `[id]` در `admin/orders/[id]` و `api/requests/[id]`، `api/providers/[id]`.

**نکته‌ی عملی:** تمام صفحات فعلاً Server Component پیش‌فرض هستند مگر `"use client"` صریح بالای فایل باشد (`Navbar.tsx`, `useAuth.ts`, `useLocation.ts`). برای هر کامپوننت جدید که `useState`/`useEffect`/event handler دارد، این دایرکتیو را فراموش نکن.

## TypeScript

**چرا:** type-safety بین اسکیمای Zod، تایپ‌های Firestore، و props کامپوننت‌ها — به‌خصوص چون entityهای اصلی (Request/Provider/Payment) بین چند لایه (validator → API → Firestore → UI) رد و بدل می‌شوند.

**پیکربندی خاص این پروژه:** `strict: true` در `tsconfig.json` (یعنی `null`/`undefined` باید صریح مدیریت شوند)، alias مسیر `@/*` → `src/*` (همه‌ی importها در پروژه از این استفاده می‌کنند، نه relative path مثل `../../lib`).

## Tailwind CSS

**چرا:** استایل utility-first که با RTL به‌خوبی کار می‌کند و نیاز به نوشتن CSS جدا برای اغلب کامپوننت‌ها را حذف می‌کند.

**تم سفارشی این پروژه (`tailwind.config.ts`):**
- رنگ‌ها: `brand` (قرمز مکانیکا، `#e8002a` در ۵۰۰)، `navy` (پس‌زمینه‌ی تیره‌ی هیرو)، `accent` (نارنجی)، `surface` (خاکستری خنثی) — هر رنگ جدید UI باید از یکی از این پالت‌ها استفاده کند، نه رنگ دلخواه hex.
- گرادیان‌های آماده: `bg-hero-gradient`, `bg-card-gradient`, `bg-accent-gradient`.
- سایه‌های سفارشی: `shadow-glow-red`, `shadow-glow-orange`, `shadow-card`, `shadow-card-hover`.
- انیمیشن: `animate-fade-up`, `animate-float`, `animate-pulse-slow`.
- فونت: `font-sans` → `var(--font-vazirmatn)` (نه فونت پیش‌فرض Tailwind).

**کامپوننت‌های سفارشی در `globals.css` با `@layer components`:** مثل `.btn-primary` — قبل از نوشتن دکمه‌ی جدید، این لایه را چک کن که دوباره‌کاری نشود.

## Firebase / Firestore

**چرا:** پایگاه‌داده‌ی NoSQL بدون سرور، مناسب MVP که نیاز به scaling دستی/schema migration ندارد؛ همراه با احراز هویت و storage آماده برای فیچرهای آینده (که فعلاً استفاده نشده‌اند — فقط Firestore فعال است).

**دو نوع SDK، دو کاربرد** — توضیح کامل در [`ARCHITECTURE.md`](./ARCHITECTURE.md#اصل-کلیدی-جداسازی-کامل-client-sdk-از-admin-sdk):
- `firebase` (Client SDK) در `lib/firebase/config.ts` — فعلاً بلااستفاده، برای فیچر real-time آماده نگه داشته شده.
- `firebase-admin` در `lib/firebase/admin.ts` — تمام عملیات واقعی از اینجا رد می‌شود، با الگوی lazy-init (توضیح در ARCHITECTURE.md).

**سه Collection:** `requests`, `providers`, `payments` — بدون هیچ subcollection یا join؛ رابطه‌ی بین آن‌ها (مثلاً `assignedProvider` روی یک request) با ذخیره‌ی ID به‌عنوان string ساده مدل شده، نه reference داخلی Firestore.

**Security Rules:** فقط ایجاد `requests` عمومی است؛ همه‌چیز دیگر `false` است چون کنترل دسترسی در لایه‌ی سرور (Route Handler + middleware) انجام می‌شود.

## jose (JWT)

**چرا نه `jsonwebtoken`:** چون `middleware.ts` روی **Edge Runtime** اجرا می‌شود که Node.js API کامل (مثل `crypto` سنتی) را ندارد؛ `jose` طوری ساخته شده که با Web Crypto API سازگار و بنابراین edge-safe است. این یک تصمیم فنی محدودکننده است: هر کتابخانه‌ی رمزنگاری/JWT جدید که به کد میدل‌ور اضافه شود باید edge-compatible باشد.

**کجا:** `lib/auth.ts` (امضا/وریفای)، مصرف در `api/admin/auth/route.ts` و `middleware.ts`.

## bcryptjs

**چرا:** هش پسورد ادمین؛ نسخه‌ی pure-JS (`bcryptjs`, نه `bcrypt` نیتیو) انتخاب شده تا در محیط build/serverless بدون کامپایل native module مشکلی پیش نیاید — هماهنگ با فلسفه‌ی سازگاری serverless پروژه (مشابه دلیل انتخاب `jose`).

**کجا:** `lib/auth.ts` (`verifyAdminPassword`). فقط یک پسورد ادمین ثابت (از `ADMIN_PASSWORD_HASH`) وجود دارد، نه سیستم چند-کاربره.

## Zod + react-hook-form

**چرا:** Zod به‌عنوان تک منبع حقیقت اعتبارسنجی (هم برای Route Handler سمت سرور، هم برای فرم‌های سمت کلاینت وقتی ساخته شوند) با `@hookform/resolvers` به `react-hook-form` وصل می‌شود.

**وضعیت فعلی:** Zod schemaها (`lib/validators.ts`) کامل و در تمام Route Handlerها استفاده می‌شوند. اما **`react-hook-form` هنوز در هیچ کامپوننتی استفاده نشده** — چون فرم‌های واقعی (`request/page.tsx`, `admin/login/page.tsx`, `admin/providers/new/page.tsx`) هنوز پیاده‌سازی نشده‌اند. وقتی این فرم‌ها ساخته می‌شوند، الگوی مورد انتظار: `useForm({ resolver: zodResolver(createRequestSchema) })`.

## next/font/local — Vazirmatn خودمیزبان

**چرا self-hosted و نه Google Fonts:** حذف وابستگی به CDN خارجی (پرفورمنس + قابلیت اطمینان build)، و کنترل کامل روی فایل فونت (`Vazirmatn-Variable.woff2` با لایسنس OFL در `src/app/fonts/`). این یک تغییر معماری آگاهانه بوده (کامیت `0c7e99c` سوییچ از فونت Paeez قبلی به Vazirmatn self-hosted).

**نکته:** فونت با `weight: "100 900"` به‌عنوان variable font لود می‌شود — یعنی تمام وزن‌ها (از نازک تا خیلی ضخیم) در یک فایل هستند، بدون نیاز به چند فایل فونت جدا برای هر وزن.

## Vercel (دیپلوی)

**چرا:** یکپارچگی صفر-کانفیگ با Next.js (همان سازنده)، دیپلوی خودکار از `master`، بدون نیاز به تعریف Dockerfile یا CI جدا. هر push به `master` = یک دیپلوی پروداکشن جدید — نکته‌ی مهم عملیاتی که در `README.md` هم تاکید شده.

**نکته‌ی سازگاری:** چون Vercel در زمان build ماژول‌ها را برای جمع‌آوری اطلاعات مسیر import می‌کند، هر کد سطح-ماژول که به env varهای اختیاری وابسته است باید lazy باشد (نمونه: `lib/firebase/admin.ts`).
