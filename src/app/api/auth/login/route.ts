import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

type PendingCookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

function buildRedirect(request: NextRequest, pathname: string, params?: Record<string, string>) {
  const url = new URL(pathname, request.url);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url;
}

function redirect303(url: URL) {
  return NextResponse.redirect(url, { status: 303 });
}

function applyPendingCookies(response: NextResponse, pendingCookies: PendingCookie[]) {
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return redirect303(buildRedirect(request, "/sign-in", { error: "config" }));
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    return redirect303(buildRedirect(request, "/sign-in", { error: "credentials", next }));
  }

  const pendingCookies: PendingCookie[] = [];
  const authClient = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options });
        });
      },
    },
  });

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return applyPendingCookies(
      redirect303(buildRedirect(request, "/sign-in", { error: "credentials", next })),
      pendingCookies,
    );
  }

  const appUserResponse = await fetch(`${supabaseUrl}/rest/v1/users?auth_user_id=eq.${data.user.id}&select=role`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!appUserResponse.ok) {
    await authClient.auth.signOut();
    return applyPendingCookies(
      redirect303(buildRedirect(request, "/sign-in", { error: "role", next })),
      pendingCookies,
    );
  }

  const appUsers = (await appUserResponse.json()) as Array<{ role?: string }>;
  const role = appUsers[0]?.role;

  if (!role || !["customer", "technician", "admin"].includes(role)) {
    await authClient.auth.signOut();
    return applyPendingCookies(
      redirect303(buildRedirect(request, "/sign-in", { error: "role", next })),
      pendingCookies,
    );
  }

  const destination = next && next.startsWith(`/${role}`) ? next : `/${role}`;
  return applyPendingCookies(redirect303(buildRedirect(request, destination)), pendingCookies);
}
