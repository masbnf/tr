import { OrderStatus } from "@/types/enums";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  [OrderStatus.PENDING]:    { label: "در حال بررسی", color: "bg-yellow-100 text-yellow-800" },
  [OrderStatus.ASSIGNED]:   { label: "اعزام شد",     color: "bg-blue-100 text-blue-800"   },
  [OrderStatus.ON_THE_WAY]: { label: "در راه",        color: "bg-orange-100 text-orange-800" },
  [OrderStatus.COMPLETED]:  { label: "انجام شد",      color: "bg-green-100 text-green-800" },
  [OrderStatus.CANCELLED]:  { label: "لغو شد",        color: "bg-red-100 text-red-800"     },
};
