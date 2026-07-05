export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <div><h1 className="text-xl font-bold">سفارش #{params.id}</h1></div>;
}
