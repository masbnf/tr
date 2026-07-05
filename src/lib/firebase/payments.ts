import { adminDb } from "./admin";
import { Payment, CreatePaymentInput } from "@/types/payment";
import { calcCommission } from "@/lib/commission";

const COL = "payments";

export async function logPayment(data: CreatePaymentInput): Promise<string> {
  const ref = adminDb.collection(COL).doc();
  await ref.set({
    ...data,
    commission: calcCommission(data.totalPrice),
    createdAt: new Date(),
  });
  return ref.id;
}

export async function getDailyRevenue(): Promise<{ total: number; commission: number; count: number }> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const snap = await adminDb
    .collection(COL)
    .where("createdAt", ">=", start)
    .where("status", "==", "settled")
    .get();

  const docs = snap.docs.map((d) => d.data() as Payment);
  return {
    count:      docs.length,
    total:      docs.reduce((s, p) => s + p.totalPrice, 0),
    commission: docs.reduce((s, p) => s + p.commission, 0),
  };
}
