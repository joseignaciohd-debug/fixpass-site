import { PortalShell } from "@/components/layout/portal-shell";
import { requireDemoRole } from "@/lib/auth";
import { portalNavigation } from "@/lib/config/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireDemoRole("admin");
  return (
    <PortalShell
      title="Admin Operations Dashboard"
      eyebrow="Admin"
      description="Run the business from one place: intake, assignments, scheduling, plan rules, quote opportunities, and growth visibility."
      nav={portalNavigation.admin}
      roleLabel="Admin"
      userName={session.name}
      shellTitle="Operations Cloud"
      shellDescription="Owner and executive controls for intake, dispatch, customer health, billing oversight, and service quality."
    >
      {children}
    </PortalShell>
  );
}
