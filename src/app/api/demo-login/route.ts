import { NextRequest, NextResponse } from "next/server";
import { DEMO_ROLE_COOKIE } from "@/lib/auth";
import { Role } from "@/lib/types";

const validRoles: Role[] = ["customer", "technician", "admin"];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") as Role | null;
  const next = url.searchParams.get("next");

  if (!role || !validRoles.includes(role)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const response = NextResponse.redirect(new URL(next || `/${role}`, request.url));
  response.cookies.set(DEMO_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return response;
}
