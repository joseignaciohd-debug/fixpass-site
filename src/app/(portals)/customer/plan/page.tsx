import { Card } from "@/components/ui/card";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { requireDemoRole } from "@/lib/auth";
import { getCustomerPlanGuardrails, getCustomerPortalSnapshot } from "@/lib/repositories/customer-operations";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const comparePlans = [
  {
    id: "silver",
    name: "Silver",
    price: "$24.99/mo",
    detail: "2 covered visits monthly",
    badge: "Lighter upkeep",
    dark: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "$49.99/mo",
    detail: "5 covered visits monthly",
    badge: "Most households",
    dark: false,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$99.99/mo",
    detail: "Unlimited covered visits with fair use",
    badge: "Priority support",
    dark: true,
  },
];

export default async function CustomerPlanPage() {
  const session = await requireDemoRole("customer");
  const snapshot = await getCustomerPortalSnapshot(session.userId);

  if (!snapshot) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[linear-gradient(180deg,rgba(12,35,72,0.98),rgba(21,55,107,0.96))] text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/68">Current plan</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{snapshot.plan.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/76">
              {currency(snapshot.plan.monthlyPrice)} per month • {snapshot.subscription.billingCycle} billing • renews {snapshot.subscription.renewalDate}
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/84">{snapshot.subscription.status}</div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-white/68">Current cycle</p>
            <p className="mt-2 text-2xl font-semibold">{String(snapshot.subscription.visitsRemaining)}</p>
            <p className="mt-1 text-sm text-white/68">{snapshot.subscription.visitsUsed} used this cycle</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-white/68">Materials remaining</p>
            <p className="mt-2 text-2xl font-semibold">{currency(snapshot.materialsRemaining)}</p>
            <p className="mt-1 text-sm text-white/68">Monthly allowance balance</p>
          </div>
        </div>
        <div className="mt-8 rounded-[22px] border border-white/10 bg-white/10 p-5">
          <ProgressMeter label="Visit usage this cycle" value={snapshot.usagePercent} />
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-heading">Compare tiers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">All plans, clearly visible</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Pick the level of support that fits your household. The same three plans you see in the mobile app are surfaced here with the same structure.
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {snapshot.plan.name} active
          </div>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {comparePlans.map((plan) => {
            const isCurrent = snapshot.plan.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-[28px] border p-6 ${
                  plan.dark
                    ? "border-[#0c2348] bg-[#0c2348] text-white"
                    : "border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fd_100%)] text-slate-950"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${plan.dark ? "bg-white/12 text-white/80" : "bg-[#edf3ff] text-[#0c2348]"}`}>
                    {plan.badge}
                  </div>
                  {isCurrent ? (
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${plan.dark ? "bg-white text-[#0c2348]" : "bg-emerald-50 text-emerald-700"}`}>
                      Current
                    </div>
                  ) : null}
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{plan.name}</h3>
                <p className={`mt-3 text-4xl font-semibold tracking-[-0.04em] ${plan.dark ? "text-white" : "text-slate-950"}`}>{plan.price}</p>
                <p className={`mt-3 text-sm leading-7 ${plan.dark ? "text-white/76" : "text-slate-600"}`}>{plan.detail}</p>
                <div className={`mt-5 rounded-[22px] px-4 py-4 text-sm ${plan.dark ? "bg-white/12 text-white/84" : "bg-slate-50 text-slate-700"}`}>
                  {plan.id === "silver"
                    ? "Defined visits for lighter home upkeep."
                    : plan.id === "gold"
                      ? "More monthly support for active homes."
                      : "Best for households that want ongoing peace of mind."}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr,0.8fr]">
        <Card>
          <h2 className="text-3xl font-semibold tracking-tight">Plan details</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Labor cap per visit</p>
              <p className="mt-2 text-xl font-semibold">{snapshot.plan.maxLaborMinutes} minutes</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Materials allowance</p>
              <p className="mt-2 text-xl font-semibold">{currency(snapshot.plan.materialsAllowance)}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            {getCustomerPlanGuardrails(snapshot.plan.id).map((item) => (
              <div key={item} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-3xl font-semibold tracking-tight">Billing</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Fixpass memberships are billed outside the browser store layer because this platform supports real-world home repair services.
          </p>
          <div className="mt-6 space-y-4">
            {snapshot.billing.map((bill) => (
              <div key={bill.id} className="rounded-[22px] border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{currency(bill.amount)}</p>
                  <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-700">{bill.status}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {bill.billedAt} • {bill.method}
                </p>
              </div>
            ))}
            <form action="/api/billing/portal" method="post">
              <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">Open billing portal</button>
            </form>
          </div>
        </Card>
      </div>

      {snapshot.fairUseFlags.length ? (
        <Card>
          <h2 className="text-2xl font-semibold tracking-tight">Fair-use review</h2>
          <div className="mt-4 space-y-3">
            {snapshot.fairUseFlags.map((flag) => (
              <div key={flag.id} className="rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {flag.reason}
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
