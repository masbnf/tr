import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <AdminDashboard view="orders" />
    </AdminShell>
  );
}
