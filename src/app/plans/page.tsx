import Link from "next/link";
import { ArrowRight, Check, CreditCard, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FixpassMark } from "@/components/brand/fixpass-mark";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Tier = {
  id: "silver" | "gold" | "platinum";
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  visits: string;
  priority: string;
  labor: string;
  materials: string;
  discount: string;
  highlight?: boolean;
  theme: "ivory" | "light" | "dark";
  featured?: string;
};

const tiers: Tier[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "Lighter upkeep. Peace of mind month-to-month.",
    monthly: 24.99,
    annual: 249.99,
    visits: "2 covered visits / month",
    priority: "Standard priority",
    labor: "90 labor minutes / visit",
    materials: "No materials allowance",
    discount: "5% off out-of-scope quotes",
    theme: "light",
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "The core Fixpass plan for active households.",
    monthly: 49.99,
    annual: 499.99,
    visits: "5 covered visits / month",
    priority: "Priority scheduling",
    labor: "90 labor minutes / visit",
    materials: "No materials allowance",
    discount: "10% off out-of-scope quotes",
    highlight: true,
    theme: "ivory",
    featured: "Best value",
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Highest priority, fair-use guardrails.",
    monthly: 99.99,
    annual: 999.99,
    visits: "Unlimited covered visits",
    priority: "Fastest priority",
    labor: "90 labor minutes / visit",
    materials: "$40 monthly materials allowance",
    discount: "15% off out-of-scope quotes",
    theme: "dark",
    featured: "Most complete",
  },
];

const comparisonRows: Array<{
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}> = [
  { label: "Registered property", values: ["One", "One", "One"] },
  {
    label: "Covered visits",
    values: ["2 / mo", "5 / mo", "Unlimited (fair use)"],
  },
  { label: "Labor cap / visit", values: ["90 min", "90 min", "90 min"] },
  { label: "Related tasks / visit", values: ["3", "3", "3"] },
  { label: "Materials allowance", values: ["—", "—", "$40 / mo"] },
  {
    label: "Scheduling priority",
    values: ["Standard", "Priority", "Fastest"],
  },
  {
    label: "Out-of-scope quote discount",
    values: ["5%", "10%", "15%"],
  },
  {
    label: "Operator review on every request",
    values: [true, true, true],
  },
  {
    label: "Stripe billing + self-serve portal",
    values: [true, true, true],
  },
];

export default function PlansPage() {
  return (
    <main className="relative">
      {/* HERO ----------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="max-w-3xl">
          <span className="eyebrow">Memberships</span>
          <h1 className="display-hero mt-4 text-5xl text-ink sm:text-6xl lg:text-[4.5rem]">
            Pick the membership that fits your home.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
            Every plan supports one registered property, defined visit
            allowances, a clear labor cap, and an out-of-scope quote path when
            a request falls outside coverage.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">
            <CreditCard size={14} />
            Billed monthly or annually via Stripe
          </div>
        </div>
      </section>

      {/* PLAN CARDS ---------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <PlanCard key={t.id} tier={t} />
          ))}
        </div>
      </section>

      {/* COMPARE TABLE ------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Compare</span>
            <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
              What&apos;s in each plan, line by line.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink/60">
            All plans share the same operator-reviewed request flow. Tier
            changes mostly affect capacity and priority.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-white/80 backdrop-blur">
          <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] text-sm">
            <div className="bg-ivory/60 px-6 py-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
              Feature
            </div>
            {tiers.map((t) => (
              <div
                key={t.id}
                className={`px-6 py-5 text-center font-display text-lg font-bold ${
                  t.highlight
                    ? "bg-honey-soft text-ink"
                    : t.theme === "dark"
                      ? "bg-ink text-parchment"
                      : "bg-ivory/60 text-ink"
                }`}
              >
                {t.name}
              </div>
            ))}
          </div>

          {comparisonRows.map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.4fr_repeat(3,1fr)] border-t border-ink/8 text-sm ${
                idx % 2 === 0 ? "bg-white/50" : "bg-ivory/30"
              }`}
            >
              <div className="px-6 py-4 font-medium text-ink/80">
                {row.label}
              </div>
              {row.values.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center px-6 py-4 text-center text-ink/75"
                >
                  {typeof v === "boolean" ? (
                    v ? (
                      <Check size={18} className="text-sage" />
                    ) : (
                      <Minus size={18} className="text-ink/30" />
                    )
                  ) : (
                    <span>{v}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA --------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="surface-dark overflow-hidden rounded-[36px] p-10 sm:p-14 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow-light">Not sure which plan?</span>
              <h3 className="display-section mt-4 text-4xl text-parchment sm:text-5xl">
                Tell us about your home. We&apos;ll recommend one.
              </h3>
              <p className="mt-5 max-w-lg text-base leading-7 text-parchment/75">
                Most households land on Gold. Platinum is for high-frequency
                homeowners. Silver covers the bare essentials. Share your
                setup and an operator will point you to the right fit.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/join" variant="ivory" size="lg">
                  Start with a recommendation
                  <ArrowRight size={18} />
                </Button>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-parchment/30 px-7 py-4 text-base font-semibold text-parchment transition hover:border-parchment/60 hover:bg-white/10"
                >
                  Read the FAQ
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur">
              <FixpassMark size={48} color="#F7F5F0" strokeWidth={6} />
              <p className="mt-5 font-display text-xl font-semibold leading-snug text-parchment">
                &ldquo;Better to have it and not need it, than to need it and
                not have it.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-parchment/60">
                The Fixpass promise
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------- Plan card ---------------- */

function PlanCard({ tier }: { tier: Tier }) {
  const isDark = tier.theme === "dark";
  const isIvory = tier.theme === "ivory";

  const wrapper = isDark
    ? "surface-dark"
    : isIvory
      ? "surface-ivory ring-1 ring-ink/15"
      : "surface-card";

  const textMain = isDark ? "text-parchment" : "text-ink";
  const textMuted = isDark ? "text-parchment/65" : "text-ink/60";
  const textSoft = isDark ? "text-parchment/80" : "text-ink/75";

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] p-7 sm:p-9 ${wrapper}`}
    >
      {tier.highlight ? (
        <div className="pointer-events-none absolute right-6 top-6">
          <Badge tone="honey">{tier.featured}</Badge>
        </div>
      ) : null}
      {isDark && tier.featured ? (
        <div className="pointer-events-none absolute right-6 top-6">
          <Badge tone="ivory">{tier.featured}</Badge>
        </div>
      ) : null}

      <div className={`flex items-baseline gap-2 ${textMain}`}>
        <h2 className="font-display text-3xl font-bold">{tier.name}</h2>
      </div>
      <p className={`mt-2 max-w-xs text-sm leading-6 ${textMuted}`}>
        {tier.tagline}
      </p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className={`font-display text-5xl font-black tracking-tight ${textMain}`}>
          {currency(tier.monthly)}
        </span>
        <span className={`text-sm ${textMuted}`}>/ month</span>
      </div>
      <p className={`mt-1 text-sm ${textMuted}`}>
        or {currency(tier.annual)} billed annually
      </p>

      <ul className={`mt-8 space-y-3 text-sm ${textSoft}`}>
        {[
          tier.visits,
          tier.priority,
          tier.labor,
          tier.materials,
          tier.discount,
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check
              size={16}
              className={isDark ? "mt-1 shrink-0 text-neon" : "mt-1 shrink-0 text-royal"}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button
        href="/join"
        variant={isDark ? "ivory" : "primary"}
        className="mt-9 w-full"
      >
        Choose {tier.name}
      </Button>
    </article>
  );
}
