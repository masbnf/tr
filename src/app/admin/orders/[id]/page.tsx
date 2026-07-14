import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminOrderDetailPage() {
  return (
    <AdminShell>
      <AdminDashboard view="orders" />
    </AdminShell>
  );
}
