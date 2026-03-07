import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-navy text-sm font-bold text-gold">
              F
            </span>
            <span className="text-xl font-semibold text-ink">Fixpass</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate">
            Subscription-first handyman support for people who want reliable fixes without the stress.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate">
            <li>hello@fixpass.com</li>
            <li>(713) 555-0188</li>
            <li>Launching in Houston</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate">
            <li><Link href="#">Terms (Placeholder)</Link></li>
            <li><Link href="#">Privacy (Placeholder)</Link></li>
            <li><Link href="#">Service Areas (Placeholder)</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
