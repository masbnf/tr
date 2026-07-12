import { NextRequest, NextResponse } from "next/server";
import { createRequestSchema } from "@/lib/validators";
import { createRequest, getAllRequests } from "@/lib/firebase/requests";
import { verifyAdminRequest } from "@/lib/auth";

// POST /api/requests — customer submits a new request (intentionally public,
// matches firestore.rules "allow create: if true" for the requests collection)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const id = await createRequest(parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// GET /api/requests — admin fetches all requests. middleware.ts only guards
// "/admin/:path*" pages, not "/api/*", so this route checks the cookie itself.
export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const requests = await getAllRequests();
    return NextResponse.json(requests);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
