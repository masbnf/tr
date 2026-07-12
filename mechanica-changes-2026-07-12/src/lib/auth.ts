import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Route Handler guard — middleware.ts only matches "/admin/:path*", it does
 * NOT cover "/api/*", so admin-only API routes (e.g. GET /api/requests,
 * PATCH /api/requests/[id]) must check the cookie themselves. Call this at
 * the top of any Route Handler that should require an authenticated admin.
 */
export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  return verifyAdminToken(token);
}
