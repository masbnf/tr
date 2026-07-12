# مستندات ماژول‌به‌ماژول

هر بخش: هدف، ورودی/خروجی، وابستگی‌ها، و نکات مهم برای تغییر ایمن.

---

## `src/lib/auth.ts`

**هدف:** صدور و اعتبارسنجی JWT ادمین + مقایسه‌ی پسورد هش‌شده.

**API عمومی:**
- `verifyAdminPassword(password: string): Promise<boolean>` — مقایسه با `bcrypt.compare` در برابر `ADMIN_PASSWORD_HASH` محیطی.
- `signAdminToken(): Promise<string>` — امضای JWT با payload `{ role: "admin" }`، الگوریتم `HS256`، انقضا ۱۲ ساعت.
- `verifyAdminToken(token: string): Promise<boolean>` — بررسی امضا + اینکه `payload.role === "admin"`.
- `verifyAdminRequest(req: NextRequest): Promise<boolean>` — **(اضافه‌شده ۲۰۲۶-۰۷-۱۲)** کوکی `admin_token` را از یک `NextRequest` می‌خواند و `verifyAdminToken` را صدا می‌زند. برای Route Handlerهایی که باید admin-only باشند اما `middleware.ts` پوششش نمی‌دهد (چون matcher فقط `/admin/:path*` است، نه `/api/*`) — به [`ARCHITECTURE.md`](./ARCHITECTURE.md) و [`CHANGELOG.md`](./CHANGELOG.md) مراجعه کن.

**وابستگی:** `jose` (JWT کتابخانه‌ی سبک و edge-runtime-friendly — سازگار با `middleware.ts` که روی Edge Runtime اجرا می‌شود)، `bcryptjs`.

**مصرف‌کنندگان:** `src/app/api/admin/auth/route.ts` (signAdminToken, verifyAdminPassword)، `src/middleware.ts` (verifyAdminToken)، `src/app/api/requests/route.ts` و `src/app/api/requests/[id]/route.ts` (verifyAdminRequest — فقط این سه؛ `api/providers/*` و `api/payments` هنوز محافظت نشده‌اند، به [`ROADMAP.md`](./ROADMAP.md) مراجعه کن).

**نکته برای تغییر:** اگر خواستی نقش‌های بیشتر از `admin` اضافه کنی (مثلاً `provider`)، هم payload اینجا و هم چک `payload.role` باید هماهنگ به‌روز شوند. هر Route Handler جدیدی که فقط باید برای ادمین در دسترس باشد، باید با یک خط `if (!(await verifyAdminRequest(req))) return NextResponse.json({error: "دسترسی غیرمجاز"}, {status: 401})` در ابتدای تابع محافظت شود — middleware این را برایت انجام نمی‌دهد.

---

## `src/lib/commission.ts`

**هدف:** محاسبه‌ی کمیسیون پلتفرم و سهم نیروی خدماتی از یک پرداخت.

**API عمومی:**
- `calcCommission(totalPrice, rate = RATE): number` — `Math.round(totalPrice * rate)`.
- `calcProviderPayout(totalPrice, rate = RATE): number` — `totalPrice - calcCommission(...)`.

**نرخ پیش‌فرض:** از `process.env.COMMISSION_RATE` (پیش‌فرض `0.15` = ۱۵٪).

**مصرف‌کننده:** `src/lib/firebase/payments.ts` (`logPayment` هنگام ثبت پرداخت، کمیسیون را محاسبه و ذخیره می‌کند).

**نکته:** تابع `rate` را به‌عنوان پارامتر اختیاری می‌پذیرد — یعنی امکان نرخ سفارشی per-provider یا per-service در آینده بدون تغییر signature وجود دارد.

---

## `src/lib/maps.ts`

**هدف:** ساخت لینک‌های گوگل‌مپس از مختصات جغرافیایی — **نه** یک SDK نقشه‌ی embedded.

**API عمومی:**
- `buildMapsLink(lat, lng)` → لینک نمایش موقعیت.
- `buildMapsDirectionsLink(lat, lng)` → لینک مسیریابی.

**نکته‌ی مهم:** با وجود اینکه `.env.example` شامل `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` است، **در حال حاضر هیچ‌جای کد از Google Maps JavaScript API/Places API استفاده نمی‌کند**. `useLocation.ts` مستقیماً از `navigator.geolocation` مرورگر استفاده می‌کند، و این فایل فقط URL می‌سازد که در پنل ادمین برای «تپ روی موقعیت مشتری» مفید است. اگر در آینده نقشه‌ی تعاملی (مثلاً برای انتخاب دستی موقعیت) لازم شد، آن‌موقع کلید Maps واقعاً مصرف می‌شود.

---

## `src/lib/validators.ts`

**هدف:** تک منبع حقیقت (source of truth) برای اعتبارسنجی هر سه فرم اصلی، با Zod.

**اسکیماها:**
- `createRequestSchema` — نام (حداقل ۲ حرف)، تلفن (regex موبایل ایران `09xxxxxxxxx`)، `serviceType` (enum)، توضیحات اختیاری (حداکثر ۵۰۰ حرف)، `locationLat`/`locationLng` (عدد، پیام خطای فارسی «لوکیشن دریافت نشد»).
- `createProviderSchema` — نام، تلفن، نوع سرویس، `isActive` (پیش‌فرض `true`).
- `logPaymentSchema` — `requestId`، `totalPrice` (مثبت)، `status` (`settled`/`pending`، پیش‌فرض `settled`).

پیام‌های خطا **مستقیم به فارسی** نوشته شده‌اند — این الگو باید در هر اسکیمای جدید رعایت شود (مصرف‌کننده‌ی نهایی UI فارسی است).

**Type inference:** `CreateRequestInput`, `CreateProviderInput`, `LogPaymentInput` با `z.infer` تولید می‌شوند — این یعنی type و validation همیشه sync هستند؛ تایپ را دستی در `types/` تعریف نکن اگر از این اسکیما مشتق می‌شود (برای request/provider این کار همین‌جا انجام شده و در `src/types/*` نوع اصلی از `interface` جدا تعریف شده — به بخش «ناهماهنگی احتمالی» در پایین دقت کن).

**مصرف‌کنندگان:** هر سه Route Handler مرتبط (`api/requests`, `api/providers`, `api/payments`).

---

## `src/lib/firebase/config.ts` — Client SDK

Firebase Client app را با `NEXT_PUBLIC_FIREBASE_*` مقداردهی می‌کند و `db` (Firestore instance) را export می‌کند. الگوی `getApps().length ? getApp() : initializeApp(...)` برای جلوگیری از دوباره-init شدن در HMR توسعه استاندارد Next.js است. **در حال حاضر هیچ فایلی `db` را import نمی‌کند** — زیرساخت آماده برای فیچرهای real-time کلاینت (مثلاً وضعیت زنده‌ی سفارش برای مشتری بدون رفرش).

## `src/lib/firebase/admin.ts` — Admin SDK (lazy)

توضیح کامل الگوی lazy-proxy در [`ARCHITECTURE.md`](./ARCHITECTURE.md#الگوی-lazy-init-برای-firebase-admin). خلاصه: `adminDb` یک `Proxy` است که init واقعی را تا اولین دسترسی به تعویق می‌اندازد تا `next build` بدون env varهای اختیاری fail نکند.

**قانون طلایی:** این فایل هرگز نباید در یک Client Component import شود (فقط در Route Handlerها/`lib/firebase/{requests,providers,payments}.ts` که خودشان فقط سمت سرور مصرف می‌شوند).

## `src/lib/firebase/requests.ts`, `providers.ts`, `payments.ts`

هر فایل یک لایه‌ی نازک CRUD روی یک collection Firestore است (الگوی یکسان: `COL` ثابت + توابع async که مستقیم `adminDb.collection(COL)...` صدا می‌زنند). نکات خاص هرکدام:

- **requests.ts**: `createRequest` وضعیت اولیه را همیشه `OrderStatus.PENDING` می‌گذارد (کلاینت نمی‌تواند status اولیه را override کند — درست است، چون از `CreateRequestInput` که status ندارد گرفته می‌شود). `updateRequestStatus` هم status و هم (اختیاری) `assignedProvider` را آپدیت می‌کند.
- **providers.ts**: `getActiveProviders` فیلتر `isActive == true` دارد — برای استفاده در منطق تخصیص خودکار نیرو (که هنوز جایی صدا زده نمی‌شود؛ فقط API آماده است).
- **payments.ts**: `logPayment` کمیسیون را در لحظه‌ی ذخیره محاسبه می‌کند (نه بعداً) — یعنی اگر `COMMISSION_RATE` بعداً تغییر کند، رکوردهای قدیمی commission قدیمی را نگه می‌دارند (تاریخی، درست). `getDailyRevenue` بر اساس `createdAt >= امروز ساعت ۰۰:۰۰` و `status == "settled"` فیلتر می‌کند.

---

## `src/hooks/useAuth.ts`

هوک ساده‌ی client-side که فقط چک می‌کند کوکی `admin_token` در `document.cookie` وجود دارد یا نه (`isAdmin: boolean | null`، `null` = هنوز چک نشده). **این یک چک UI-only است، نه امنیتی** — چون کوکی واقعی `httpOnly` است، این هوک فقط presence رشته‌ی `"admin_token="` را در header قابل‌خواندن چک می‌کند که ممکن است در برخی حالت‌ها گمراه‌کننده باشد؛ کنترل امنیتی واقعی همیشه `middleware.ts` سمت سرور است.

## `src/hooks/useLocation.ts`

Wrapper روی `navigator.geolocation.getCurrentPosition`؛ state شامل `lat`, `lng`, `error` (پیام‌های فارسی)، `loading`. تابع `getLocation()` باید با کلیک کاربر صدا زده شود (چون مرورگرها معمولاً درخواست geolocation خودکار را مسدود/هشدار می‌دهند).

---

## `src/constants/services.ts` و `status.ts`

- `SERVICE_OPTIONS`: منبع UI برای ۴ نوع سرویس واقعی (`ServiceType` enum) با لیبل فارسی و ایموجی — برای فرم ثبت درخواست (وقتی ساخته شود) باید استفاده گردد.
- `STATUS_CONFIG`: نگاشت هر `OrderStatus` به `{ label, color }` (کلاس Tailwind) — برای بج‌های وضعیت در پنل ادمین.

**⚠️ ناهماهنگی شناخته‌شده:** آرایه‌ی `SERVICE_HOTSPOTS` داخل `src/app/page.tsx` (لندینگ) ۱۰ آیتم با اسلاگ انگلیسی (`engine-repair`, `tire`, `car-wash`, `electrical`, `lights`, `brake-pads`, `fuel-delivery`, `battery`, `paint`, `oil-change`) دارد که به `/request?service=<slug>` لینک می‌شوند. اما `ServiceType` enum واقعی (که در `validators.ts` و دیتابیس استفاده می‌شود) فقط ۴ مقدار دارد: `mechanic`, `battery`, `tow`, `oil_change`. یعنی وقتی فرم `/request` ساخته شود، باید یا (الف) query param `service` را map کند به نزدیک‌ترین `ServiceType` موجود، یا (ب) `ServiceType` enum را گسترش دهد تا با لندینگ هماهنگ شود. این تصمیم معماری هنوز گرفته نشده.

---

## `src/types/*`

چهار فایل type تعریف می‌کنند: `enums.ts` (دو enum پایه)، `request.ts`، `provider.ts`، `payment.ts`. الگو: هر `interface` اصلی (`ServiceRequest`, `Provider`, `Payment`) شکل کامل رکورد Firestore را تعریف می‌کند، و یک type مشتق (`CreateXInput = Omit<X, "id" | ...fieldهای auto-generated>`) شکل ورودی فرم/API را. این الگو باید برای هر entity جدید تکرار شود.

---

## `src/middleware.ts`

توضیح کامل در [`ARCHITECTURE.md`](./ARCHITECTURE.md#جریان-احراز-هویت-ادمین). نکته‌ی فنی: چون middleware روی **Edge Runtime** اجرا می‌شود، نمی‌تواند از `firebase-admin` یا `bcryptjs` (که به Node.js API متکی‌اند) استفاده کند — دقیقاً به همین دلیل `jose` (نه `jsonwebtoken`) انتخاب شده، چون سازگار با Edge Runtime است.

---

## `src/app/api/*` (Route Handlers)

هر endpoint در [`PROJECT_MAP.md`](./PROJECT_MAP.md#srcapp--مسیرها-و-صفحات-nextjs-app-router) لیست شده. الگوی مشترک همه: دریافت body → `schema.safeParse` → در صورت خطا `422` با `error.flatten()` → در صورت موفقیت صدا زدن تابع مرتبط `lib/firebase/*` → try/catch با `console.error` + پاسخ فارسی `500 "خطای سرور"`. **این الگو باید برای هر endpoint جدید عیناً تکرار شود** تا رفتار API یکدست بماند.

استثنا: `api/providers/[id]/route.ts` فعلاً safeParse ندارد (مستقیم `req.json()` را به `updateProvider` می‌دهد) — یک عدم‌تقارن جزئی نسبت به بقیه‌ی endpointها، خوب است هنگام لمس بعدی این فایل اصلاح شود.

**Auth guard (اضافه‌شده ۲۰۲۶-۰۷-۱۲):** `middleware.ts` فقط صفحات (`/admin/:path*`) را می‌پوشاند، نه `/api/*`. هر Route Handler که داده‌ی admin-only برمی‌گرداند یا تغییر می‌دهد باید خودش با `verifyAdminRequest(req)` از `lib/auth.ts` این را چک کند (فقط `api/requests/route.ts` GET و `api/requests/[id]/route.ts` تا الان این محافظت را دارند — `api/providers/*` و `api/payments` هنوز باز هستند، به [`ROADMAP.md`](./ROADMAP.md) مراجعه کن). `POST /api/requests` عمداً بدون این guard می‌ماند چون باید عمومی باشد (مطابق `firestore.rules`).

---

## `src/components/layout/Navbar.tsx`

Client Component (`"use client"`). state: `open` (منوی موبایل)، `scrolled` (برای تغییر پس‌زمینه‌ی هدر هنگام اسکرول، با listener روی `window.scroll`). داده‌ی لینک‌ها در آرایه‌ی محلی `NAV_LINKS` (نه در `constants/`) — الگوی داده‌محلی مشابه در `page.tsx` هم دیده می‌شود (`STEPS`, `STATS`, ...): این پروژه ترجیح می‌دهد داده‌ی UI-only را در کنار کامپوننت مصرف‌کننده نگه دارد، نه در `constants/` مرکزی (که برای داده‌ی business-logic مثل enum/status رزرو شده).

## `src/components/layout/Footer.tsx`

فوتر استاتیک؛ بدون state یا منطق خاص.

## `src/components/ui/Icons.tsx`

مجموعه آیکون‌های SVG به‌شکل کامپوننت تابعی (`ZapIcon`, `WrenchIcon`, `LocationIcon`, `CheckIcon`, `PhoneIcon`, ...). برای آیکون جدید، همین الگو (SVG inline به‌جای وابستگی به کتابخانه‌ی آیکون خارجی) باید رعایت شود — پروژه هیچ کتابخانه‌ی آیکون (مثل `lucide-react`) در `package.json` ندارد.

---

## `src/app/page.tsx` — صفحه‌ی لندینگ

بزرگ‌ترین فایل پروژه (۴۲۶ خط). ساختار: چند آرایه‌ی داده‌ی محلی در بالای فایل (`STEPS`, `STATS`, `TRUST`, `MOBILE_TRUST`, `SERVICE_HOTSPOTS`, `MOCK_STATS`, `MOCK_ORDERS`, `BARS`) و سپس JSX که این داده‌ها را رندر می‌کند، در چهار `<section>` اصلی (هیرو، خدمات با hotspot روی تصویر، «نحوه کار» با `STEPS`، و بخش پایانی). طراحی دارای **دو مسیر جدا برای موبایل/دسکتاپ** است (`order-*` کلاس‌های Tailwind برای تغییر ترتیب بصری)، نه صرفاً `hidden md:block` ساده — طبق کامیت‌های اخیر (`f16849a` بازطراحی موبایل، `45e33f9` تنظیم تایپوگرافی موبایل).

`MOCK_STATS`/`MOCK_ORDERS`/`BARS` داده‌ی **نمایشی/تزئینی** برای پیش‌نمایش داشبورد در بخش هیرو هستند (نه داده‌ی واقعی از API) — باید اینگونه بمانند مگر تصمیم گرفته شود این بخش به داده‌ی زنده وصل شود.

---

## `src/components/admin/OrdersTable.tsx` و `LogoutButton.tsx` (اضافه‌شده ۲۰۲۶-۰۷-۱۲)

**`OrdersTable.tsx`:** Client Component که `/admin` (داشبورد اصلی) رندر می‌کند. با `fetch("/api/requests")` روی mount دیتا می‌گیرد؛ چون این حالا یک endpoint admin-only است (به بخش auth guard در `lib/auth.ts` مراجعه کن)، کوکی `admin_token` به‌صورت خودکار توسط مرورگر همراه fetch هم‌مبدا (same-origin) ارسال می‌شود — نیازی به کد اضافه نیست. اگر پاسخ `401` باشد (مثلاً نشست منقضی شده)، پیام فارسی مناسب نشان داده می‌شود. تغییر وضعیت هر سفارش با یک `<select>` روی `PATCH /api/requests/[id]` انجام می‌شود؛ رنگ/لیبل هر گزینه مستقیم از `STATUS_CONFIG` می‌آید (بدون تکرار داده). نکته‌ی تایپی مهم: `GET /api/requests` فیلد `createdAt` را به‌صورت رشته‌ی ISO سریالایز می‌کند (نه `Date`)، برای همین این کامپوننت یک تایپ محلی `RequestRow` (به‌جای `ServiceRequest` خام) تعریف می‌کند که با شکل واقعی داده روی سیم مطابقت دارد.

**`LogoutButton.tsx`:** یک دکمه‌ی ساده که `DELETE /api/admin/auth` را صدا می‌زند (کوکی را با `maxAge: 0` پاک می‌کند) و بعد به `/admin/login` ریدایرکت می‌کند. در `AdminLayout` (سایدبار) رندر می‌شود.

---

## `src/components/forms/RequestForm.tsx` (اضافه‌شده ۲۰۲۶-۰۷-۱۲)

Client Component که فرم `/request` را پیاده‌سازی می‌کند — اولین مصرف‌کننده‌ی واقعی چند ماژول که قبلاً «یتیم» بودند (`useLocation`, `SERVICE_OPTIONS`, و به‌طور غیرمستقیم `react-hot-toast`).

- **اعتبارسنجی:** `useForm` از `react-hook-form` با `resolver: zodResolver(createRequestSchema)` — همان اسکیمای موجود در `lib/validators.ts`، بدون تغییر.
- **انتخاب نوع خدمت:** به‌جای `<select>` بومی، یک گرید دکمه از `SERVICE_OPTIONS` رندر می‌شود (`role="radiogroup"`)؛ مقدار انتخابی با `setValue("serviceType", ...)` ست می‌شود و یک `<input type="hidden">` رجیستر‌شده مقدار را برای resolver نگه می‌دارد.
- **موقعیت مکانی:** دکمه‌ی «دریافت موقعیت من» مستقیم `useLocation().getLocation()` را صدا می‌زند؛ یک `useEffect` نتیجه (`lat`/`lng`) را با `setValue(..., { shouldValidate: true })` داخل فرم sync می‌کند.
- **پیش‌انتخاب از لندینگ:** پارامتر `?service=<slug>` (از `SERVICE_HOTSPOTS`) با تابع محلی `serviceTypeFromSlug()` خوانده می‌شود؛ **فقط** دو اسلاگ بدون‌ابهام (`battery`, `oil-change`) map می‌شوند، نه هر ۱۰ تا — تصمیم عمدی برای جلوگیری از حدس‌زدن یک نگاشت محصولی حل‌نشده (به بخش «ناهماهنگی شناخته‌شده» در پایین همین فایل مراجعه کن).
- **خطای submit:** با `react-hot-toast` نمایش داده می‌شود (`toast.error(...)`)؛ این اولین جایی در پروژه است که این دیپندنسی (که از ابتدا نصب بود ولی هیچ‌جا wire نشده بود) واقعاً استفاده می‌شود — به همین دلیل `<Toaster />` به `src/app/layout.tsx` اضافه شد.
- **موفقیت:** `router.push("/request/confirm")` (از `next/navigation`).
- چون از `useSearchParams()` استفاده می‌کند، در `src/app/request/page.tsx` داخل `<Suspense>` رندر می‌شود — الزام استاندارد Next.js App Router برای این هوک.

## صفحات placeholder (نیاز به پیاده‌سازی)

فایل‌های زیر همگی الگوی مشابه دارند: یک `h1` با متن فارسی + گاهی یک پاراگراف «در حال ساخت...» + کامنت `// TODO`. قبل از پیاده‌سازی هرکدام، حتماً `ARCHITECTURE.md` (جریان‌های مربوطه) و اسکیمای Zod/تایپ مرتبط را بخوان:

- `src/app/admin/orders/page.tsx`, `orders/[id]/page.tsx` → این دو از سایدبار لینک نمی‌شوند (فقط `/admin` لینک شده)؛ قبل از پیاده‌سازی، تصمیم بگیر آیا `/admin/orders` (که با `/admin` هم‌پوشانی دارد) لازم است یا فقط `orders/[id]` به‌عنوان صفحه‌ی جزئیات/تخصیص نیرو نگه داشته شود — به [`ROADMAP.md`](./ROADMAP.md) مراجعه کن.
- `src/app/admin/providers/page.tsx`, `providers/new/page.tsx` → باید به `GET/POST /api/providers` و `PATCH/DELETE /api/providers/[id]` وصل شوند؛ `createProviderSchema` آماده است.
- `src/app/admin/revenue/page.tsx` → باید به `GET /api/payments` (که `getDailyRevenue` را برمی‌گرداند) وصل شود.
