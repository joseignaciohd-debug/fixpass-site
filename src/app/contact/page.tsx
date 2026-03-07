import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <section className="bg-fog py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-navy p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold">Contact Fixpass</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Reliable handyman support, on subscription.</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            We currently serve early customers in Houston and are expanding to additional neighborhoods soon.
            Share your details and we&apos;ll reach out with plan options and rollout timing.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/90">
            <li>Fast onboarding call</li>
            <li>Plan recommendation based on your home needs</li>
            <li>Priority access to launch scheduling</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
