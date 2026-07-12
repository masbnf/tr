"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createRequestSchema, CreateRequestInput } from "@/lib/validators";
import { SERVICE_OPTIONS } from "@/constants/services";
import { ServiceType } from "@/types/enums";
import { useLocation } from "@/hooks/useLocation";

/**
 * Landing-page hotspots (SERVICE_HOTSPOTS in app/page.tsx) link here with
 * ?service=<slug>, but they cover 10 display services while ServiceType only
 * has 4 real values (see docs/MODULES.md — «ناهماهنگی شناخته‌شده»). Only the
 * two slugs that are an unambiguous 1:1 match with a real ServiceType are
 * pre-selected here; the rest intentionally fall through to "no selection"
 * rather than guessing a mapping that hasn't been decided on yet.
 */
function serviceTypeFromSlug(slug: string | null): ServiceType | undefined {
  if (slug === "battery") return ServiceType.BATTERY;
  if (slug === "oil-change") return ServiceType.OIL_CHANGE;
  return undefined;
}

export default function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = serviceTypeFromSlug(searchParams.get("service"));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: initialService ? { serviceType: initialService } : undefined,
  });

  const selectedService = watch("serviceType");
  const { lat, lng, error: locationError, loading: locationLoading, getLocation } = useLocation();

  // Sync the browser geolocation result into the form's validated fields.
  useEffect(() => {
    if (lat !== null && lng !== null) {
      setValue("locationLat", lat, { shouldValidate: true });
      setValue("locationLng", lng, { shouldValidate: true });
    }
  }, [lat, lng, setValue]);

  const onSubmit = async (data: CreateRequestInput) => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("ثبت درخواست ناموفق بود. لطفاً دوباره تلاش کنید.");
        return;
      }

      router.push("/request/confirm");
    } catch {
      toast.error("خطا در ارتباط با سرور. اتصال اینترنت خود را بررسی کنید.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          نام و نام خانوادگی
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="مثلاً علی رضایی"
          className="input-field"
          {...register("name")}
        />
        {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
          شماره موبایل
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          dir="ltr"
          maxLength={11}
          autoComplete="tel"
          placeholder="09123456789"
          className="input-field text-left"
          {...register("phone")}
        />
        {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <span className="block text-sm font-semibold text-slate-700 mb-1.5">نوع خدمت</span>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="نوع خدمت">
          {SERVICE_OPTIONS.map((opt) => {
            const active = selectedService === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setValue("serviceType", opt.value, { shouldValidate: true })}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/50"
                }`}
              >
                <span aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
        {/* Hidden field keeps serviceType registered so react-hook-form/zodResolver
            tracks it the same way as the other inputs above. */}
        <input type="hidden" {...register("serviceType")} />
        {errors.serviceType && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.serviceType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          توضیحات <span className="text-slate-400 font-normal">(اختیاری)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="مثلاً ماشین روشن نمی‌شود، باتری خوابیده به‌نظر می‌رسد..."
          className="input-field resize-none"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <span className="block text-sm font-semibold text-slate-700 mb-1.5">موقعیت مکانی</span>
        <button
          type="button"
          onClick={getLocation}
          disabled={locationLoading}
          className="btn-outline w-full"
        >
          {locationLoading
            ? "در حال دریافت موقعیت..."
            : lat !== null && lng !== null
            ? "✓ موقعیت شما دریافت شد — دریافت مجدد"
            : "دریافت موقعیت من"}
        </button>
        {locationError && <p className="mt-1.5 text-xs font-medium text-red-600">{locationError}</p>}
        {!locationError && (errors.locationLat || errors.locationLng) && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.locationLat?.message ?? errors.locationLng?.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "در حال ارسال..." : "ثبت درخواست"}
      </button>
    </form>
  );
}
