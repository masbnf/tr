"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("رمز عبور درست نیست.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-white/75">رمز عبور مدیریت</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/20"
          placeholder="رمز عبور را وارد کنید"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <p className="rounded-2xl bg-brand-500/15 px-4 py-3 text-sm font-bold text-brand-100">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-brand-500 px-5 py-4 font-black text-white shadow-[0_10px_32px_rgba(232,0,42,0.35)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "در حال ورود..." : "ورود به پنل"}
      </button>
    </form>
  );
}
