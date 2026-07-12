import LogoutButton from "@/components/admin/LogoutButton";

// Auth guard is enforced by src/middleware.ts (redirects to /admin/login
// if the admin_token cookie is missing/invalid for any /admin/* route).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar placeholder */}
      <aside className="w-56 bg-white shadow-sm p-4 hidden md:flex md:flex-col">
        <h2 className="font-bold text-lg mb-6">مکانیکا · ادمین</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <a href="/admin"           className="hover:text-blue-600">📋 سفارش‌ها</a>
          <a href="/admin/providers" className="hover:text-blue-600">🔧 نیروها</a>
          <a href="/admin/revenue"   className="hover:text-blue-600">💰 درآمد</a>
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
