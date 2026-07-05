export interface Payment {
  id:         string;
  requestId:  string;
  totalPrice: number;
  commission: number;   // totalPrice * COMMISSION_RATE
  status:     "settled" | "pending";
  createdAt:  Date;
}

export type CreatePaymentInput = Omit<Payment, "id" | "commission" | "createdAt">;
