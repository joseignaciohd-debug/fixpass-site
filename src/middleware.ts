import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEMO_ROLE_COOKIE } from "@/lib/auth";

const protectedPrefixes = ["/customer", "/technician", "/admin"];

function hasLiveConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function parseRole(pathname: string) {
  const protectedPrefix = protectedPrefixes.find((prefix) => pathname.startsWith(prefix));
  return protectedPrefix ? protectedPrefix.slice(1) : null;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const requiredRole = parseRole(pathname);

  if (!requiredRole) {
    return NextResponse.next();
  }

  if (!hasLiveConfig()) {
    const currentRole = request.cookies.get(DEMO_ROLE_COOKIE)?.value;

    if (currentRole !== requiredRole) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  response.cookies.delete(DEMO_ROLE_COOKIE);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  const appUserResponse = await fetch(`${url}/rest/v1/users?auth_user_id=eq.${user.id}&select=role`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!appUserResponse.ok) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("error", "role");
    return NextResponse.redirect(signInUrl);
  }

  const appUsers = (await appUserResponse.json()) as Array<{ role?: string }>;
  const appRole = appUsers[0]?.role;

  if (appRole !== requiredRole) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", `${pathname}${search}`);
    signInUrl.searchParams.set("error", "role");
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/customer/:path*", "/technician/:path*", "/admin/:path*"],
};
