export enum ServiceType {
  MECHANIC   = "mechanic",    // مکانیک سیار
  BATTERY    = "battery",     // باتری
  TOW        = "tow",         // یدک‌کش
  OIL_CHANGE = "oil_change",  // تعویض روغن
}

export enum OrderStatus {
  PENDING    = "pending",     // در حال بررسی
  ASSIGNED   = "assigned",    // تخصیص یافته
  ON_THE_WAY = "on_the_way",  // در راه
  COMPLETED  = "completed",   // انجام شد
  CANCELLED  = "cancelled",   // لغو شد
}
