# مسیر یادگیری تدریجی

۱۰ سطح، هرکدام با خلاصه، سوال مرور، و تمرین روی **فایل‌های واقعی همین پروژه**. فرض: صفر تا صد را از همین پروژه یاد می‌گیری، نه مثال‌های انتزاعی.

## سطح ۱ — نمای کلی ریپو

**بخوان:** [`README.md`](./README.md)
**خلاصه:** مکانیکا یک اپ Next.js تک‌ریپو با فرانت + بک‌اند + دیتابیس Firebase است که خدمات خودرو سیار در شیراز را واسطه‌گری می‌کند.
**سوال مرور:** چرا در حال حاضر تست خودکار در پروژه وجود ندارد و این چه ریسکی ایجاد می‌کند؟
**تمرین:** `npm install && npm run dev` را اجرا کن و صفحه‌ی اصلی را در `http://localhost:3000` باز کن.
**بعدی:** سطح ۲.

## سطح ۲ — ساختار پوشه‌ها

**بخوان:** [`PROJECT_MAP.md`](./PROJECT_MAP.md)
**خلاصه:** `src/app` مسیرها را تعریف می‌کند (فایل‌محور)، `src/lib` منطق سرور، `src/components` UI قابل‌استفاده مجدد، `src/types`/`constants` مدل داده.
**سوال مرور:** چه فرقی بین `src/constants/` و داده‌ی محلی داخل `page.tsx` (مثل `STEPS`) هست؟ (جواب در [`DECISIONS.md`](./DECISIONS.md#تصمیم-داده‌ی-ui-محلی-به‌جای-مرکزی-برای-محتوای-صرفاً-نمایشی))
**تمرین:** بدون باز کردن فایل، حدس بزن مسیر فایلی که منطق محاسبه‌ی کمیسیون در آن است کجاست؛ بعد چک کن درست حدس زدی.

## سطح ۳ — معماری

**بخوان:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)
**خلاصه:** جداسازی Client SDK/Admin SDK فایربیس، الگوی lazy-init، جریان auth با JWT+middleware، RTL.
**سوال مرور:** چرا Firestore Rules همه‌چیز غیر از `create` روی `requests` را می‌بندد، و کنترل دسترسی واقعی کجا اتفاق می‌افتد؟
**تمرین:** دیاگرام «جریان احراز هویت ادمین» را روی کاغذ بدون نگاه کردن به فایل از حفظ بکش، بعد مقایسه کن.

## سطح ۴ — کامپوننت‌ها

**بخوان:** بخش «Components» در [`MODULES.md`](./MODULES.md#srccomponentslayoutnavbartsx)، سپس خود `Navbar.tsx`.
**خلاصه:** فقط دو کامپوننت layout (`Navbar`, `Footer`) و یک فایل آیکون وجود دارد؛ فرم‌ها/کارت‌های ادمین هنوز به کامپوننت مشترک استخراج نشده‌اند.
**سوال مرور:** `Navbar` چرا `"use client"` دارد ولی `Footer` ندارد؟
**تمرین (Beginner):** یک لینک جدید غیرفعال (مثلاً «درباره ما») به `NAV_LINKS` در `Navbar.tsx` اضافه کن و ببین در منوی موبایل و دسکتاپ هر دو ظاهر می‌شود.

## سطح ۵ — مدیریت state (سمت کلاینت)

**بخوان:** `src/hooks/useAuth.ts`, `src/hooks/useLocation.ts`، و state داخل `Navbar.tsx` (`open`, `scrolled`).
**خلاصه:** پروژه از state management خارجی (Redux/Zustand) استفاده نمی‌کند؛ فقط `useState`/`useEffect` محلی و هوک‌های سفارشی کوچک.
**سوال مرور:** چرا `useAuth` را نباید به‌عنوان تنها لایه‌ی امنیتی در نظر گرفت؟ (جواب: [`MODULES.md`](./MODULES.md#srchooksuseauthts))
**تمرین (Intermediate):** یک کامپوننت client کوچک بساز که `useLocation` را صدا بزند و مختصات را روی صفحه چاپ کند (فقط برای تمرین، خارج از مسیر اصلی commit نکن مگر بخشی از کار واقعی `request/page.tsx` باشد).

## سطح ۶ — لایه‌ی سرویس (`lib/`)

**بخوان:** `src/lib/commission.ts`, `src/lib/validators.ts`, `src/lib/firebase/*`.
**خلاصه:** توابع pure (commission, maps) جدا از توابع I/O (firebase/*) جدا از توابع اعتبارسنجی (validators)؛ هر لایه مسئولیت مشخص دارد.
**سوال مرور:** چرا `logPayment` کمیسیون را در لحظه‌ی ذخیره محاسبه می‌کند نه بعداً موقع نمایش؟
**تمرین (Intermediate):** یک تابع جدید `calcCommissionRange(min, max)` در `commission.ts` بنویس که بازه‌ی کمیسیون را برای یک محدوده قیمتی برمی‌گرداند (فقط تمرین محلی، تست با `tsc --noEmit`).

## سطح ۷ — API (Route Handlers)

**بخوان:** هر ۶ فایل `route.ts` (ترتیب پیشنهادی در [`CODE_READING_GUIDE.md`](./CODE_READING_GUIDE.md#قدم-۵--api-نقطه‌ای-که-همه‌چیز-به‌هم-می‌رسد)).
**خلاصه:** الگوی مشترک: `safeParse` → تابع `lib/firebase/*` → پاسخ JSON فارسی.
**سوال مرور:** کدام Route Handler از این الگو منحرف شده و چرا این یک بدهی فنی کوچک است؟
**تمرین (Advanced):** یک endpoint جدید `GET /api/providers/[id]` (دریافت یک نیروی خدماتی با ID) بساز، دقیقاً با همان الگوی error handling بقیه‌ی فایل‌ها.

## سطح ۸ — دیتابیس (Firestore)

**بخوان:** `firestore.rules`، `src/lib/firebase/admin.ts`، بخش «اصل کلیدی» در [`ARCHITECTURE.md`](./ARCHITECTURE.md#اصل-کلیدی-جداسازی-کامل-client-sdk-از-admin-sdk).
**خلاصه:** سه collection بدون subcollection؛ رابطه‌ها با ID ساده (نه reference) مدل شده‌اند.
**سوال مرور:** اگر بخواهی مطمئن شوی `assignedProvider` همیشه به یک provider واقعی اشاره می‌کند، این چک را کجا باید اضافه کنی؟
**تمرین (Advanced):** یک تابع `getRequestsByProvider(providerId)` در `lib/firebase/requests.ts` بنویس که با `where("assignedProvider", "==", providerId)` فیلتر کند.

## سطح ۹ — دیپلوی

**بخوان:** بخش «دیپلوی» در [`ARCHITECTURE.md`](./ARCHITECTURE.md#دیپلوی)، و [`DEBUGGING.md`](./DEBUGGING.md#خرابی-بیلد-vercel-به-دلیل-init-فوری-firebase-admin).
**خلاصه:** Vercel مستقیم از `master` دیپلوی می‌کند؛ هیچ CI جدا نیست؛ باگ واقعی گذشته (init فوری Firebase Admin) نمونه‌ی خوبی از ریسک این مدل است.
**سوال مرور:** چرا این باگ فقط روی Vercel رخ می‌داد و نه در `npm run dev` محلی؟
**تمرین (Expert):** با مخفی‌کردن موقت `.env.local`، `npm run build` را اجرا کن و ببین آیا بیلد همچنان موفق است (باید باشد، چون باگ رفع شده — این یعنی regression test دستی همان چیزی است که کامیت `c35de6f` هم برای تایید رفع باگ انجام داد).

## سطح ۱۰ — معماری پروداکشن و گام بعدی

**بخوان:** [`ROADMAP.md`](./ROADMAP.md) کامل.
**خلاصه:** فاصله‌ی بین «چیزی که ساخته شده» (API کامل) و «چیزی که کاربر می‌بیند» (اکثر صفحات placeholder) بزرگ‌ترین شکاف فعلی پروژه است.
**سوال مرور:** اگر قرار بود فقط یک آیتم از Roadmap را همین امروز پیاده‌سازی کنی، کدام را انتخاب می‌کردی و چرا؟
**تمرین نهایی (Expert):** یکی از آیتم‌های «اولویت بالا» در ROADMAP.md را کامل پیاده‌سازی کن (پیشنهاد: `request/page.tsx` چون تمام زیرساختش — schema، هوک، constants — از قبل آماده است) و بعد یک ورودی جدید به `CHANGELOG.md` طبق فرمت موجود اضافه کن.
