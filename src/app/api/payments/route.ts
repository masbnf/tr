import { NextRequest, NextResponse } from "next/server";
import { logPaymentSchema } from "@/lib/validators";
import { logPayment, getDailyRevenue } from "@/lib/firebase/payments";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = logPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const id = await logPayment(parsed.data);
  return NextResponse.json({ id }, { status: 201 });
}

export async function GET() {
  const revenue = await getDailyRevenue();
  return NextResponse.json(revenue);
}
