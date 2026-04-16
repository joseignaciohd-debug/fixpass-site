import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { users } from "@/lib/demo-data";
import { createSupabaseAuthServerClient } from "@/lib/integrations/supabase/auth-server";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";
import { Role } from "@/lib/types";

export const DEMO_ROLE_COOKIE = "fixpass_demo_role";

export type DemoSession = {
  role: Role;
  userId: string;
  name: string;
  email?: string;
};

const roleDefaults: Record<Role, string> = {
  customer: "cust_1",
  technician: "tech_1",
  admin: "admin_1",
};

function allowDemoFallback() {
  return !isSupabaseServerConfigured() && process.env.NODE_ENV !== "production";
}

async function getLiveSession(): Promise<DemoSession | null> {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const authClient = await createSupabaseAuthServerClient();
  const serverClient = createSupabaseServerClient();

  if (!authClient || !serverClient) {
    return null;
  }

  const {
    data: { user: authUser },
  } = await authClient.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data: appUser, error } = await serverClient
    .from("users")
    .select("id,role,full_name,email")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (error || !appUser?.id || !appUser.role) {
    return null;
  }

  return {
    role: appUser.role as Role,
    userId: appUser.id,
    name: appUser.full_name,
    email: appUser.email,
  };
}

async function getFallbackDemoSession(): Promise<DemoSession | null> {
  const store = await cookies();
  const role = store.get(DEMO_ROLE_COOKIE)?.value as Role | undefined;

  if (!role || !(role in roleDefaults)) {
    return null;
  }

  const userId = roleDefaults[role];
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    return null;
  }

  return {
    role,
    userId,
    name: user.name,
    email: user.email,
  };
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const liveSession = await getLiveSession();
  if (liveSession) {
    return liveSession;
  }

  if (!allowDemoFallback()) {
    return null;
  }

  return getFallbackDemoSession();
}

export async function requireDemoRole(role: Role) {
  const session = await getDemoSession();

  if (!session || session.role !== role) {
    redirect(`/sign-in?next=/${role}`);
  }

  return session;
}

export async function isRealWebAuthEnabled() {
  return isSupabaseServerConfigured();
}
