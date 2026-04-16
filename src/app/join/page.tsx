import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FixpassMark } from "@/components/brand/fixpass-mark";

const whatHappens = [
  {
    icon: MapPin,
    title: "We confirm coverage",
    copy: "We verify your property fits the current Katy launch area.",
  },
  {
    icon: PhoneCall,
    title: "An operator reaches out",
    copy: "Quick call or email to guide plan choice and property intake.",
  },
  {
    icon: CreditCard,
    title: "You activate via Stripe",
    copy: "Pay securely, schedule your first visit inside your allowance.",
  },
];

export default function JoinPage() {
  return (
    <main className="relative">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* --- Left: promise panel -------------------------------- */}
          <section>
            <span className="eyebrow">Start a membership</span>
            <h1 className="display-hero mt-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
              Tell us about your home.
              <br />
              We&apos;ll handle the follow-through.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/70">
              Fixpass is a curated membership for households that want small
              repairs handled without the scramble. Submit the form and our
              operations team will reach out to confirm fit.
            </p>

            <div className="mt-10 space-y-3">
              {whatHappens.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white/75 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-parchment">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
                      Step 0{i + 1}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-ink">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-ink/65">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-ivory mt-10 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <FixpassMark size={36} color="#0B1B36" strokeWidth={7} />
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    Already a member?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">
                    Sign in and we&apos;ll route you to your portal.
                  </p>
                  <Link
                    href="/sign-in"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline"
                  >
                    Go to sign in →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-ink/55">
              <CheckCircle2 size={14} className="text-sage" />
              Billing secured end-to-end by Stripe
            </div>
          </section>

          {/* --- Right: form ---------------------------------------- */}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
