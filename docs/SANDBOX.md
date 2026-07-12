# Sandbox — تجربه‌ی امن قبل از تغییر کد واقعی

قبل از هر تغییر روی کد پروداکشن، اینجا (یا یک کلون جدا) تمرین کن.

## راه‌اندازی sandbox

```bash
git clone https://github.com/masbnf/tr.git mechanica-sandbox
cd mechanica-sandbox
npm install
cp .env.example .env.local   # پر کن با مقادیر تست/dev، هرگز مقادیر پروداکشن واقعی
npm run dev
```

این یک کلون کاملاً جدا است — هر تغییری اینجا، تا وقتی خودت push نکنی، هیچ تاثیری روی `master` واقعی یا دیپلوی Vercel ندارد.

## قانون طلایی Sandbox

بعد از هر آزمایش: `git status` بزن، اگر تغییر مطلوب نبود `git checkout -- .` یا کل پوشه‌ی sandbox را پاک کن. **هرگز از sandbox مستقیم push نکن** مگر مطمئن باشی تغییر آماده‌ی master است.

---

## آزمایش ۱: فهم الگوی Lazy-Init فایربیس (Beginner)

**هدف:** ببینی چرا init فوری Firebase Admin بیلد را می‌شکند.

**فایل‌های درگیر:** `src/lib/firebase/admin.ts`

**مراحل:**
1. `mv .env.local .env.local.bak` (شبیه‌سازی نبود secretها، دقیقاً مثل شرایط اولیه‌ی Vercel).
2. `npm run build` — باید موفق شود (چون lazy-init الان جای خودش هست).
3. موقتاً در `admin.ts`، خط `getFirestore(getAdminApp())` را از داخل تابع `getAdminDb` بیرون بیاور و مستقیم در سطح ماژول صدا بزن (شبیه‌سازی باگ قدیمی).
4. دوباره `npm run build` بزن — باید fail شود با پیامی شبیه چیزی که در [`DEBUGGING.md`](./DEBUGGING.md#خرابی-بیلد-vercel-به-دلیل-init-فوری-firebase-admin) مستند شده.

**خروجی مورد انتظار:** دیدن دقیق پیام خطای واقعی که کامیت `c35de6f` قرار بود رفع کند.

**پاک‌سازی:** `git checkout -- src/lib/firebase/admin.ts && mv .env.local.bak .env.local`

**درس یادگرفته:** init سطح-ماژول برای هر سرویس با env var اختیاری، خطرناک است — همیشه lazy کن.

---

## آزمایش ۲: ساخت یک endpoint جدید با الگوی موجود (Intermediate)

**هدف:** یاد بگیری الگوی Route Handler این پروژه را دقیق تکرار کنی.

**فایل‌های درگیر:** فایل جدید `src/app/api/providers/[id]/route.ts` (اضافه‌کردن متد `GET`)

**مراحل:**
1. `src/app/api/requests/[id]/route.ts` را به‌عنوان الگو باز کن.
2. در `src/app/api/providers/[id]/route.ts`، یک تابع `GET` اضافه کن که با یک تابع جدید `getProvider(id)` در `lib/firebase/providers.ts` (که باید خودت بسازی، مشابه `getRequest` در `requests.ts`) یک provider را برگرداند.
3. `curl http://localhost:3000/api/providers/<یک-id-واقعی>` را تست کن.

**خروجی مورد انتظار:** پاسخ JSON یک provider، یا `404` با پیام فارسی «پیدا نشد» اگر id نامعتبر باشد.

**پاک‌سازی:** `git checkout -- src/app/api/providers/[id]/route.ts src/lib/firebase/providers.ts` (یا نگه‌دار اگر می‌خواهی واقعاً به پروژه اضافه‌اش کنی).

**درس یادگرفته:** الگوی یکسان error handling/response در تمام endpointها.

---

## آزمایش ۳: پیاده‌سازی بخشی از فرم درخواست (Advanced)

**هدف:** شروع واقعی کار روی بزرگ‌ترین آیتم Roadmap.

**فایل‌های درگیر:** `src/app/request/page.tsx`

**مراحل:**
1. یک `"use client"` component به اسم `RequestForm` بساز که `useForm` از `react-hook-form` را با `zodResolver(createRequestSchema)` استفاده کند.
2. فیلدهای `name`, `phone` را با `register()` وصل کن.
3. `SERVICE_OPTIONS` را برای یک `<select>` نوع خدمت map کن.
4. دکمه‌ی «دریافت موقعیت من» که `useLocation().getLocation()` را صدا بزند و `locationLat`/`locationLng` را با `setValue` پر کند.
5. `onSubmit` که `fetch("/api/requests", { method: "POST", body: JSON.stringify(data) })` بزند و در موفقیت با `router.push("/request/confirm")` ریدایرکت کند.

**خروجی مورد انتظار:** یک فرم کاری کامل که یک سند واقعی در Firestore (`requests` collection) می‌سازد.

**درس یادگرفته:** چطور تمام لایه‌های از‌قبل‌آماده (schema، هوک، constants، API) در این پروژه به‌هم وصل می‌شوند.

**اگر این آزمایش موفق شد:** این دیگر یک «آزمایش» نیست — یک تغییر واقعی آماده‌ی master است. آن را طبق فرمت [`CHANGELOG.md`](./CHANGELOG.md) ثبت کن و از [`ROADMAP.md`](./ROADMAP.md) حذفش کن.
