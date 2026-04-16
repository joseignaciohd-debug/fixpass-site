"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

export function PortalShell({
  title,
  eyebrow,
  description,
  nav,
  children,
  roleLabel,
  userName,
  shellTitle = "Fixpass Web",
  shellDescription = "Use the same customer experience on the web to track requests, billing, and your registered home.",
}: {
  title: string;
  eyebrow: string;
  description: string;
  nav: NavItem[];
  children: React.ReactNode;
  roleLabel: string;
  userName: string;
  shellTitle?: string;
  shellDescription?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(207,220,255,0.46),transparent_22%),linear-gradient(180deg,#f8faff_0%,#f3f6fb_100%)]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[270px,1fr] lg:px-8 lg:py-6">
        <aside className="surface-card h-fit rounded-[32px] p-4 sm:p-5 lg:sticky lg:top-24">
          <Link href="/" className="surface-dark block rounded-[28px] px-5 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">FIXPASS</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{shellTitle}</p>
            <p className="mt-2 text-sm leading-6 text-white/68">{shellDescription}</p>
          </Link>
          <div className="surface-muted mt-4 flex items-center justify-between gap-3 rounded-[24px] px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">{userName}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{roleLabel}</p>
            </div>
            <Badge tone="default">{roleLabel}</Badge>
          </div>
          <nav className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-[20px] px-4 py-3.5 text-sm font-medium transition",
                  pathname === item.href
                    ? "bg-[linear-gradient(180deg,#edf3ff_0%,#e2ecff_100%)] text-[#0c2348] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-8">
          <section className="surface-dark relative overflow-hidden rounded-[36px] p-7 text-white sm:p-8 lg:p-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{eyebrow}</p>
            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] lg:text-5xl">{title}</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 lg:text-base">{description}</p>
              </div>
              <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur">
                <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-white/60 sm:inline">Secure session</span>
                <Link href="/api/auth/logout" className="text-sm font-semibold text-white/80 transition hover:text-white">
                  Sign out
                </Link>
              </div>
            </div>
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}
