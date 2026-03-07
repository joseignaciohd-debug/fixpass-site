import Link from "next/link";
import { PricingCards } from "@/components/pricing-cards";
import { SectionHeading } from "@/components/section-heading";

export default function PricingPage() {
  return (
    <>
      <section className="bg-fog py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Transparent monthly pricing"
            description="No hidden fees, no one-off pricing surprises. Subscribe once and request fixes as needed."
          />
          <PricingCards compact />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Need help choosing a plan?</h2>
        <p className="mt-3 text-sm text-slate">
          Tell us your home type and repair frequency. We&apos;ll recommend the best option for your needs.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#153364]"
        >
          Talk to an expert
        </Link>
      </section>
    </>
  );
}
