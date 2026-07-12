# سوالات متداول (FAQ)

## چرا خیلی از صفحات فقط «در حال ساخت...» نشان می‌دهند؟

چون این‌ها عمداً placeholder هستند، نه باگ. لایه‌ی API/دیتابیس (`lib/`, `api/`) کاملاً کاری است؛ فقط UI متصل به آن هنوز نوشته نشده. لیست کامل در [`README.md`](./README.md#وضعیت-فعلی-پروژه-snapshot) و [`ROADMAP.md`](./ROADMAP.md).

## چرا دو تا Firebase SDK داریم (`firebase` و `firebase-admin`)؟

یکی برای کد سمت مرورگر (`firebase`، در `lib/firebase/config.ts`، فعلاً بلااستفاده) و یکی برای Route Handlerهای سمت سرور (`firebase-admin`، در `lib/firebase/admin.ts`، تمام عملیات فعلی از اینجا رد می‌شود). توضیح کامل در [`ARCHITECTURE.md`](./ARCHITECTURE.md#اصل-کلیدی-جداسازی-کامل-client-sdk-از-admin-sdk).

## چرا `adminDb` مستقیم `initializeApp` صدا نمی‌زند؟

چون این باعث خرابی بیلد Vercel می‌شد (چون secretها موقع بیلد هنوز ست نشده بودند). به‌جایش یک `Proxy` تنبل استفاده شده. جزئیات کامل در [`DEBUGGING.md`](./DEBUGGING.md#خرابی-بیلد-vercel-به-دلیل-init-فوری-firebase-admin).

## چرا فونت پروژه Vazirmatn است نه BYekan که در دستورالعمل‌ها اومده؟

چون تاریخچه‌ی واقعی کد سه بار فونت عوض کرده (BYekan CDN → Paeez self-hosted → Vazirmatn self-hosted) و آخرین تصمیم Vazirmatn بوده. این یک ناهماهنگی شناخته‌شده بین دستورالعمل فعلی پروژه و وضعیت واقعی کد است — به [`DECISIONS.md`](./DECISIONS.md#تصمیم-انتخاب-فونت-فارسی) مراجعه کن قبل از تصمیم به تغییر دوباره.

## چرا `SERVICE_HOTSPOTS` روی لندینگ با enum واقعی `ServiceType` فرق دارد؟

لندینگ ۱۰ سرویس نمایشی دارد (برای جذابیت بصری بخش هیرو)، اما دیتابیس/اعتبارسنجی فقط ۴ نوع سرویس واقعی پشتیبانی می‌کند. این هنوز هماهنگ نشده — تصمیم لازم در [`ROADMAP.md`](./ROADMAP.md#اولویت-بالا--تکمیل-مسیر-اصلی-کسب‌وکار-مشتری).

## چطور یک نوع سرویس جدید اضافه کنم؟

۱) مقدار جدید به `ServiceType` enum در `src/types/enums.ts` اضافه کن. ۲) `SERVICE_OPTIONS` در `src/constants/services.ts` را با لیبل فارسی/ایموجی به‌روز کن. ۳) اگر لندینگ هم باید سرویس جدید را نشان دهد، `SERVICE_HOTSPOTS` در `src/app/page.tsx` را هم به‌روز کن (و توجه داشته باش این دو منبع از هم جدا هستند).

## چطور یک endpoint API جدید اضافه کنم؟

از `src/app/api/requests/route.ts` به‌عنوان الگوی مرجع استفاده کن (schema Zod → safeParse → تابع `lib/firebase/*` → پاسخ JSON فارسی با کد وضعیت مناسب). ترتیب کامل در [`CODE_READING_GUIDE.md`](./CODE_READING_GUIDE.md#قدم-۵--api-نقطه‌ای-که-همه‌چیز-به‌هم-می‌رسد).

## آیا امنیت واقعی داده در Firestore Rules است؟

نه. `firestore.rules` تقریباً همه‌چیز را می‌بندد (فقط `create` روی `requests` عمومی است)؛ کنترل دسترسی واقعی در **Route Handlerها و middleware** پیاده‌سازی شده، چون آن‌ها با Admin SDK کار می‌کنند که Rules را دور می‌زند. یعنی هر endpoint جدید مسئول auth check خودش است.

## چرا تست خودکار در پروژه نیست؟

فعلاً هیچ فریم‌ورک تستی (Jest/Vitest/Playwright) در `package.json` تعریف نشده. تنها safety netهای فعلی `next lint` و `tsc --noEmit` هستند. افزودن تست، یک آیتم روی [`ROADMAP.md`](./ROADMAP.md#بدون-تاریخ-مشخص--ایده‌های-آینده-خارج-از-اسکوپ-فعلی-فقط-برای-ثبت) است.

## کی و چطور دیپلوی می‌شود؟

هر push به برنچ `master` روی گیت‌هاب مستقیماً توسط Vercel build و دیپلوی می‌شود (بدون تایید دستی یا CI جدا). بنابراین همیشه قبل از push، `npm run lint && npm run typecheck && npm run build` را محلی اجرا کن.

## چرا بعضی هوک‌ها/فایل‌ها (`useAuth`, `useLocation`, `lib/maps.ts`) در پروژه هستند ولی هیچ‌جا import نمی‌شوند؟

چون از قبل برای صفحات placeholder‌ای که هنوز پیاده‌سازی نشده‌اند نوشته شده‌اند. لیست کامل و اینکه هرکدام قرار است کجا مصرف شود در [`KNOWLEDGE_GRAPH.md`](./KNOWLEDGE_GRAPH.md#نودهای-یتیم-نوشته-شده-هنوز-مصرف-نشده).
