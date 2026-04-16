import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const faqs: Array<[string, string]> = [
  [
    "Is Fixpass unlimited handyman labor?",
    "No. Plans include covered visits for defined small repairs, each with task and labor limits. Platinum covers unlimited visits under fair-use and scope rules.",
  ],
  [
    "How quickly do requests get reviewed?",
    "Every request receives a response within 24 hours. Most covered work targets a 1 to 3 business day schedule window.",
  ],
  [
    "What happens if my request is outside scope?",
    "Operations or the assigned technician can mark it as out-of-scope, create a separate quote at a member discount, or decline the work with a clear reason.",
  ],
  [
    "Can I use my membership for multiple properties?",
    "No. Each active membership is tied to one registered property so service history and quality stay consistent.",
  ],
  [
    "How does billing work?",
    "All billing runs through Stripe — monthly or annual charges on the card you provide, with a self-serve portal to manage payment method and invoices.",
  ],
  [
    "What does Platinum unlimited actually mean?",
    "Unlimited covered visits per month, subject to scope rules, labor caps, material limits, safety rules, and fair-use review for repeated excluded root causes.",
  ],
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <section className="max-w-3xl">
        <span className="eyebrow">FAQ</span>
        <h1 className="display-hero mt-4 text-5xl text-ink sm:text-6xl">
          Clear answers for a service model built on trust.
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink/70">
          Most questions come down to scope, timing, and billing. Here are the
          most common ones. If yours isn&apos;t here, reach out.
        </p>
      </section>

      <section className="mt-14 grid gap-5">
        {faqs.map(([question, answer]) => (
          <Card key={question} variant="default">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10 text-royal">
                <HelpCircle size={18} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                  {question}
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink/70">{answer}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="surface-ivory mt-16 rounded-3xl p-8 sm:p-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-ink">
              Still have a question?
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Reach out and we&apos;ll get back to you the same business day.
            </p>
          </div>
          <div className="flex gap-3">
            <Button href="/join">
              Start a membership
              <ArrowRight size={16} />
            </Button>
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-white"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
