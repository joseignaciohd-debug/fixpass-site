import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { coveredServices, excludedServices } from "@/lib/demo-data";

export default function CoveragePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <section className="max-w-3xl">
        <span className="eyebrow">Coverage</span>
        <h1 className="display-hero mt-4 text-5xl text-ink sm:text-6xl">
          What Fixpass covers — and what we route to quotes.
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink/70">
          Covered visits include up to three small related tasks in one area,
          or one moderately sized covered job, within your plan&apos;s labor
          cap. Anything outside scope gets a transparent quote path.
        </p>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <Card variant="default">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-soft text-[#3f5139]">
              <CheckCircle2 size={18} />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Covered service examples
            </h2>
          </div>
          <div className="mt-6 grid gap-2">
            {coveredServices.map((service) => (
              <div
                key={service}
                className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white/70 px-4 py-3 text-sm text-ink/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                {service}
              </div>
            ))}
          </div>
        </Card>

        <Card variant="ivory">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-soft text-[#86382a]">
              <XCircle size={18} />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Excluded categories
            </h2>
          </div>
          <div className="mt-6 grid gap-2">
            {excludedServices.map((service) => (
              <div
                key={service}
                className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white/80 px-4 py-3 text-sm text-ink/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                {service}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
