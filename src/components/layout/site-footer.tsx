import Link from "next/link";
import { FixpassWordmark, FIXPASS_TAGLINE } from "@/components/brand/fixpass-mark";

const columns: Record<string, Array<[string, string]>> = {
  Product: [
    ["/how-it-works", "How it works"],
    ["/plans", "Plans"],
    ["/coverage", "Coverage"],
    ["/faq", "FAQ"],
  ],
  Company: [
    ["/join", "Join Fixpass"],
    ["/contact", "Contact"],
    ["/support", "Support"],
  ],
  Account: [
    ["/sign-in", "Sign in"],
    ["/customer", "Customer portal"],
    ["/technician", "Technician portal"],
    ["/admin", "Operations"],
  ],
  Legal: [
    ["/privacy", "Privacy"],
    ["/terms", "Terms"],
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-parchment/80">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <FixpassWordmark size="md" showTagline />
            <p className="mt-6 text-sm leading-7 text-ink/70">
              Fixpass is the membership for home maintenance in Katy, Texas.
              Predictable pricing, trusted technicians, and a calmer way to
              keep the house running.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-[11px] font-bold uppercase tracking-[0.18em] text-parchment">
                S
              </div>
              <div className="text-xs leading-5 text-ink/70">
                <div className="font-semibold text-ink">Billing powered by Stripe</div>
                End-to-end encrypted checkout &amp; invoicing.
              </div>
            </div>
          </div>

          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink/55">
                {title}
              </p>
              <ul className="mt-5 space-y-3 text-sm text-ink/75">
                {links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition hover:text-ink"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/8 pt-8 text-xs text-ink/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Fixpass. {FIXPASS_TAGLINE}</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage" />
              Operating in Katy, TX
            </span>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
