# معماری پروژه

## نمای کلی

مکانیکا یک اپلیکیشن **Next.js 14 App Router** تک‌ریپو (monolith) است که هم فرانت‌اند (صفحات مشتری + پنل ادمین) و هم بک‌اند (Route Handlerها) را در یک پروژه‌ی واحد نگه می‌دارد. پایگاه‌داده Firestore است و دیپلوی روی Vercel با اتصال مستقیم به گیت‌هاب انجام می‌شود.

```mermaid
graph TD
    subgraph Client["مرورگر (Client)"]
        A[صفحه‌ی لندینگ /] --> B["/request فرم درخواست"]
        C["/admin/* پنل ادمین"]
    end

    subgraph Server["Next.js Server (Vercel)"]
        MW[middleware.ts - گارد مسیر /admin]
        API1["/api/requests"]
        API2["/api/providers"]
        API3["/api/payments"]
        API4["/api/admin/auth"]
    end

    subgraph Data["Firebase"]
        FS[(Firestore: requests / providers / payments)]
    end

    B -->|POST| API1
    C -->|از طریق middleware| MW
    MW --> C
    API4 -->|صدور کوکی JWT| C
    API1 -->|firebase-admin SDK| FS
    API2 -->|firebase-admin SDK| FS
    API3 -->|firebase-admin SDK| FS
```

## اصل کلیدی: جداسازی کامل Client SDK از Admin SDK

پروژه از **دو SDK جدا** برای Firebase استفاده می‌کند و این جداسازی عمدی و مهم است:

| | `src/lib/firebase/config.ts` | `src/lib/firebase/admin.ts` |
|---|---|---|
| پکیج | `firebase` (Client SDK) | `firebase-admin` |
| محیط اجرا | مرورگر (و هر جایی) | فقط سرور (Route Handlerها) |
| احراز هویت | کلید عمومی `NEXT_PUBLIC_FIREBASE_*` | Service Account (`FIREBASE_ADMIN_*`) |
| دسترسی به داده | محدود به Security Rules | دسترسی کامل (bypass Rules) |

در حال حاضر تمام خواندن/نوشتن واقعی داده (requests/providers/payments) از طریق **Admin SDK** در Route Handlerها انجام می‌شود — `db` از `config.ts` در حال حاضر جایی مصرف نمی‌شود، اما به‌عنوان زیرساخت برای فیچرهای real-time سمت کلاینت آینده نگه داشته شده.

### چرا Firestore Rules همه‌چیز را می‌بندد؟

`firestore.rules` طراحی شده تا با این معماری هم‌خوان باشد:

```
requests: create=true (مشتری مستقیم می‌تواند بسازد) ، read/update/delete=false
providers, payments: read/write=false
```

یعنی تنها راه خواندن/تغییر داده، عبور از Route Handlerهای سرور (که Admin SDK دارند و Rules را دور می‌زنند) است. این یعنی **کنترل دسترسی واقعی در Route Handlerها و میدل‌ور پیاده می‌شود، نه در Firestore Rules** — نکته‌ای مهم برای هر توسعه‌دهنده‌ای که یک endpoint جدید اضافه می‌کند: باید حواسش به auth check باشد چون Rules چیزی را متوقف نمی‌کند.

## الگوی Lazy-Init برای Firebase Admin

```mermaid
sequenceDiagram
    participant Build as "next build (Vercel)"
    participant Module as "admin.ts (import time)"
    participant Route as "Route Handler (runtime)"
    participant FB as "Firebase Admin SDK"

    Build->>Module: import adminDb
    Note over Module: قبلاً: cert() فوراً صدا زده می‌شد و بدون env vars بیلد fail می‌کرد
    Note over Module: الان: adminDb یک Proxy خالی است، هیچ init واقعی رخ نمی‌دهد
    Route->>Module: adminDb.collection("requests")
    Module->>FB: getAdminApp() + cert() (اولین استفاده‌ی واقعی)
    FB-->>Route: Firestore instance
```

این الگو (کامیت `c35de6f`) یک تصمیم معماری مهم است: چون Next.js هنگام `next build` برای جمع‌آوری داده‌ی مسیرها ماژول‌ها را import می‌کند، هر کد سطح-ماژول که فوراً به env varهای اختیاری وابسته باشد، بیلد را می‌شکند. راه‌حل: `adminDb` یک `Proxy` است که init واقعی (`getAdminApp` → `getFirestore`) را تا اولین `.collection(...)` واقعی به تعویق می‌اندازد. **هر کد جدیدی که به سرویس بیرونی وابسته با env var اختیاری نیاز دارد، باید همین الگو را رعایت کند.**

## جریان احراز هویت ادمین

```mermaid
sequenceDiagram
    participant U as ادمین (مرورگر)
    participant L as "/admin/login"
    participant API as "POST /api/admin/auth"
    participant MW as middleware.ts
    participant P as "/admin/*"

    U->>L: وارد کردن پسورد
    L->>API: POST { password }
    API->>API: verifyAdminPassword (bcrypt.compare با ADMIN_PASSWORD_HASH)
    API->>API: signAdminToken (jose, HS256, انقضا 12h)
    API-->>U: Set-Cookie admin_token (httpOnly, secure در prod, sameSite=strict)
    U->>P: درخواست هر صفحه‌ی /admin/*
    MW->>MW: verifyAdminToken(cookie)
    alt توکن معتبر
        MW-->>P: NextResponse.next()
    else نامعتبر/موجود نیست
        MW-->>L: redirect به /admin/login
    end
```

نکات امنیتی رعایت‌شده: کوکی `httpOnly` (غیرقابل خواندن با JS سمت کلاینت)، `sameSite: strict`، `secure` فقط در production. رمز JWT از `JWT_SECRET` خوانده می‌شود و یک fallback توسعه (`dev-secret-change-me`) دارد — **این fallback هرگز نباید در production واقعی استفاده شود**؛ اطمینان از تنظیم `JWT_SECRET` در Vercel الزامی است.

## جریان ثبت درخواست مشتری (Happy Path طراحی‌شده — UI هنوز ناقص)

```mermaid
sequenceDiagram
    participant C as مشتری
    participant F as "/request (فرم — هنوز ساخته نشده)"
    participant API as "POST /api/requests"
    participant Z as createRequestSchema (Zod)
    participant DB as Firestore (requests)
    participant Conf as "/request/confirm"

    C->>F: انتخاب سرویس، نام، تلفن، موقعیت (useLocation)
    F->>API: POST { name, phone, serviceType, locationLat, locationLng, ... }
    API->>Z: safeParse(body)
    alt نامعتبر
        Z-->>API: error
        API-->>F: 422 + جزئیات خطا (فارسی)
    else معتبر
        API->>DB: adminDb.collection("requests").doc().set({...status: PENDING})
        DB-->>API: id
        API-->>F: 201 { id }
        F->>Conf: ریدایرکت
    end
```

Route Handler و اسکیمای Zod آماده و کامل‌اند؛ حلقه‌ی گمشده، خودِ کامپوننت فرم در `src/app/request/page.tsx` است (نگاه کن به [`MODULES.md`](./MODULES.md)).

## RTL و رندر فارسی

- `<html lang="fa" dir="rtl">` در `src/app/layout.tsx` — این جهت را برای کل درخت DOM تنظیم می‌کند؛ Tailwind از کلاس‌های logical-agnostic استفاده می‌کند (مثلاً `flex`, `gap`) که با RTL به‌طور طبیعی کار می‌کنند.
- فونت **Vazirmatn** به‌صورت **self-hosted** (نه Google Fonts CDN) با `next/font/local` بارگذاری می‌شود — این هم برای پرفورمنس (بدون درخواست شبکه‌ی خارجی) و هم برای استقلال از دسترسی به فونت‌های خارجی در build/runtime مهم است.
- اعداد فارسی (۰۱، ۰۲، ...) در جاهایی مثل `STEPS` در `page.tsx` به‌صورت hardcode رشته‌ای نوشته شده‌اند، نه با `toLocaleString("fa-IR")` — یک الگوی موجود که باید در کد جدید مشابه رعایت شود مگر تصمیم آگاهانه‌ای برای تغییر گرفته شود.

## دیپلوی

```mermaid
graph LR
    Dev[توسعه‌دهنده / Claude sandbox] -->|git push| GH["GitHub: masbnf/tr (master)"]
    GH -->|Webhook خودکار| V[Vercel Build]
    V -->|next build| Out[.next output]
    Out -->|دیپلوی خودکار| Prod[پروداکشن]
```

هیچ CI/CD جداگانه‌ای (GitHub Actions و...) در ریپو تعریف نشده؛ Vercel به‌تنهایی مسئول build و دیپلوی از برنچ `master` است. بنابراین **هر push به master مستقیماً پروداکشن را تحت تاثیر قرار می‌دهد** — لازم است `npm run build` و `npm run typecheck` قبل از push به‌صورت محلی اجرا شوند.
