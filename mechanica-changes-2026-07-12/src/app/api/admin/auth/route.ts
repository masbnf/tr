import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const ok = await verifyAdminPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
  }

  const token = await signAdminToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   60 * 60 * 12, // 12 hours
    path:     "/",
  });
  return res;
}

// DELETE /api/admin/auth — logout: clear the admin_token cookie
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });
  return res;
}
