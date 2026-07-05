import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") &&
                       !req.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminRoute) {
    const token = req.cookies.get("admin_token")?.value ?? "";
    const valid = await verifyAdminToken(token);

    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
