"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { OrderStatus, ServiceType } from "@/types/enums";
import { STATUS_CONFIG } from "@/constants/status";
import { SERVICE_OPTIONS } from "@/constants/services";
import { Provider } from "@/types/provider";
import { ServiceRequest } from "@/types/request";

type RequestRow = Omit<ServiceRequest, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt?: string;
};

type Revenue = { total: number; commission: number; count: number };

const SERVICE_LABELS = Object.fromEntries(
  SERVICE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<ServiceType, string>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function AdminDashboard({
  view = "dashboard",
}: {
  view?: "dashboard" | "orders" | "providers" | "revenue";
}) {
  const [orders, setOrders] = useState<RequestRow[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [revenue, setRevenue] = useState<Revenue>({ total: 0, commission: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [ordersRes, providersRes, revenueRes] = await Promise.all([
        fetch("/api/requests", { cache: "no-store" }),
        fetch("/api/providers", { cache: "no-store" }),
        fetch("/api/payments", { cache: "no-store" }),
      ]);

      if (ordersRes.status === 401) {
        setError("نشست مدیریت منقضی شده است. دوباره وارد شوید.");
        return;
      }

      if (!ordersRes.ok) throw new Error("orders");

      setOrders(await ordersRes.json());
      if (providersRes.ok) setProviders(await providersRes.json());
      if (revenueRes.ok) setRevenue(await revenueRes.json());
    } catch {
      setError("دریافت اطلاعات پنل با خطا روبه‌رو شد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => order.status === OrderStatus.PENDING).length;
    const active = orders.filter((order) => [OrderStatus.ASSIGNED, OrderStatus.ON_THE_WAY].includes(order.status)).length;
    const completed = orders.filter((order) => order.status === OrderStatus.COMPLETED).length;
    return [
      { label: "کل سفارش‌ها", value: orders.length, tone: "from-white/20 to-white/10" },
      { label: "در انتظار بررسی", value: pending, tone: "from-amber-400/20 to-amber-400/10" },
      { label: "در حال انجام", value: active, tone: "from-brand-400/25 to-brand-400/10" },
      { label: "تکمیل‌شده", value: completed, tone: "from-emerald-400/20 to-emerald-400/10" },
    ];
  }, [orders]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
      }
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:p-7">
        <p className="text-xs font-bold tracking-widest text-brand-300">ADMIN CONTROL</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">مدیریت مکانیکا</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
              نمای عملیاتی سفارش‌ها، متخصص‌ها و درآمد روزانه با همان هویت بصری سایت.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:border-brand-300 hover:bg-brand-500/20"
          >
            تازه‌سازی
          </button>
        </div>
      </header>

      {error ? <div className="rounded-2xl border border-brand-300/30 bg-brand-500/15 p-4 text-sm font-bold text-brand-50">{error}</div> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.tone} p-5 shadow-card`}>
            <p className="text-sm font-bold text-white/60">{stat.label}</p>
            <p className="mt-3 text-3xl font-black">{formatNumber(stat.value)}</p>
          </div>
        ))}
      </section>

      {(view === "dashboard" || view === "orders") && (
        <section className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-600">ORDERS</p>
              <h3 className="text-xl font-black">سفارش‌ها</h3>
            </div>
            <span className="text-sm font-bold text-slate-500">{loading ? "در حال دریافت..." : `${formatNumber(orders.length)} سفارش`}</span>
          </div>
          <OrdersTable rows={view === "dashboard" ? orders.slice(0, 6) : orders} pendingIds={pendingIds} onStatusChange={changeStatus} loading={loading} />
        </section>
      )}

      {view === "providers" && (
        <section className="grid gap-5">
          <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-card sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-bold tracking-widest text-brand-600">PROVIDERS</p>
              <h3 className="text-xl font-black">متخصص‌ها</h3>
            </div>
            <ProvidersList providers={providers} />
          </div>
        </section>
      )}

      {(view === "dashboard" || view === "revenue") && (
        <section className="grid gap-4 lg:grid-cols-3">
          <RevenueCard label="درآمد امروز" value={`${formatNumber(revenue.total)} تومان`} />
          <RevenueCard label="کمیسیون امروز" value={`${formatNumber(revenue.commission)} تومان`} />
          <RevenueCard label="پرداخت تسویه‌شده" value={`${formatNumber(revenue.count)} مورد`} />
        </section>
      )}
    </div>
  );
}

function OrdersTable({
  rows,
  pendingIds,
  onStatusChange,
  loading,
}: {
  rows: RequestRow[];
  pendingIds: Set<string>;
  onStatusChange: (id: string, status: OrderStatus) => void;
  loading: boolean;
}) {
  if (loading) {
    return <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">در حال بارگذاری سفارش‌ها...</p>;
  }

  if (rows.length === 0) {
    return <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">هنوز سفارشی ثبت نشده است.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-right text-xs text-slate-500">
            <th className="px-3 py-3 font-black">مشتری</th>
            <th className="px-3 py-3 font-black">تماس</th>
            <th className="px-3 py-3 font-black">خدمت</th>
            <th className="px-3 py-3 font-black">زمان ثبت</th>
            <th className="px-3 py-3 font-black">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-4 font-black text-slate-900">{row.name}</td>
              <td className="px-3 py-4 text-slate-600" dir="ltr">
                {row.phone}
              </td>
              <td className="px-3 py-4 text-slate-600">{SERVICE_LABELS[row.serviceType] ?? row.serviceType}</td>
              <td className="px-3 py-4 text-xs font-bold text-slate-500">{formatDate(row.createdAt)}</td>
              <td className="px-3 py-4">
                <select
                  value={row.status}
                  disabled={pendingIds.has(row.id)}
                  onChange={(event) => onStatusChange(row.id, event.target.value as OrderStatus)}
                  className={`rounded-full border-0 px-3 py-2 text-xs font-black outline-none disabled:opacity-50 ${STATUS_CONFIG[row.status].color}`}
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProvidersList({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) {
    return <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">هنوز متخصصی ثبت نشده است.</p>;
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <div key={provider.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-slate-900">{provider.name}</p>
            <p className="mt-1 text-sm font-bold text-slate-500" dir="ltr">
              {provider.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {SERVICE_LABELS[provider.serviceType] ?? provider.serviceType}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${provider.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {provider.isActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProviderComposer({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.MECHANIC);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, serviceType, isActive: true }),
      });
      if (res.ok) {
        setName("");
        setPhone("");
        setServiceType(ServiceType.MECHANIC);
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-card">
      <p className="text-xs font-bold tracking-widest text-brand-300">NEW PROVIDER</p>
      <h3 className="mt-2 text-xl font-black text-white">ثبت متخصص جدید</h3>
      <div className="mt-5 space-y-3">
        <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="نام متخصص" required />
        <input className="input-field" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="شماره تماس" dir="ltr" required />
        <select className="input-field" value={serviceType} onChange={(event) => setServiceType(event.target.value as ServiceType)}>
          {SERVICE_OPTIONS.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand-500 px-5 py-3 font-black text-white transition hover:bg-brand-600 disabled:opacity-60">
          {loading ? "در حال ثبت..." : "ثبت متخصص"}
        </button>
      </div>
    </form>
  );
}

function RevenueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-card">
      <p className="text-sm font-bold text-white/60">{label}</p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
