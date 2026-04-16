import { NextRequest, NextResponse } from "next/server";
import { DEMO_ROLE_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete(DEMO_ROLE_COOKIE);
  return response;
}
