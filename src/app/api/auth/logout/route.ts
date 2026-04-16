import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEMO_ROLE_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const response = NextResponse.redirect(new URL("/sign-in", request.url));

  response.cookies.delete(DEMO_ROLE_COOKIE);

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.headers.get("cookie")
          ?.split(";")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => {
            const [name, ...rest] = item.split("=");
            return { name, value: rest.join("=") };
          }) ?? [];
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.signOut();

  return response;
}
