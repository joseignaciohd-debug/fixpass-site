import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FixpassMark } from "@/components/brand/fixpass-mark";

const steps = [
  {
    title: "Choose a plan",
    body: "Pick Silver, Gold, or Platinum based on how often you want reliable support. Billed monthly or annually through Stripe.",
  },
  {
    title: "Register one property",
    body: "Every membership is tied to one home so service history, scope, and usage stay clean and trackable over time.",
  },
  {
    title: "Request a visit",
    body: "Describe the issue, attach a photo, pick a window. Operations reviews every request inside 24 hours.",
  },
  {
    title: "Get the right outcome",
    body: "Covered work is scheduled on the next available visit, out-of-scope work gets a clear quote path. Everything stays visible in your portal.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <section className="max-w-3xl">
        <span className="eyebrow">How it works</span>
        <h1 className="display-hero mt-4 text-5xl text-ink sm:text-6xl">
          A calmer way to handle small home repairs.
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink/70">
          Fixpass replaces one-off handyman chaos with a structured membership
          — predictable pricing, defined visits, and a single source of truth
          for every request you&apos;ve ever made.
        </p>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={step.title} variant={index % 2 === 0 ? "default" : "ivory"}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              Step 0{index + 1}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">{step.body}</p>
          </Card>
        ))}
      </section>

      <section className="surface-dark mt-16 overflow-hidden rounded-[32px] p-10 sm:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="eyebrow-light">Who this is for</span>
            <h2 className="display-section mt-3 text-3xl text-parchment sm:text-4xl">
              Designed for households that want convenience and control.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-parchment/75">
              Homeowners, families, renters — anyone who needs a trusted,
              polished service experience that doesn&apos;t start from zero
              every time something breaks.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/join" variant="ivory">
                Start your membership
                <ArrowRight size={16} />
              </Button>
              <Button href="/plans" variant="ghost" className="text-parchment hover:bg-white/10">
                Compare plans
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
            <FixpassMark size={44} color="#F7F5F0" strokeWidth={6} />
            <p className="mt-5 font-display text-xl font-semibold leading-snug text-parchment">
              Home maintenance, handled.
            </p>
            <p className="mt-2 text-sm leading-6 text-parchment/70">
              One membership. One phone number. No scrambling.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
