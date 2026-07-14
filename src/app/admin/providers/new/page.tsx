import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminNewProviderPage() {
  return (
    <AdminShell>
      <AdminDashboard view="providers" />
    </AdminShell>
  );
}
