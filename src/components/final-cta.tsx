import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-navy p-8 text-center text-white shadow-lift sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold">Ready to simplify home maintenance?</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Join Fixpass and stop worrying about small repairs.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 sm:text-base">
          Choose a plan, submit your first request, and let us handle the fixes.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-[#ffd16b]">
            Get Started
          </Link>
          <Link href="/pricing" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
            Compare Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
