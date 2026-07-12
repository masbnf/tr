# واژه‌نامه‌ی پروژه

اصطلاحات این پروژه، با تعریف بر اساس کد واقعی (نه تعریف عمومی).

| اصطلاح | تعریف در این پروژه |
|---|---|
| **مکانیکا (Mechanica)** | نام محصول/برند؛ ظاهر می‌شود در `<title>` (`layout.tsx`) و لوگوی متنی Navbar. |
| **Request / درخواست** | سند در collection `requests`؛ تایپ آن `ServiceRequest` (`src/types/request.ts`). یک درخواست خدمات از یک مشتری. |
| **Provider / نیروی خدماتی** | سند در collection `providers`؛ تایپ آن `Provider`. یک متخصص/نیروی اعزامی که به درخواست‌ها تخصیص می‌یابد. |
| **Payment / پرداخت** | سند در collection `payments`؛ تایپ آن `Payment`. رکورد یک تسویه‌حساب، شامل `commission` محاسبه‌شده. |
| **ServiceType** | Enum در `src/types/enums.ts` با ۴ مقدار: `MECHANIC` (مکانیک سیار)، `BATTERY` (باتری)، `TOW` (یدک‌کش)، `OIL_CHANGE` (تعویض روغن). این تنها enum معتبر برای اعتبارسنجی/دیتابیس است (نه ۱۰ آیتم `SERVICE_HOTSPOTS` در لندینگ). |
| **OrderStatus** | Enum در `src/types/enums.ts` با ۵ مقدار: `PENDING` (در حال بررسی) → `ASSIGNED` (تخصیص یافته) → `ON_THE_WAY` (در راه) → `COMPLETED` (انجام شد)، یا در هر مرحله `CANCELLED` (لغو شد). این ترتیب چرخه‌ی عمر یک درخواست است. |
| **Commission / کمیسیون** | سهم پلتفرم مکانیکا از هر تراکنش؛ نرخ پیش‌فرض ۱۵٪ (`COMMISSION_RATE`)، محاسبه در `lib/commission.ts`. |
| **Provider Payout** | سهم نیروی خدماتی = `totalPrice - commission` (`calcProviderPayout`). |
| **admin_token** | نام کوکی httpOnly حامل JWT ادمین؛ صادرشده توسط `POST /api/admin/auth`، چک‌شده توسط `middleware.ts` برای هر مسیر `/admin/*`. |
| **adminDb** | export شده از `lib/firebase/admin.ts`؛ نمونه‌ی Firestore از طریق Admin SDK، با init تنبل (lazy). تمام دسترسی واقعی به داده از این عبور می‌کند. |
| **db** | export شده از `lib/firebase/config.ts`؛ نمونه‌ی Firestore از طریق Client SDK. فعلاً در کد مصرف نمی‌شود (زیرساخت آماده برای فیچر real-time). |
| **SERVICE_OPTIONS** | ثابت در `src/constants/services.ts`؛ نسخه‌ی UI-ready از `ServiceType` (۴ آیتم، با لیبل فارسی و ایموجی) برای رندر در فرم‌ها. |
| **SERVICE_HOTSPOTS** | آرایه‌ی محلی در `src/app/page.tsx` (لندینگ)؛ ۱۰ سرویس نمایشی روی تصویر با مختصات درصدی (`x`, `y`) برای موقعیت نقطه‌ی کلیک‌پذیر. **هماهنگ با `ServiceType` نیست** — به [`MODULES.md`](./MODULES.md#️-ناهماهنگی-شناخته‌شده) مراجعه کن. |
| **STATUS_CONFIG** | ثابت در `src/constants/status.ts`؛ نگاشت هر `OrderStatus` به `{ label, color }` برای بج‌های وضعیت در UI ادمین. |
| **RTL** | Right-to-Left؛ جهت‌ چیدمان صفحه، تنظیم‌شده با `dir="rtl"` روی تگ `<html>` در `layout.tsx`. تمام صفحات پروژه RTL هستند (بدون حالت LTR جایگزین). |
| **Lazy-init proxy** | الگوی استفاده‌شده در `lib/firebase/admin.ts` برای به‌تعویق‌انداختن اتصال واقعی به Firebase تا اولین استفاده، تا `next build` بدون env varهای اختیاری خراب نشود. توضیح کامل در [`ARCHITECTURE.md`](./ARCHITECTURE.md). |
| **Edge Runtime** | محیط اجرای سبک‌تر Next.js که `middleware.ts` روی آن اجرا می‌شود؛ بدون Node.js API کامل — دلیل انتخاب `jose` به‌جای `jsonwebtoken`. |
| **Route Handler** | فایل `route.ts` در App Router که named exportهای `GET`/`POST`/`PATCH`/`DELETE` را به‌عنوان API endpoint expose می‌کند. |
