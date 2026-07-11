// TODO: implement RequestForm component

/* Backward-compatible query parsing: existing car hotspots/chips only ever
   send `?service=`, so `vehicle` defaults to "car" when absent — older links
   keep working unchanged. New motorcycle/bicycle links add `?vehicle=`. */
const VEHICLE_LABELS: Record<string, string> = {
  car: "خودرو",
  motorcycle: "موتورسیکلت",
  bicycle: "دوچرخه",
};

export default function RequestPage({
  searchParams,
}: {
  searchParams?: { vehicle?: string; service?: string };
}) {
  const vehicle = searchParams?.vehicle ?? "car";
  const service = searchParams?.service;
  const vehicleLabel = VEHICLE_LABELS[vehicle] ?? VEHICLE_LABELS.car;

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ثبت درخواست</h1>
      {/* <RequestForm vehicle={vehicle} service={service} /> */}
      <p className="text-gray-400 text-sm">فرم در حال ساخت...</p>
      {service && (
        <p className="text-gray-500 text-sm mt-2">
          سرویس انتخابی: {service} · نوع وسیله: {vehicleLabel}
        </p>
      )}
    </main>
  );
}
