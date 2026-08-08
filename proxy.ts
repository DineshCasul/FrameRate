import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, hashPassword } from "@/lib/adminAuth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail closed: with no password configured, admin stays unreachable.
  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const expectedToken = await hashPassword(adminPassword);

  if (token !== expectedToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
