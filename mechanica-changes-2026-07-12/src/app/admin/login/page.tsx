"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setError(body?.error ?? "خطایی رخ داد. دوباره تلاش کنید.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور. اتصال اینترنت خود را بررسی کنید.");
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">ورود ادمین</h1>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
          </div>

          <button type="submit" disabled={loading || password.length === 0} className="btn-primary w-full">
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </main>
  );
}
