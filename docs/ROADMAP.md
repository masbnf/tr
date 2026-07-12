# نقشه‌ی راه (Roadmap)

کارهای باقی‌مانده‌ی واقعی، استخراج‌شده از کامنت‌های `TODO`، صفحات placeholder، و مسائل شناخته‌شده در کد فعلی — نه یک لیست آرزویی عمومی. هر بار یک آیتم انجام شد، آن را به [`CHANGELOG.md`](./CHANGELOG.md) منتقل کن و از اینجا حذفش کن.

## 🔴 اولویت فوری — امنیت

- [x] ~~آپدیت `next@14.2.5` → `14.2.35`~~ **انجام شد (۲۰۲۶-۰۷-۱۲، در sandbox، هنوز commit نشده).** CVE-2025-29927 (Authorization Bypass in Next.js Middleware، `GHSA-f82v-jwr5-mffw`) که مستقیماً auth ادمین این پروژه را تهدید می‌کرد، بسته شد. جزئیات در [`CHANGELOG.md`](./CHANGELOG.md).
- [ ] **⚠️ هنوز باز: مهاجرت از Next.js 14 (EOL).** Next.js 14 از اکتبر ۲۰۲۵ به End-of-Life رسیده و دیگر patch امنیتی نمی‌گیرد. `npm audit` بعد از آپدیت بالا هنوز چند آسیب‌پذیری high نشان می‌دهد (مثلاً DoS در Image Optimizer/React Server Components) که فقط در Next.js ۱۵.۵.۱۸+ یا ۱۶.۲.۶+ رفع شده‌اند — نسخه‌ی patch جدیدی در خط ۱۴.x دیگر منتشر نمی‌شود. این یک major-version migration است (async request APIs در ۱۵، Turbopack/caching model جدید در ۱۶) که نیاز به codemod و تست regression کامل تمام صفحات دارد — عمداً در همین سشن انجام نشد تا با کار دیگر قاطی نشود. توصیه: این را به‌عنوان یک کار جدا و برنامه‌ریزی‌شده (نه یک فیکس سریع) در نظر بگیر.
- [x] ~~PII مشتریان بدون احراز هویت در `GET /api/requests`, `GET/PATCH /api/requests/[id]`~~ **انجام شد (۲۰۲۶-۰۷-۱۲).** `middleware.ts` فقط صفحات `/admin/*` را می‌پوشاند، نه `/api/*`؛ این سه endpoint با `verifyAdminRequest()` محافظت شدند. جزئیات در [`CHANGELOG.md`](./CHANGELOG.md).
- [ ] **⚠️ هنوز باز: همان شکاف روی `api/providers/*` و `api/payments`.** `GET /api/providers`، `POST /api/providers`، `PATCH`/`DELETE /api/providers/[id]`، `POST /api/payments`، و `GET /api/payments` (درآمد روزانه) هنوز بدون auth guard هستند — همان الگوی آسیب‌پذیری، فقط روی داده‌ی نیروها/پرداخت‌ها به‌جای درخواست‌ها. راه‌حل یکسان: افزودن `if (!(await verifyAdminRequest(req))) return 401` به ابتدای هر Route Handler که باید admin-only باشد (همه به‌جز چیزی که عمداً عمومی است). این بخشی از تکمیل پنل ادمین (نیروها/درآمد) خواهد بود، پس طبیعی است هم‌زمان با آن آیتم‌ها انجام شود.

## اولویت بالا — تکمیل مسیر اصلی کسب‌وکار (مشتری)

- [x] ~~`src/app/request/page.tsx` — پیاده‌سازی `RequestForm`~~ **انجام شد (۲۰۲۶-۰۷-۱۲، در sandbox، هنوز commit نشده).** جزئیات در [`CHANGELOG.md`](./CHANGELOG.md).
- [x] ~~تصمیم‌گیری درباره‌ی `SERVICE_HOTSPOTS` در برابر `ServiceType`~~ **تصمیم محدود گرفته شد:** فقط دو اسلاگ بدون‌ابهام (`battery`, `oil-change`) در فرم pre-select می‌شوند؛ نگاشت ۸ اسلاگ باقی‌مانده هنوز حل‌نشده است (تصمیم محصولی، نه فنی) — اگر لازم شد، در `serviceTypeFromSlug()` در `src/components/forms/RequestForm.tsx` گسترش بده.

## اولویت بالا — تکمیل پنل ادمین

- [x] ~~`src/app/admin/login/page.tsx`~~ **انجام شد (۲۰۲۶-۰۷-۱۲).** فرم واقعی، POST به `/api/admin/auth`، پیام خطای فارسی، ریدایرکت به `/admin` در موفقیت. جزئیات در [`CHANGELOG.md`](./CHANGELOG.md).
- [x] ~~`src/app/admin/page.tsx`~~ **انجام شد (۲۰۲۶-۰۷-۱۲).** `OrdersTable` جدید: جدول واقعی از `GET /api/requests` + تغییر وضعیت با `PATCH /api/requests/[id]` + بج‌های رنگی از `STATUS_CONFIG`. یک دکمه‌ی خروج (logout) هم به سایدبار اضافه شد که قبلاً اصلاً وجود نداشت.
- [ ] **`src/app/admin/orders/page.tsx` و `orders/[id]/page.tsx`** — این دو مسیر جدا از `/admin` هستند و در سایدبار لینک نمی‌شوند (فقط `/admin` به‌عنوان «📋 سفارش‌ها» لینک شده). قبل از پیاده‌سازی، تصمیم بگیر آیا `/admin/orders` باید حذف شود (چون `/admin` همان کار را می‌کند) یا `/admin/orders/[id]` به‌عنوان صفحه‌ی جزئیات سفارش (با امکان تخصیص نیرو) نگه داشته و از جدول `OrdersTable` لینک شود.
- [ ] **`src/app/admin/providers/page.tsx` و `providers/new/page.tsx`** — لیست/افزودن نیرو، اتصال به `GET/POST /api/providers` با `createProviderSchema`. یادت باشه auth guard هم اضافه کنی (آیتم بالا).
- [ ] **`src/app/admin/revenue/page.tsx`** — اتصال به `GET /api/payments` (که `getDailyRevenue()` را برمی‌گرداند). یادت باشه auth guard هم اضافه کنی (آیتم بالا).

## اولویت متوسط — رفع مسائل فنی شناخته‌شده

- [ ] **جدا کردن `lib/auth.ts` به دو فایل edge-safe/node-only** — رفع هشدار build مربوط به `bcryptjs` در باندل Edge. جزئیات کامل در [`DEBUGGING.md`](./DEBUGGING.md#هشدار-بیلد-bcryptjs-در-باندل-edge-runtime).
- [ ] **افزودن safeParse به `api/providers/[id]/route.ts`** — تنها Route Handler‌ای که هنوز از الگوی اعتبارسنجی یکسان (Zod safeParse قبل از نوشتن در دیتابیس) پیروی نمی‌کند.
- [ ] **پاک‌سازی فایل‌های یتیم ریشه‌ی ریپو** — `Capture*.JPG`, `adapt.JPG`, `car.JPG`, `circle-cinematic.JPG`, `fix-car.JPG`, `logo.JPG`, `sample.JPG`, `tempJPG.JPG`, `mechanica-app-src.zip`, `gray-text-sizes.patch` (بعد از تایید که محتوایشان لازم نیست).

## اولویت پایین — زیرساخت آماده ولی بلااستفاده

این‌ها باگ نیستند — کدهایی هستند که از قبل نوشته شده‌اند اما هنوز هیچ صفحه‌ای مصرفشان نمی‌کند (تایید شده با بررسی کامل import graph در [`KNOWLEDGE_GRAPH.md`](./KNOWLEDGE_GRAPH.md)):

- [ ] `src/hooks/useAuth.ts` — آماده برای مصرف در `AdminLayout` یا صفحات ادمین برای نمایش شرطی UI.
- [ ] `src/lib/maps.ts` (`buildMapsLink`, `buildMapsDirectionsLink`) — آماده برای صفحه‌ی جزئیات سفارش در پنل ادمین («تپ برای دیدن موقعیت مشتری»).
- [ ] `src/lib/firebase/config.ts` (`db`, Client SDK) — آماده برای فیچر real-time (مثلاً وضعیت زنده‌ی سفارش بدون رفرش صفحه سمت مشتری).

## بدون تاریخ مشخص — ایده‌های آینده (خارج از اسکوپ فعلی، فقط برای ثبت)

- افزودن تست خودکار (در حال حاضر پروژه هیچ فریم‌ورک تستی ندارد).
- افزودن GitHub Action برای اجرای `lint`/`typecheck`/`build` قبل از merge به `master` (چون در حال حاضر safety net خودکاری قبل از دیپلوی وجود ندارد — به [`DECISIONS.md`](./DECISIONS.md#تصمیم-بدون-cicd-جداگانه-vercel-به‌تنهایی-مسئول-بیلددیپلوی) مراجعه کن).
- منطق تخصیص خودکار نیرو (`getActiveProviders` در `lib/firebase/providers.ts` آماده است ولی جایی برای matching/dispatch خودکار صدا زده نمی‌شود).
