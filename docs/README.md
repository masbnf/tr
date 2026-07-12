# مکانیکا (Mechanica) — مستندات پروژه

این پوشه، مرجع زنده‌ی پروژه‌ی **مکانیکا** است: یک اپلیکیشن وب برای درخواست آنلاین خدمات خودرو سیار (مکانیک، باتری، یدک‌کش، تعویض روغن) در شیراز. زبان اصلی رابط کاربری **فارسی** و جهت صفحه **RTL** است.

> این مستندات بر پایه‌ی کد واقعی ریپو (`masbnf/tr`, برنچ `master`) نوشته شده و باید هر بار که کد تغییر مهمی می‌کند، به‌روزرسانی شود. فایل مرجع برای شروع مطالعه همین فایل است.

## پروژه در یک نگاه

| | |
|---|---|
| **نام** | مکانیکا (Mechanica) |
| **دامنه‌ی کسب‌وکار** | خدمات خودرو سیار، درخواست آنلاین + پنل مدیریت سفارش/نیرو/درآمد |
| **بازار هدف** | شیراز |
| **فریم‌ورک** | Next.js 14 (App Router) + TypeScript |
| **پایگاه داده** | Firebase / Firestore |
| **احراز هویت ادمین** | JWT (کتابخانه‌ی `jose`) + کوکی httpOnly + میدل‌ور مسیر `/admin` |
| **استایل** | Tailwind CSS با تم رنگی سفارشی (brand/navy/accent) |
| **فونت** | Vazirmatn، خودمیزبان (self-hosted) از طریق `next/font/local` |
| **دیپلوی** | Vercel، دیپلوی خودکار از برنچ `master` گیت‌هاب |
| **ریپو** | `https://github.com/masbnf/tr` |

## شروع سریع (Local Development)

```bash
npm install
cp .env.example .env.local   # مقادیر واقعی Firebase/Maps/JWT را پر کن
npm run dev                  # http://localhost:3000
```

اسکریپت‌های موجود در `package.json`:

| دستور | کاربرد |
|---|---|
| `npm run dev` | اجرای سرور توسعه Next.js |
| `npm run build` | بیلد پروداکشن |
| `npm run start` | اجرای بیلد پروداکشن |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |

⚠️ در حال حاضر تست خودکار (unit/e2e) در پروژه تعریف نشده است.

### متغیرهای محیطی

تمام متغیرهای مورد نیاز در `.env.example` (در ریشه‌ی ریپو) لیست شده‌اند: کلیدهای Firebase Client (`NEXT_PUBLIC_FIREBASE_*`)، Firebase Admin (`FIREBASE_ADMIN_*`)، `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`، `ADMIN_PASSWORD_HASH`، `JWT_SECRET`، `COMMISSION_RATE`. جزئیات هرکدام در [`TECHNOLOGIES.md`](./TECHNOLOGIES.md) و [`ARCHITECTURE.md`](./ARCHITECTURE.md) توضیح داده شده.

هیچ‌کدام از این مقادیر نباید در کد یا این مستندات hardcode یا commit شوند.

## وضعیت فعلی پروژه (Snapshot)

این بخش را هر بار که پیشرفت مهمی رخ داد به‌روز کن. آخرین بررسی: ۲۰۲۶-۰۷-۱۲ (بر پایه‌ی کامیت `0c7e99c` + تغییرات اعمال‌شده در sandbox، هنوز commit/push نشده).

🟡 **وضعیت امنیتی:**
- آسیب‌پذیری critical (CVE-2025-29927، Authorization Bypass in Next.js Middleware) با آپدیت `next` به `14.2.35` بسته شد؛ Next.js 14 اما EOL است و چند آسیب‌پذیری high دیگر فقط با مهاجرت به ۱۵/۱۶ رفع می‌شوند (کار جدا).
- PII مشتریان در `GET/PATCH /api/requests*` که کاملاً بدون احراز هویت در دسترس بود، بسته شد (`middleware.ts` مسیرهای `/api/*` را پوشش نمی‌دهد). **همین شکاف روی `api/providers/*` و `api/payments` هنوز باز است.**
- جزئیات کامل هر دو در [`ROADMAP.md`](./ROADMAP.md#-اولویت-فوری--امنیت).

**کامل و کارکردی:**
- صفحه‌ی لندینگ (`src/app/page.tsx`) — هیرو، بخش خدمات، بخش «نحوه کار»، فوتر — نسخه‌ی دسکتاپ و موبایل مجزا.
- Navbar و Footer با پشتیبانی موبایل/دسکتاپ.
- **فرم ثبت درخواست (`/request`)** — `RequestForm` با `react-hook-form` + `zodResolver`، انتخاب نوع خدمت، دریافت موقعیت مکانی (`useLocation`)، ثبت در Firestore، بازخورد خطا با `react-hot-toast`.
- **لاگین و داشبورد ادمین (`/admin/login`, `/admin`)** — فرم ورود واقعی، جدول سفارش‌ها با تغییر وضعیت زنده (`OrdersTable`)، دکمه‌ی خروج. Route Handlerهای پشتش (`api/requests*`) حالا admin-only هستند.
- تمام API routeها (`/api/requests`, `/api/providers`, `/api/payments`, `/api/admin/auth`) با اعتبارسنجی Zod.
- منطق محاسبه‌ی کمیسیون (`lib/commission.ts`).
- لایه‌ی دسترسی به Firestore (`lib/firebase/*`) برای requests/providers/payments.
- میدل‌ور احراز هویت ادمین برای مسیرهای `/admin/*`.
- Firestore Security Rules (`firestore.rules`) — تمام نوشتن/خواندن‌های حساس فقط سمت سرور.

**ناقص / placeholder (نیاز به کار آینده):**
- `src/app/admin/orders/page.tsx`, `orders/[id]/page.tsx` — از سایدبار لینک نمی‌شوند؛ نیاز به تصمیم قبل از پیاده‌سازی (به [`ROADMAP.md`](./ROADMAP.md) مراجعه کن).
- `src/app/admin/providers/page.tsx`, `providers/new/page.tsx`, `revenue/page.tsx` — همچنان placeholder، به API واقعی وصل نیستند.
- ناهماهنگی داده‌ای جزئاً حل‌شده: فرم `/request` فقط دو اسلاگ بدون‌ابهام لندینگ (`battery`, `oil-change`) را pre-select می‌کند؛ ۸ اسلاگ دیگر `SERVICE_HOTSPOTS` هنوز به `ServiceType` نگاشت نشده‌اند (تصمیم محصولی حل‌نشده) — به [`MODULES.md`](./MODULES.md#srcapppagetsx-صفحه-لندینگ) مراجعه کن.


## نقشه‌ی مستندات

| فایل | محتوا |
|---|---|
| [`PROJECT_MAP.md`](./PROJECT_MAP.md) | ساختار کامل پوشه‌ها و فایل‌ها با توضیح هرکدام |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | معماری کلی، جریان داده، دیاگرام‌های Mermaid |
| [`MODULES.md`](./MODULES.md) | توضیح ماژول‌به‌ماژول کد (ورودی/خروجی/وابستگی) |
| [`TECHNOLOGIES.md`](./TECHNOLOGIES.md) | چرا و چطور هر تکنولوژی در این پروژه استفاده شده |
| [`GLOSSARY.md`](./GLOSSARY.md) | واژه‌نامه‌ی اصطلاحات این پروژه |
| [`CHANGELOG.md`](./CHANGELOG.md) | تاریخچه‌ی واقعی تغییرات، برگرفته از `git log` |
| [`DECISIONS.md`](./DECISIONS.md) | چرا هر تصمیم معماری مهم گرفته شد (ADR) |
| [`DEBUGGING.md`](./DEBUGGING.md) | باگ‌های رفع‌شده + مسائل شناخته‌شده‌ی فعلی |
| [`ROADMAP.md`](./ROADMAP.md) | کارهای باقی‌مانده، اولویت‌بندی‌شده (شامل یک یافته‌ی امنیتی فوری) |
| [`KNOWLEDGE_GRAPH.md`](./KNOWLEDGE_GRAPH.md) | گراف وابستگی داخلی ماژول‌ها |
| [`CODE_READING_GUIDE.md`](./CODE_READING_GUIDE.md) | ترتیب پیشنهادی خواندن کد پروژه |
| [`LEARNING_PATH.md`](./LEARNING_PATH.md) | ۱۰ سطح یادگیری تدریجی روی همین پروژه |
| [`FAQ.md`](./FAQ.md) | سوالات متداول درباره‌ی تصمیمات/رفتار کد |
| [`SANDBOX.md`](./SANDBOX.md) | آزمایش‌های امن قبل از تغییر کد واقعی |
| [`AI_JOURNAL.md`](./AI_JOURNAL.md) | ژورنال سشن‌های کاری Claude روی این ریپو |

هر ۱۶ فایل بالا کامل ساخته شده‌اند. هر بار که کد تغییر مهمی کرد، فایل مرتبط را به‌روز کن — نه کل مجموعه را.

## قواعد کاری این پروژه (خلاصه)

- معماری و سبک کد فعلی حفظ شود؛ از کامپوننت/یوتیل موجود دوباره استفاده شود.
- بدون دلیل قوی، وابستگی جدید اضافه نشود.
- محتوای placeholder یا تصویر جایگزین استفاده نشود.
- لایه‌ی RTL و رندر صحیح فارسی حفظ شود؛ فونت اصلی Vazirmatn (self-hosted) است.
- هیچ secret/کلید API/اعتبارنامه‌ی Firebase در کد commit نشود.
- Firebase Admin باید lazy init باشد تا بیلد سمت Vercel بدون env varهای اختیاری fail نکند (الگوی موجود در `lib/firebase/admin.ts`).
- گردش‌کار معمول: تغییر در کلون sandbox → خروجی فایل کامل یا patch → اعمال محلی توسط توسعه‌دهنده → push به `master` → دیپلوی خودکار Vercel.
