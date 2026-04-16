"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const portalPrefixes = ["/customer", "/technician", "/admin"];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortalRoute = portalPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isPortalRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
