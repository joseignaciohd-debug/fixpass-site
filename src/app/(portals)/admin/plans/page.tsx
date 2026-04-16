import { Card } from "@/components/ui/card";
import { updateAdminPlanAction } from "@/app/(portals)/admin/actions";
import { getAdminPlansSnapshot } from "@/lib/repositories/admin-config";
import { currency } from "@/lib/utils";

export default async function AdminPlansPage() {
  const snapshot = await getAdminPlansSnapshot();

  return (
    <div className="grid gap-6">
      {snapshot.plans.map((plan) => (
        <Card key={plan.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {typeof plan.includedVisits === "string" ? plan.includedVisits : `${plan.includedVisits} included visits`} • {plan.maxLaborMinutes} minute cap
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{currency(plan.monthlyPrice)} monthly</div>
          </div>

          <form action={updateAdminPlanAction} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <input type="hidden" name="planId" value={plan.id} />
            <label className="grid gap-2 text-sm text-slate-600">
              Monthly price
              <input name="monthlyPrice" type="number" step="0.01" defaultValue={plan.monthlyPrice} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Annual price
              <input name="annualPrice" type="number" step="0.01" defaultValue={plan.annualPrice ?? ""} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Quote discount %
              <input name="discountPercent" type="number" defaultValue={plan.outOfScopeDiscountPercent} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Scheduling priority
              <input name="schedulingPriority" type="number" min="1" max="5" defaultValue={plan.schedulingPriority} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Status
              <select name="status" defaultValue={plan.status} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <div className="md:col-span-2 xl:col-span-5 flex flex-wrap items-center gap-3">
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {plan.maxRelatedTasks} related tasks • {typeof plan.includedVisits === "string" ? "Unlimited visits" : `${plan.includedVisits} visits`}
              </div>
              {plan.fairUseNotes ? <div className="rounded-[20px] bg-amber-50 px-4 py-3 text-sm text-amber-900">{plan.fairUseNotes}</div> : null}
              <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">Save plan</button>
            </div>
          </form>
        </Card>
      ))}
    </div>
  );
}
