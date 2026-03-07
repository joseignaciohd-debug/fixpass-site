import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-grid">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="animate-in">
          <span className="inline-flex items-center rounded-full border border-navy/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy">
            Launching in Houston
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Home fixes on subscription. Zero stress.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
            Fixpass gives you on-demand handyman help for everyday home repairs with a predictable monthly cost.
            No last-minute searching. No surprise invoices. Just peace of mind.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#153364]"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-navy hover:text-navy"
            >
              See Plans
            </Link>
          </div>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center">
            {[
              { label: "Average response", value: "< 48 hrs" },
              { label: "Customer rating", value: "4.9 / 5" },
              { label: "Visits completed", value: "2,300+" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-3 py-4">
                <p className="text-lg font-semibold text-ink">{item.value}</p>
                <p className="text-xs text-slate">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-in-delay rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-lift">
          <div className="rounded-2xl bg-navy p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">Today&apos;s requests</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-xl bg-white/10 p-3">Mount 65&quot; TV in living room</li>
              <li className="rounded-xl bg-white/10 p-3">Patch hallway drywall nick</li>
              <li className="rounded-xl bg-white/10 p-3">Replace kitchen faucet handle</li>
            </ul>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-ink">Dispatch status</p>
            <p className="mt-1 text-sm text-slate">Your Fixpass handyman is confirmed for tomorrow 9:00-11:00 AM.</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-2 w-3/4 rounded-full bg-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
