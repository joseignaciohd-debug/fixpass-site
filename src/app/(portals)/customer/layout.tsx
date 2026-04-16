import { PortalShell } from "@/components/layout/portal-shell";
import { requireDemoRole } from "@/lib/auth";
import { portalNavigation } from "@/lib/config/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireDemoRole("customer");
  return (
    <PortalShell
      title="Fixpass at your service"
      eyebrow="Customer app on web"
      description="Use the same Fixpass experience on the web to track requests, manage your property, review membership usage, and keep billing in order."
      nav={portalNavigation.customer}
      roleLabel="Customer"
      userName={session.name}
      shellTitle="Fixpass Account"
      shellDescription="Manage your membership, requests, property details, and billing from one place on the web."
    >
      {children}
    </PortalShell>
  );
}
