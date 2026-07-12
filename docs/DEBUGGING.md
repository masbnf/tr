# راهنمای دیباگ

باگ‌های واقعی رفع‌شده و مسائل شناخته‌شده‌ی فعلی این پروژه. هر بار باگی رفع شد، یک ورودی جدید طبق همین فرمت اضافه کن.

---

## خرابی بیلد Vercel به دلیل init فوری Firebase Admin

**تاریخ رفع:** ۲۰۲۶-۰۷-۰۷ (کامیت `c35de6f`)

**علائم:** بیلد پروداکشن روی Vercel با پیام مشابه «Collecting page data for /api/providers» شکست می‌خورد.

**علت ریشه‌ای:** `next build` برای جمع‌آوری اطلاعات مسیرها، تمام Route Handlerها (و ماژول‌های import‌شده‌شان) را در زمان بیلد اجرا می‌کند. `src/lib/firebase/admin.ts` در نسخه‌ی قبلی، `cert({...})` را مستقیم در سطح ماژول (بیرون از هر تابع) صدا می‌زد. چون Vercel در آن مرحله هنوز `FIREBASE_ADMIN_PROJECT_ID`/`FIREBASE_ADMIN_CLIENT_EMAIL`/`FIREBASE_ADMIN_PRIVATE_KEY` را تنظیم نکرده بود، `cert()` با مقادیر `undefined` خطا می‌داد و کل بیلد را می‌شکست.

**راه‌حل:** پیچیدن `adminDb` در یک `Proxy` که init واقعی Firebase (`getAdminApp()` → `getFirestore()`) را تا اولین دسترسی واقعی (`adminDb.collection(...)`) به تعویق می‌اندازد. کد فعلی در `src/lib/firebase/admin.ts`.

**نحوه‌ی بازتولید محلی (طبق پیام کامیت):** فایل `.env.local` را موقتاً مخفی/rename کن، بعد `npm run build` را اجرا کن تا شرایط «نبود secretهای Vercel» شبیه‌سازی شود.

**چطور از این باگ در آینده جلوگیری کنیم:** هر ماژول جدیدی که به یک سرویس بیرونی با env var متصل می‌شود، باید همین الگوی lazy-init را رعایت کند (نه فقط Firebase). قبل از افزودن هر SDK جدید (Redis، سرویس ایمیل، پرداخت و...)، این سوال را بپرس: «آیا init این سرویس در سطح ماژول فوری اجرا می‌شود؟ اگر بله، آیا بدون env varهای مربوطه fail می‌کند؟»

---

## هشدار بیلد: bcryptjs در باندل Edge Runtime

**وضعیت:** شناخته‌شده، **غیر-بلاک‌کننده** (بیلد کامل می‌شود، فقط هشدار چاپ می‌کند). یافته‌شده در حین این مستندسازی (۲۰۲۶-۰۷-۱۱) با اجرای `npm run build`.

**علائم (خروجی واقعی build):**
```
./node_modules/bcryptjs/dist/bcrypt.js
A Node.js API is used (setImmediate at line: 352) which is not supported in the Edge Runtime.
Import trace for requested module:
./node_modules/bcryptjs/dist/bcrypt.js
./src/lib/auth.ts
```
(مشابه برای `process.nextTick`)

**علت ریشه‌ای:** `src/middleware.ts` (که روی Edge Runtime اجرا می‌شود) فقط `verifyAdminToken` را از `lib/auth.ts` وارد می‌کند، اما `lib/auth.ts` در سطح فایل `bcryptjs` را هم import می‌کند (برای `verifyAdminPassword`، که middleware اصلاً صدا نمی‌زند). چون بستن (bundling) بر اساس فایل انجام می‌شود نه per-function، کل `bcryptjs` وارد باندل Edge می‌شود — و `bcryptjs` از API‌های Node (`setImmediate`, `process.nextTick`) استفاده می‌کند که در Edge Runtime وجود ندارند.

**تاثیر فعلی:** چون `verifyAdminToken` مسیر کدی است که واقعاً در Edge اجرا می‌شود و به `bcryptjs` نیازی ندارد، در عمل مشکلی رخ نمی‌دهد — Next.js فقط هشدار می‌دهد، نه خطا. اما این یک ریسک شکننده است: اگر Next.js در نسخه‌ی بعدی این را به خطای سخت تبدیل کند، بیلد می‌شکند.

**راه‌حل پیشنهادی (هنوز اعمال نشده):** جدا کردن `lib/auth.ts` به دو فایل — مثلاً `lib/auth-edge.ts` (فقط `jose`، امن برای Edge؛ `signAdminToken`/`verifyAdminToken`) و `lib/auth-node.ts` (فقط `bcryptjs`؛ `verifyAdminPassword`، فقط در `api/admin/auth/route.ts` مصرف می‌شود که Node runtime است). این یک تغییر کوچک و ایزوله است — به [`ROADMAP.md`](./ROADMAP.md) مراجعه کن.

---

## ورود ادمین همیشه «رمز عبور اشتباه است» می‌دهد، حتی با پسورد درست (برطرف‌شده)

**تاریخ کشف/رفع:** ۲۰۲۶-۰۷-۱۲ (حین پیاده‌سازی و تست دستی صفحه‌ی `/admin/login`)

**علائم:** حتی وقتی `ADMIN_PASSWORD_HASH` دقیقاً طبق دستورالعمل `.env.example` تولید و paste شده، `POST /api/admin/auth` همیشه `401 {"error":"رمز عبور اشتباه است"}` برمی‌گرداند — برای هر پسوردی، حتی پسورد درست.

**علت ریشه‌ای (تایید‌شده با تست مستقیم):** هش‌های bcrypt همیشه شامل کاراکتر `$` هستند (مثلاً `$2a$10$...`). Next.js موقع لود کردن `.env.local` (از طریق پکیج داخلی `@next/env`) رشته‌های `$name` را به‌عنوان syntax گسترش متغیر (variable expansion، شبیه شل) تفسیر می‌کند. چون `$2a`, `$10` و بقیه بخش‌های هش نام متغیر معتبری نیستند، به رشته‌ی خالی expand می‌شوند — یعنی `ADMIN_PASSWORD_HASH` که در کد لود می‌شود عملاً `""` است، نه هش واقعی. `bcrypt.compare(password, "")` همیشه `false` برمی‌گرداند، مهم نیست پسورد چی باشد.

تایید مستقیم:
```js
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
console.log(process.env.ADMIN_PASSWORD_HASH); // چاپ می‌کند: ""
```

**راه‌حل:** هر `$` در مقدار `ADMIN_PASSWORD_HASH` داخل `.env.local` باید escape شود (`\$`). مثال:
```
ADMIN_PASSWORD_HASH=\$2a\$10\$QsmpMcQqHxay7cG9n65UEufBDZfsziCV3oFSZhFy6DG6IHLrEQN5W
```
با escape کردن، `loadEnvConfig` مقدار کامل و صحیح هش را برمی‌گرداند (تست شد و تایید شد) و لاگین ادمین به‌درستی کار می‌کند. `.env.example` با این توضیح و یک نمونه‌ی escape‌شده به‌روزرسانی شد.

**نکته:** `JWT_SECRET` (هگزادسیمال از `crypto.randomBytes`) هیچ‌وقت `$` ندارد، پس این مشکل را ندارد — فقط مخصوص `ADMIN_PASSWORD_HASH` است.

**چطور از این باگ در آینده جلوگیری کنیم:** هر مقدار env جدیدی که ممکن است حاوی `$` باشد (هش‌ها، برخی توکن‌های base64/base64url که تصادفاً `$` دارند، و...) باید همین escaping را رعایت کند. اگر لاگین/فیچری که به یک env var خاص وابسته است «بی‌صدا» (بدون خطای واضح) fail می‌کند، همیشه اول مقدار واقعی لود‌شده در `process.env` را چاپ/بررسی کن، نه فقط محتوای فایل `.env.local` را.

---

## چک‌لیست عمومی دیباگ این پروژه

قبل از باز کردن issue جدید، این‌ها را چک کن:

1. **خطای فایربیس در dev محلی؟** مطمئن شو `.env.local` را از `.env.example` کپی کرده‌ای و تمام `FIREBASE_ADMIN_*`/`NEXT_PUBLIC_FIREBASE_*` واقعی پر شده‌اند.
2. **خطای احراز هویت ادمین (ریدایرکت مکرر به `/admin/login` یا «رمز عبور اشتباه است» با پسورد درست)؟** چک کن `JWT_SECRET` تنظیم شده، کوکی `admin_token` منقضی نشده (۱۲ ساعت طول عمر دارد)، و `$` داخل `ADMIN_PASSWORD_HASH` در `.env.local` escape شده باشد (`\$`) — جزئیات در بخش «ورود ادمین همیشه رمز عبور اشتباه است می‌دهد» بالاتر در همین فایل.
3. **بیلد لوکال موفق ولی روی Vercel fail می‌شود؟** به احتمال زیاد یک env var در تنظیمات پروژه‌ی Vercel (نه فقط `.env.local` محلی) تنظیم نشده — به‌خصوص `FIREBASE_ADMIN_PRIVATE_KEY` که باید newlineهای escape‌شده (`\n`) داشته باشد؛ `admin.ts` خودش این را با `.replace(/\\n/g, "\n")` تبدیل می‌کند، پس مقدار env var باید دقیقاً همان فرمت تک‌خطی escape‌شده باشد.
4. **صفحه‌ای که باید کار کند فقط «در حال ساخت...» نشان می‌دهد؟** این عمدی است، نه باگ — به لیست صفحات placeholder در [`README.md`](./README.md#وضعیت-فعلی-پروژه-snapshot) مراجعه کن.
