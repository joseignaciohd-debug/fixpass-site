import { Card } from "@/components/ui/card";
import { getAdminOperationsSnapshot } from "@/lib/repositories/admin-operations";

export default async function AdminCustomersPage() {
  const snapshot = await getAdminOperationsSnapshot();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Customer operations</p>
            <h2 className="mt-3 panel-title">Membership health, open demand, and high-touch households</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {snapshot.customers.length} active customer records
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px] p-4 sm:p-6">
        <div className="hidden lg:block">
          <div className="data-grid">
            <div className="grid grid-cols-[1.15fr,0.95fr,0.75fr,0.75fr,0.8fr,0.8fr] bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <p>Customer</p>
              <p>Property</p>
              <p>Plan</p>
              <p>Demand</p>
              <p>Usage</p>
              <p>Attention</p>
            </div>
            {snapshot.customers.map((customer) => (
              <div key={customer.id} className="grid grid-cols-[1.15fr,0.95fr,0.75fr,0.75fr,0.8fr,0.8fr] px-6 py-5 text-sm text-slate-700 transition hover:bg-[#f8fbff]">
                <div>
                  <p className="font-semibold text-slate-950">{customer.name}</p>
                  <p className="mt-1 text-slate-500">{customer.email}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{customer.propertyLabel}</p>
                  <p className="mt-1 text-slate-500">{customer.status} • {customer.billingCycle}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{customer.planName}</p>
                  <p className="mt-1 text-slate-500">{customer.revenueLabel}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{customer.openRequestCount} open</p>
                  <p className="mt-1 text-slate-500">{customer.requestCount} total requests</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{customer.visitsLabel}</p>
                  <p className="mt-1 text-slate-500">{customer.fairUseOpen} fair-use flags open</p>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    customer.attention === "Healthy"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-800"
                  }`}>
                    {customer.attention}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {snapshot.customers.map((customer) => (
            <div key={customer.id} className="surface-muted rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                  customer.attention === "Healthy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
                }`}>
                  {customer.attention}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>{customer.propertyLabel}</p>
                <p>{customer.planName} • {customer.revenueLabel}</p>
                <p>{customer.openRequestCount} open requests • {customer.visitsLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
