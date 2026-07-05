import { z } from "zod";
import { ServiceType } from "@/types/enums";

// Zod = Laravel FormRequest equivalent
export const createRequestSchema = z.object({
  name:        z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  phone:       z.string().regex(/^09[0-9]{9}$/, "شماره موبایل معتبر نیست"),
  serviceType: z.nativeEnum(ServiceType, { message: "نوع سرویس انتخاب نشده" }),
  description: z.string().max(500).optional(),
  locationLat: z.number({ message: "لوکیشن دریافت نشد" }),
  locationLng: z.number({ message: "لوکیشن دریافت نشد" }),
});

export const createProviderSchema = z.object({
  name:        z.string().min(2),
  phone:       z.string().regex(/^09[0-9]{9}$/),
  serviceType: z.nativeEnum(ServiceType),
  isActive:    z.boolean().default(true),
});

export const logPaymentSchema = z.object({
  requestId:  z.string().min(1),
  totalPrice: z.number().positive("مبلغ باید بزرگتر از صفر باشد"),
  status:     z.enum(["settled", "pending"]).default("settled"),
});

export type CreateRequestInput  = z.infer<typeof createRequestSchema>;
export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type LogPaymentInput     = z.infer<typeof logPaymentSchema>;
