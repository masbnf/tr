"use client";

import { useEffect, useState } from "react";
import { ServiceRequest } from "@/types/request";
import { OrderStatus } from "@/types/enums";
import { STATUS_CONFIG } from "@/constants/status";
import { SERVICE_OPTIONS } from "@/constants/services";

// GET /api/requests serializes Date fields to ISO strings over JSON. The
// shared ServiceRequest type models the Firestore-side shape (Date), so this
// component works against the actual wire shape instead of casting everywhere.
type RequestRow = Omit<ServiceRequest, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt?: string;
};

const SERVICE_LABELS = Object.fromEntries(
  SERVICE_OPTIONS.map((opt) => [opt.value, `${opt.icon} ${opt.label}`])
);

export default function OrdersTable() {
  const [rows, setRows] = useState<RequestRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const load = async () => {
    setError(null);
    try {
      const res = await fetch("/api/requests", { cache: "no-store" });

      if (res.status === 401) {
        setError("نشست شما منقضی شده. لطفاً دوباره وارد شوید.");
        return;
      }
      if (!res.ok) {
        setError("خطا در دریافت سفارش‌ها.");
        return;
      }

      setRows(await res.json());
    } catch {
      setError("خطا در ارتباط با سرور.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id: string, status: OrderStatus) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? prev);
      }
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }

  if (rows === null) {
    return <p className="text-sm text-gray-400">در حال بارگذاری...</p>;
  }

  if (rows.length === 0) {
    return <p className="text-sm text-gray-400">هنوز درخواستی ثبت نشده است.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 bg-white rounded-xl shadow-sm">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-right text-xs text-slate-500 border-b border-slate-200">
            <th className="py-2.5 px-3 font-semibold">نام</th>
            <th className="py-2.5 px-3 font-semibold">تلفن</th>
            <th className="py-2.5 px-3 font-semibold">نوع خدمت</th>
            <th className="py-2.5 px-3 font-semibold">تاریخ</th>
            <th className="py-2.5 px-3 font-semibold">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const pending = pendingIds.has(r.id);
            return (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 px-3 font-medium text-slate-900">{r.name}</td>
                <td className="py-3 px-3 text-slate-600" dir="ltr">
                  {r.phone}
                </td>
                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                  {SERVICE_LABELS[r.serviceType] ?? r.serviceType}
                </td>
                <td className="py-3 px-3 text-slate-500 text-xs whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="py-3 px-3">
                  <select
                    value={r.status}
                    disabled={pending}
                    onChange={(e) => changeStatus(r.id, e.target.value as OrderStatus)}
                    aria-label={`تغییر وضعیت سفارش ${r.name}`}
                    className={`text-xs font-bold rounded-full pl-2.5 pr-2.5 py-1.5 border-0 outline-none cursor-pointer disabled:opacity-50 ${STATUS_CONFIG[r.status].color}`}
                  >
                    {Object.values(OrderStatus).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
