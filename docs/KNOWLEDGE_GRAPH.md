# نقشه‌ی دانش (Knowledge Graph)

این گراف از بررسی واقعی تمام importهای داخلی پروژه (`grep` روی `src/`) ساخته شده — هر یال یعنی «این فایل واقعاً آن فایل را import می‌کند»، نه یک رابطه‌ی فرضی.

## گراف کامل وابستگی‌ها

```mermaid
graph LR
    subgraph Pages["صفحات"]
        Landing["app/page.tsx"]
    end

    subgraph API["Route Handlers"]
        AuthAPI["api/admin/auth/route.ts"]
        ReqAPI["api/requests/route.ts"]
        ReqIdAPI["api/requests/[id]/route.ts"]
        ProvAPI["api/providers/route.ts"]
        ProvIdAPI["api/providers/[id]/route.ts"]
        PayAPI["api/payments/route.ts"]
    end

    subgraph Middleware["میدل‌ور"]
        MW["middleware.ts"]
    end

    subgraph Lib["src/lib"]
        Auth["lib/auth.ts"]
        Commission["lib/commission.ts"]
        Validators["lib/validators.ts"]
        AdminDB["lib/firebase/admin.ts"]
        ReqDB["lib/firebase/requests.ts"]
        ProvDB["lib/firebase/providers.ts"]
        PayDB["lib/firebase/payments.ts"]
    end

    subgraph Types["src/types"]
        Enums["types/enums.ts"]
        ReqType["types/request.ts"]
        ProvType["types/provider.ts"]
        PayType["types/payment.ts"]
    end

    subgraph Components["src/components"]
        Navbar["components/layout/Navbar.tsx"]
        Footer["components/layout/Footer.tsx"]
        Icons["components/ui/Icons.tsx"]
    end

    Landing --> Navbar
    Landing --> Footer
    Landing --> Icons
    Footer --> Icons

    MW --> Auth
    AuthAPI --> Auth

    ReqAPI --> Validators
    ReqAPI --> ReqDB
    ReqIdAPI --> ReqDB
    ReqIdAPI --> Enums

    ProvAPI --> Validators
    ProvAPI --> ProvDB
    ProvIdAPI --> ProvDB

    PayAPI --> Validators
    PayAPI --> PayDB

    Validators --> Enums

    ReqDB --> AdminDB
    ReqDB --> ReqType
    ReqDB --> Enums
    ProvDB --> AdminDB
    ProvDB --> ProvType
    PayDB --> AdminDB
    PayDB --> PayType
    PayDB --> Commission

    ReqType --> Enums
    ProvType --> Enums
```

## نودهای «یتیم» (نوشته شده، هنوز مصرف نشده)

با بررسی کامل import graph، فایل‌های زیر توسط **هیچ** فایل دیگری import نمی‌شوند. (به‌روزرسانی ۲۰۲۶-۰۷-۱۲: `hooks/useLocation.ts` و `constants/services.ts` با `RequestForm.tsx` مصرف شدند؛ `constants/status.ts` با `OrdersTable.tsx` مصرف شد. `hooks/useAuth.ts` عمداً مصرف نشد — صفحات ادمین از `middleware.ts` برای گارد و از `fetch` مستقیم برای دیتا استفاده می‌کنند؛ `useAuth` یک لایه‌ی UI-only اضافه‌ست که فعلاً جایی لازمش ندارد.)

| فایل | برای چه چیزی آماده است |
|---|---|
| `hooks/useAuth.ts` | نمایش شرطی UI بر اساس وجود کوکی (مثلاً اگر بخوای بخشی از یک صفحه‌ی عمومی را بسته به لاگین بودن ادمین نشان/پنهان کنی) |
| `lib/maps.ts` | ساخت لینک نقشه در پنل ادمین (کاندید طبیعی: صفحه‌ی جزئیات سفارش `admin/orders/[id]`) |
| `lib/firebase/config.ts` (`db`) | فیچر real-time سمت کلاینت |

این‌ها **کد مرده نیستند** — زیرساخت از‌پیش‌آماده‌شده برای صفحات placeholder هستند (به [`ROADMAP.md`](./ROADMAP.md#اولویت-پایین--زیرساخت-آماده-ولی-بلااستفاده) مراجعه کن).

## خوشه‌های مفهومی (Domain Clusters)

```mermaid
graph TD
    subgraph RequestDomain["دامنه: درخواست خدمت"]
        R1[ServiceRequest type]
        R2[createRequestSchema]
        R3[lib/firebase/requests.ts]
        R4["api/requests/*"]
    end

    subgraph ProviderDomain["دامنه: نیروی خدماتی"]
        P1[Provider type]
        P2[createProviderSchema]
        P3[lib/firebase/providers.ts]
        P4["api/providers/*"]
    end

    subgraph PaymentDomain["دامنه: پرداخت/کمیسیون"]
        M1[Payment type]
        M2[logPaymentSchema]
        M3[lib/firebase/payments.ts]
        M4["api/payments/*"]
        M5[lib/commission.ts]
    end

    subgraph AuthDomain["دامنه: احراز هویت ادمین"]
        A1[lib/auth.ts]
        A2[middleware.ts]
        A3["api/admin/auth/route.ts"]
    end

    R4 -.->|assignedProvider: string ID، بدون reference واقعی| P1
    M3 -->|calcCommission| M5
    A2 -->|محافظت از| ProviderDomain
    A2 -->|محافظت از| RequestDomain
    A2 -->|محافظت از| PaymentDomain
```

**نکته‌ی مهم:** رابطه‌ی بین `ServiceRequest` و `Provider` (فیلد `assignedProvider`) یک **string ID ساده** است، نه یک reference واقعی Firestore یا foreign key با integrity check — یعنی هیچ‌جای کد تضمین نمی‌کند که یک `assignedProvider` واقعاً به یک سند موجود در `providers` اشاره کند. اگر نیازی به این تضمین بود، باید موقع پیاده‌سازی صفحه‌ی تخصیص نیرو در پنل ادمین اضافه شود.

## چطور این گراف را به‌روز نگه داریم

هر بار که یک import جدید بین فایل‌ها اضافه/حذف شد (به‌خصوص وقتی صفحات placeholder پیاده‌سازی می‌شوند)، این دستور را دوباره اجرا کن و گراف را sync کن:

```bash
grep -rn "from \"@/\|from \"\./\|from \"\.\./" src --include=*.ts --include=*.tsx
```
