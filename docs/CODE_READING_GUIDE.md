# راهنمای خواندن کد (به چه ترتیبی بخوانم؟)

ترتیب زیر بر اساس گراف وابستگی واقعی پروژه (نگاه کن به [`KNOWLEDGE_GRAPH.md`](./KNOWLEDGE_GRAPH.md)) چیده شده: از فایل‌های بدون وابستگی داخلی (برگ‌های گراف) به سمت فایل‌هایی که همه‌چیز را به هم وصل می‌کنند.

## قدم ۱ — مدل داده (بدون هیچ وابستگی داخلی دیگر)

1. `src/types/enums.ts` — دو enum پایه‌ی کل پروژه (`ServiceType`, `OrderStatus`). **پیش‌نیاز:** هیچ. **زمان تخمینی:** ۲ دقیقه.
2. `src/types/request.ts`, `src/types/provider.ts`, `src/types/payment.ts` — سه entity اصلی. **پیش‌نیاز:** قدم ۱. **نکته:** به الگوی `CreateXInput = Omit<X, ...>` دقت کن.
3. `src/constants/services.ts`, `src/constants/status.ts` — نسخه‌ی UI-ready از enumها.

**خروجی یادگیری:** فهم کامل مدل داده‌ی business (چه چیزی در Firestore ذخیره می‌شود).

## قدم ۲ — منطق خالص (بدون I/O)

4. `src/lib/commission.ts` — کوچک‌ترین و ساده‌ترین فایل پروژه؛ خوب برای شروع خواندن منطق.
5. `src/lib/maps.ts` — دو تابع pure، بدون state.
6. `src/lib/validators.ts` — اسکیماهای Zod؛ به پیام‌های خطای فارسی دقت کن.

**خروجی یادگیری:** آشنایی با الگوی توابع pure و اعتبارسنجی پروژه.

## قدم ۳ — لایه‌ی دسترسی به داده

7. `src/lib/firebase/admin.ts` — **مهم‌ترین فایل برای فهم عمیق**؛ الگوی lazy-init proxy را با دقت بخوان و توضیح کامل در [`ARCHITECTURE.md`](./ARCHITECTURE.md#الگوی-lazy-init-برای-firebase-admin) را هم ببین.
8. `src/lib/firebase/config.ts` — کوتاه، فقط برای مقایسه با admin.ts (چرا این یکی نیازی به lazy-init ندارد؟ چون Client SDK فوراً fail نمی‌کند بدون کلید).
9. `src/lib/firebase/requests.ts`, `providers.ts`, `payments.ts` — سه فایل با الگوی تقریباً یکسان؛ یکی را کامل بخوان، بقیه را دیاگونال (diff-style) مرور کن.

**خروجی یادگیری:** فهم کامل نحوه‌ی رفت‌وبرگشت داده بین اپلیکیشن و Firestore.

## قدم ۴ — احراز هویت

10. `src/lib/auth.ts` — توابع JWT/پسورد.
11. `src/middleware.ts` — کجا و چطور این توابع مصرف می‌شوند.

**خروجی یادگیری:** فهم کامل جریان لاگین ادمین ([`ARCHITECTURE.md`](./ARCHITECTURE.md#جریان-احراز-هویت-ادمین) را همزمان باز نگه دار).

## قدم ۵ — API (نقطه‌ای که همه‌چیز به‌هم می‌رسد)

12. `src/app/api/requests/route.ts` — بهترین نمونه‌ی الگوی کامل (safeParse → دیتابیس → پاسخ). این را به‌عنوان «الگوی مرجع» برای هر Route Handler جدید نگه دار.
13. بقیه‌ی `route.ts`ها (`requests/[id]`, `providers`, `providers/[id]`, `payments`, `admin/auth`) — همه را با مقایسه با شماره‌ی ۱۲ بخوان تا تفاوت‌های جزئی (مثل نبود safeParse در `providers/[id]`) را خودت پیدا کنی.

**خروجی یادگیری:** توانایی نوشتن یک Route Handler جدید کاملاً هم‌راستا با کانونشن پروژه.

## قدم ۶ — کامپوننت‌ها و صفحات

14. `src/components/ui/Icons.tsx` — الگوی SVG inline.
15. `src/components/layout/Navbar.tsx` — مثال کامل Client Component با state/scroll listener.
16. `src/components/layout/Footer.tsx` — ساده، بدون state.
17. `src/app/layout.tsx` — نقطه‌ی اتصال فونت/RTL/metadata.
18. `src/app/page.tsx` — بزرگ‌ترین فایل؛ بخوان بعد از همه‌ی موارد بالا چون از تقریباً همه‌چیز استفاده می‌کند (Navbar, Footer, Icons) و خودش داده‌ی محلی زیادی دارد.
19. صفحات placeholder (`request/page.tsx`, `admin/**/page.tsx`) — سریع، چون بیشترشان چند خطی‌اند؛ برای هرکدام چک کن [`ROADMAP.md`](./ROADMAP.md) چه چیزی باید اضافه شود.

**خروجی یادگیری:** توانایی ساخت یک کامپوننت/صفحه‌ی جدید هم‌راستا با سبک بصری و کد پروژه.

## قدم ۷ — کانفیگ (وقتی نیاز به تغییر تم/بیلد داشتی)

20. `tailwind.config.ts` — تم رنگی/فونت/انیمیشن سفارشی.
21. `src/app/globals.css` — لایه‌های base/components سفارشی.
22. `next.config.mjs`, `tsconfig.json` — کوتاه، فقط یک‌بار برای آشنایی.

---

### مسیر سریع (اگر فقط ۳۰ دقیقه وقت داری)

`types/enums.ts` → `lib/firebase/admin.ts` → `app/api/requests/route.ts` → `app/page.tsx` (فقط ۷۰ خط اول برای دیدن ساختار داده) — همین چهار فایل، شکل کلی معماری را نشان می‌دهند.
