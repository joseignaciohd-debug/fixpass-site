import Link from "next/link";
import { plans } from "@/components/site-data";

type PricingCardsProps = {
  compact?: boolean;
};

export function PricingCards({ compact = false }: PricingCardsProps) {
  return (
    <div className={`grid gap-6 ${compact ? "lg:grid-cols-3" : "md:grid-cols-3"}`}>
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`relative flex flex-col rounded-[1.5rem] border p-6 ${
            plan.featured
              ? "border-navy bg-navy text-white shadow-lift"
              : "border-slate-200 bg-white text-ink"
          }`}
        >
          {plan.featured && (
            <span className="absolute -top-3 right-5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
              Best value
            </span>
          )}
          <h3 className="text-2xl font-semibold">{plan.name}</h3>
          <p className={`mt-1 text-sm ${plan.featured ? "text-white/80" : "text-slate"}`}>{plan.subtitle}</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight">{plan.price}<span className="text-base font-medium">/mo</span></p>
          <p className={`mt-2 text-sm ${plan.featured ? "text-white/90" : "text-slate"}`}>{plan.fixes}</p>

          <ul className="mt-6 space-y-3 text-sm">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <span className={`mt-1 h-2 w-2 rounded-full ${plan.featured ? "bg-gold" : "bg-navy"}`} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className={`mt-8 inline-flex justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              plan.featured
                ? "bg-gold text-navy hover:bg-[#ffd16b]"
                : "bg-navy text-white hover:bg-[#153364]"
            }`}
          >
            Choose {plan.name}
          </Link>
        </article>
      ))}
    </div>
  );
}
