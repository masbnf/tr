import { ServiceType } from "@/types/enums";

export const SERVICE_OPTIONS = [
  { value: ServiceType.MECHANIC,   label: "مکانیک سیار",    icon: "🔧" },
  { value: ServiceType.BATTERY,    label: "باتری",           icon: "🔋" },
  { value: ServiceType.TOW,        label: "یدک‌کش",          icon: "🚛" },
  { value: ServiceType.OIL_CHANGE, label: "تعویض روغن",     icon: "🛢️" },
] as const;
