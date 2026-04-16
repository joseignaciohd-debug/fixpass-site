import { Card } from "@/components/ui/card";
import { updateAdminServiceRulesAction } from "@/app/(portals)/admin/actions";
import { getAdminServiceRulesSnapshot } from "@/lib/repositories/admin-config";

export default async function AdminSettingsPage() {
  const snapshot = await getAdminServiceRulesSnapshot();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Operational defaults</p>
        <div className="mt-6 space-y-3">
          {snapshot.rules.map((rule) => (
            <div key={rule} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              {rule}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Service rules</p>
        <form action={updateAdminServiceRulesAction} className="mt-6 grid gap-4">
          <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input type="checkbox" name="oneRegisteredPropertyPerMembership" defaultChecked={snapshot.values.oneRegisteredPropertyPerMembership} />
            One registered property per membership
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Response SLA hours
            <input name="responseSlaHours" type="number" min="1" defaultValue={snapshot.values.responseSlaHours} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Covered visit target (business days)
            <input name="coveredVisitTargetBusinessDays" defaultValue={snapshot.values.coveredVisitTargetBusinessDays} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input type="checkbox" name="scheduleDependsOnAvailability" defaultChecked={snapshot.values.scheduleDependsOnAvailability} />
            Scheduling depends on technician availability
          </label>
          <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input type="checkbox" name="excludedWorkQuoteOrDecline" defaultChecked={snapshot.values.excludedWorkQuoteOrDecline} />
            Excluded work may be quoted separately or declined
          </label>
          <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">Save settings</button>
          <p className="text-sm text-slate-500">{snapshot.source === "live" ? "Editing operational rules stored in Supabase." : "Editing the current operational defaults for this environment."}</p>
        </form>
      </Card>
    </div>
  );
}
