import { PortalShell } from "@/components/layout/portal-shell";
import { requireDemoRole } from "@/lib/auth";
import { portalNavigation } from "@/lib/config/navigation";

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const session = await requireDemoRole("technician");
  return (
    <PortalShell
      title="Technician Operations Portal"
      eyebrow="Technician"
      description="Fast mobile-first job execution with notes, scope controls, and customer-ready completion detail."
      nav={portalNavigation.technician}
      roleLabel="Technician"
      userName={session.name}
      shellTitle="Field Operations"
      shellDescription="Assigned visits, property access, scope notes, and completion updates in one focused workspace."
    >
      {children}
    </PortalShell>
  );
}
