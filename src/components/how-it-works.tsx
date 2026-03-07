import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    title: "Choose a plan",
    body: "Pick Silver, Gold, or Platinum based on how often your home needs attention.",
  },
  {
    title: "Request a fix",
    body: "Submit your task in minutes through Fixpass. Tell us what needs to be done.",
  },
  {
    title: "We send a handyman",
    body: "A vetted professional arrives on schedule and gets your fix completed fast.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How It Works"
        title="Simple enough to use in 60 seconds"
        description="No complicated booking process. One subscription gives you recurring repair support whenever small issues pop up."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, idx) => (
          <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lift">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              {idx + 1}
            </span>
            <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
