import { NextRequest, NextResponse } from "next/server";
import { getRequest, updateRequestStatus } from "@/lib/firebase/requests";
import { OrderStatus } from "@/types/enums";
import { verifyAdminRequest } from "@/lib/auth";

// GET /api/requests/:id — admin-only, see note in api/requests/route.ts
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const request = await getRequest(params.id);
  if (!request) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
  return NextResponse.json(request);
}

// PATCH /api/requests/:id — update status and/or assign provider, admin-only
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const { status, assignedProvider } = await req.json();

    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 422 });
    }

    await updateRequestStatus(params.id, status, assignedProvider);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
