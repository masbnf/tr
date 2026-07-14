"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-right text-sm font-bold text-white/70 transition hover:border-brand-300/50 hover:bg-brand-500/20 hover:text-white disabled:opacity-50 lg:mt-auto"
    >
      {loading ? "در حال خروج..." : "خروج"}
    </button>
  );
}
