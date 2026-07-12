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
      className="mt-auto text-sm text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 text-right"
    >
      {loading ? "در حال خروج..." : "🚪 خروج"}
    </button>
  );
}
