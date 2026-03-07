import { SectionHeading } from "@/components/section-heading";

const reasons = [
  {
    title: "Predictable monthly cost",
    text: "Stop paying random one-off invoices. Budget your maintenance with confidence.",
  },
  {
    title: "No more searching",
    text: "You already have your handyman team when issues pop up.",
  },
  {
    title: "Fast, reliable help",
    text: "Get support quickly when things break, without the back-and-forth.",
  },
  {
    title: "Peace of mind",
    text: "Your home maintenance no longer sits on a stressful to-do list.",
  },
];

export function WhyFixpass() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why Fixpass"
        title="Built for convenience, designed for trust"
        description="Fixpass replaces the uncertainty of ad-hoc handyman hiring with a reliable monthly service."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {reasons.map((reason) => (
          <article key={reason.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">{reason.title}</h3>
            <p className="mt-2 text-sm text-slate">{reason.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
