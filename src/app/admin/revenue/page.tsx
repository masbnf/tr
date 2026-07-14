import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminRevenuePage() {
  return (
    <AdminShell>
      <AdminDashboard view="revenue" />
    </AdminShell>
  );
}
