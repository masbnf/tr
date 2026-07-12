import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سفارش‌ها</h1>
      <OrdersTable />
    </div>
  );
}
