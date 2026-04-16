import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  Handshake,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FixpassMark, FIXPASS_TAGLINE } from "@/components/brand/fixpass-mark";
import { defaultRules, excludedServices, plans } from "@/lib/demo-data";
import { currency } from "@/lib/utils";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Trusted",
    copy: "Vetted technicians, clear scope, and work you can count on.",
  },
  {
    icon: Clock3,
    title: "Reliable",
    copy: "Operator-led scheduling with a response inside 24 hours.",
  },
  {
    icon: Sparkles,
    title: "Convenient",
    copy: "One membership replaces the scramble of finding a handyman.",
  },
  {
    icon: Heart,
    title: "Care",
    copy: "Small repairs handled like they matter — because they do.",
  },
  {
    icon: Star,
    title: "Exceptional",
    copy: "A premium experience from request to the final walk-through.",
  },
];

const serviceInventory = [
  { title: "TV & shelf mounting", copy: "Brackets, anchors, level-checked installs." },
  { title: "Art, mirrors & decor", copy: "Gallery hangs and large-mirror placements." },
  { title: "Furniture assembly", copy: "From flat-pack dressers to bed frames." },
  { title: "Door hardware", copy: "Sticking doors, loose handles, soft-close fixes." },
  { title: "Drywall & paint touch-up", copy: "Anchor holes, scuffs, nail pops — gone." },
  { title: "Light fixtures & switches", copy: "Swap fixtures, replace plates and dimmers." },
  { title: "Curtains & blinds", copy: "Measure, mount, align — rooms feel finished." },
  { title: "Smart-home setup", copy: "Doorbells, sensors, thermostats configured right." },
];

const highlights = [
  "One property, one plan, defined visits",
  "24-hour response, 1–3 day scheduling target",
  "Operator-reviewed requests — no chaos",
  "Out-of-scope work gets a transparent quote",
];

const stepList = [
  {
    step: "01",
    title: "Pick a plan",
    copy: "Silver, Gold, or Platinum — billed monthly through Stripe with a single property on file.",
  },
  {
    step: "02",
    title: "Request work",
    copy: "Describe what needs doing, add a photo, and an operator reviews before anything is scheduled.",
  },
  {
    step: "03",
    title: "Fixpass handles it",
    copy: "A trusted technician arrives inside your visit allowance and your property stays tidy, quiet, documented.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="absolute inset-0 bg-hero-grid" aria-hidden />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:px-12 lg:pb-24 lg:pt-20">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <Badge tone="default">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Now serving Katy, Texas
              </Badge>
              <h1 className="display-hero mt-6 text-[3.25rem] text-ink sm:text-[4rem] lg:text-[4.75rem]">
                Home maintenance,
                <span className="block text-royal">handled.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-ink/70">
                Fixpass turns scattered home-repair calls into a premium
                membership. Predictable pricing, trusted technicians, and a
                calmer way to keep the house running.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/join" size="lg">
                  Start your membership
                  <ArrowRight size={18} />
                </Button>
                <Button href="/plans" variant="secondary" size="lg">
                  View plans
                </Button>
              </div>

              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-ink/10 pt-8">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                    Response
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-bold text-ink">
                    &lt;24h
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                    On-site
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-bold text-ink">
                    1–3 days
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                    Billing
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-bold text-ink">
                    Stripe
                  </dd>
                </div>
              </dl>
            </div>

            {/* Hero right — brand-mark showcase + promise card */}
            <div className="relative">
              <div className="surface-dark relative overflow-hidden rounded-[32px] p-8 sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-electric/20 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-honey/15 blur-3xl" aria-hidden />

                <div className="relative flex items-start justify-between">
                  <span className="eyebrow-light">Membership promise</span>
                  <FixpassMark size={40} color="#F7F5F0" strokeWidth={6} />
                </div>

                <p className="relative mt-8 font-display text-3xl font-semibold leading-tight text-parchment sm:text-4xl">
                  Better to have it and not need it, than to need it and not
                  have it.
                </p>

                <div className="relative mt-10 grid gap-3 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-parchment/85 backdrop-blur"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-parchment text-ink">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-semibold text-parchment">
                      Billing runs on Stripe
                    </div>
                    <div className="text-parchment/65">
                      Secure checkout, receipts, and a self-serve portal.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tagline chip */}
              <div className="absolute -bottom-6 left-8 hidden items-center gap-2 rounded-full border border-ink/10 bg-parchment px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink shadow-lift md:inline-flex">
                <FixpassMark size={20} strokeWidth={8} />
                {FIXPASS_TAGLINE}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND PILLARS                                                 */}
      {/* ============================================================ */}
      <section className="relative border-y border-ink/8 bg-ivory/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">What we stand for</span>
              <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
                Five pillars hold the whole thing up.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-ink/65">
              Fixpass isn&apos;t a handyman directory. It&apos;s a membership
              designed around how a calm, well-run household actually wants to
              be serviced.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group relative rounded-2xl border border-ink/10 bg-white/85 p-6 transition hover:-translate-y-1 hover:border-ink/20 hover:shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-parchment">
                  <p.icon size={20} strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICE INVENTORY                                             */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">What&apos;s covered</span>
              <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
                The small repairs families keep putting off.
              </h2>
              <p className="mt-5 text-base leading-7 text-ink/70">
                Each visit is scoped around the tasks homeowners actually ask
                for. Tidy, defined, quick-moving household work that makes a
                home feel looked after.
              </p>
              <div className="mt-8 flex gap-3">
                <Button href="/coverage" variant="secondary">
                  See the full list
                </Button>
                <Button href="/faq" variant="ghost">
                  What&apos;s not covered
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {serviceInventory.map((s, i) => (
                <Card
                  key={s.title}
                  variant={i === 0 || i === 5 ? "ivory" : "default"}
                  className="p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/90 text-parchment">
                      <Wrench size={16} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{s.copy}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS                                                  */}
      {/* ============================================================ */}
      <section className="relative border-y border-ink/8 bg-parchment/70">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
                Three steps, no phone tag.
              </h2>
            </div>
            <Button href="/how-it-works" variant="ghost" className="hidden sm:inline-flex">
              Walk through it <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stepList.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="absolute -left-3 top-0 font-display text-[8rem] font-black leading-none text-ink/[0.04] sm:text-[10rem]">
                  {s.step}
                </div>
                <Card variant="default" className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold tracking-[0.2em] text-royal">
                      STEP {s.step}
                    </span>
                    {i === 2 ? <Badge tone="sage">Same week</Badge> : null}
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{s.copy}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PLANS PREVIEW                                                 */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">Memberships</span>
              <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
                Structured memberships, not vague labor promises.
              </h2>
              <p className="mt-5 text-base leading-7 text-ink/70">
                One property per plan. Every tier includes defined visits, a
                labor cap per visit, and a clean path for anything out of scope.
              </p>
            </div>
            <Button href="/plans" variant="secondary">
              Compare all plans
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isPlatinum = plan.id === "platinum";
              const isGold = plan.id === "gold";
              return (
                <Card
                  key={plan.id}
                  variant={isPlatinum ? "dark" : isGold ? "ivory" : "default"}
                  className={isGold ? "ring-1 ring-ink/15" : ""}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={
                          "font-display text-3xl font-bold " +
                          (isPlatinum ? "text-parchment" : "text-ink")
                        }
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={
                          "mt-2 text-sm leading-6 " +
                          (isPlatinum ? "text-parchment/70" : "text-ink/60")
                        }
                      >
                        {plan.tagline}
                      </p>
                    </div>
                    {isPlatinum ? <Badge tone="ivory">Most complete</Badge> : null}
                    {isGold ? <Badge tone="honey">Best value</Badge> : null}
                  </div>

                  <div className="mt-7 flex items-baseline gap-2">
                    <span
                      className={
                        "font-display text-5xl font-black tracking-tight " +
                        (isPlatinum ? "text-parchment" : "text-ink")
                      }
                    >
                      {currency(plan.monthlyPrice)}
                    </span>
                    <span
                      className={
                        "text-sm font-medium " +
                        (isPlatinum ? "text-parchment/60" : "text-ink/55")
                      }
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className={
                      "mt-1 text-sm " +
                      (isPlatinum ? "text-parchment/60" : "text-ink/55")
                    }
                  >
                    {plan.includedVisits} covered visits · billed via Stripe
                  </p>

                  <ul
                    className={
                      "mt-7 space-y-3 text-sm " +
                      (isPlatinum ? "text-parchment/85" : "text-ink/75")
                    }
                  >
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      Up to {plan.maxRelatedTasks} related tasks per visit
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      Up to {plan.maxLaborMinutes} labor minutes per visit
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      {plan.priority} scheduling priority
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      {plan.outOfScopeDiscount}% off quoted out-of-scope work
                    </li>
                  </ul>

                  <Button
                    href="/join"
                    variant={isPlatinum ? "ivory" : "primary"}
                    className="mt-8 w-full"
                  >
                    Choose {plan.name}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST + RULES                                                 */}
      {/* ============================================================ */}
      <section className="relative border-y border-ink/8 bg-ivory/60">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div>
              <span className="eyebrow">Operating rules</span>
              <h2 className="display-section mt-3 text-4xl text-ink sm:text-5xl">
                A real service model, not a generic handyman site.
              </h2>
              <p className="mt-5 text-base leading-7 text-ink/70">
                Fixpass publishes how it operates so households know exactly
                what they&apos;re buying — and so technicians aren&apos;t sent
                into scope they can&apos;t safely own.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-parchment">
                  <Handshake size={20} />
                </div>
                <p className="text-sm font-semibold text-ink">
                  Clear scope is how you keep quality high.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {defaultRules.map((rule) => (
                <div
                  key={rule}
                  className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/80 px-5 py-4 text-sm leading-6 text-ink/75"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 rounded-3xl border border-ink/8 bg-white/80 p-6 sm:p-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className="eyebrow">What we skip on purpose</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                Clear guardrails create trust.
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Anything requiring licensed trades or unsafe work gets handed
                to a proper specialist — often via a quote path Fixpass itself
                coordinates.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {excludedServices.map((s) => (
                <div
                  key={s}
                  className="rounded-xl border border-ink/8 bg-ivory/70 px-4 py-3 text-sm text-ink/70"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA                                                     */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <div className="surface-dark relative overflow-hidden rounded-[40px] p-10 sm:p-14 lg:p-20">
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-electric/20 blur-3xl" aria-hidden />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow-light">Ready when you are</span>
                <h2 className="display-hero mt-4 text-4xl text-parchment sm:text-5xl lg:text-6xl">
                  Stop scrambling.
                  <br />
                  Start Fixpass.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-parchment/75">
                  Join the membership built for busy households in Katy. A
                  single monthly charge, a team of operators watching every
                  request, and a home that stays looked-after without the
                  phone-tree spiral.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/join" variant="ivory" size="lg">
                    Start membership
                    <ArrowRight size={18} />
                  </Button>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-parchment/30 px-7 py-4 text-base font-semibold text-parchment transition hover:border-parchment/60 hover:bg-white/10"
                  >
                    I&apos;m already a member
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur">
                  <FixpassMark size={52} color="#F7F5F0" strokeWidth={6} />
                  <p className="mt-6 font-display text-2xl font-semibold leading-snug text-parchment">
                    {FIXPASS_TAGLINE}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-parchment/70">
                    <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-parchment/50">
                        Response
                      </div>
                      <div className="mt-1 font-display text-lg font-bold text-parchment">
                        Under 24h
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-parchment/50">
                        Billing
                      </div>
                      <div className="mt-1 font-display text-lg font-bold text-parchment">
                        Stripe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
