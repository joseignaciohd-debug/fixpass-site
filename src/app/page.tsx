import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { PricingCards } from "@/components/pricing-cards";
import { SectionHeading } from "@/components/section-heading";
import { WhatsIncluded } from "@/components/whats-included";
import { WhyFixpass } from "@/components/why-fixpass";
import { TrustSection } from "@/components/trust-section";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { WaitlistForm } from "@/components/waitlist-form";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />

      <section id="plans" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plans"
          title="Subscription plans built for real homes"
          description="Choose a plan once and stop negotiating every repair from scratch."
        />
        <PricingCards />
      </section>

      <WhatsIncluded />
      <WhyFixpass />
      <TrustSection />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-fog p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-navy/70">Early Access</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Join the Houston launch list</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            We are opening service zones in phases. Join now for priority onboarding, launch pricing updates,
            and first access to preferred scheduling windows.
          </p>
        </div>
        <WaitlistForm />
      </section>

      <FAQ />
      <FinalCTA />
    </>
  );
}
