import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusPill } from "@/components/ui/status-pill";
import { getAdminOperationsSnapshot } from "@/lib/repositories/admin-operations";

export default async function AdminPage() {
  const snapshot = await getAdminOperationsSnapshot();
  const metrics = snapshot.metrics;
  const queue = snapshot.queueSummary;
  const kpis = [
    { label: "Active Members", value: String(metrics.activeMembers), change: `${metrics.coveredRequests} covered requests`, tone: "positive" as const },
    { label: "MRR", value: `$${metrics.mrr.toFixed(0)}`, change: `$${metrics.outstandingRevenue.toFixed(0)} upcoming`, tone: "positive" as const },
    { label: "Quote Opportunities", value: String(metrics.quoteOpportunities), change: `${metrics.fairUseCount} fair-use reviews`, tone: "alert" as const },
    { label: "Avg Labor Time", value: `${metrics.averageLaborMinutes} min`, change: "Usage-aware scheduling", tone: "neutral" as const },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-4">
        {kpis.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} change={item.change} tone={item.tone} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Owner queue</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "New intake", value: queue.newIntake, tone: "bg-[#edf4ff] text-[#10315f]" },
              { label: "Need scheduling", value: queue.needsScheduling, tone: "bg-[#fff4e5] text-[#9a5d00]" },
              { label: "Quote review", value: queue.quoteReview, tone: "bg-[#f7edff] text-[#5f2b91]" },
              { label: "Fair-use review", value: queue.fairUseReview, tone: "bg-[#fff0f0] text-[#9c2f2f]" },
              { label: "Unassigned jobs", value: queue.unassigned, tone: "bg-[#eef7f1] text-[#16633a]" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${item.tone}`}>
                  {item.label}
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {item.value === 0 ? "No action required right now." : "Requires owner or coordinator attention."}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Incoming requests</p>
          <p className="mt-2 text-sm text-slate-500">Incoming service activity across the Fixpass operation.</p>
          <div className="mt-6 space-y-4">
            {snapshot.requests.slice(0, 3).map((request) => (
              <div key={request.id} className="rounded-[22px] border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{request.title}</p>
                  <StatusPill status={request.status as never} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{request.customerName} • {request.planName}</p>
                <p className="mt-1 text-sm text-slate-500">{request.assignedTechnicianName ?? "Not assigned yet"} • {request.category}</p>
                <p className="mt-2 text-sm text-slate-500">{request.notes}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Ops attention</p>
          <div className="mt-6 space-y-4">
            {snapshot.fairUse.map((flag) => (
              <div key={flag.id} className="rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {flag.reason}
              </div>
            ))}
            {snapshot.quotes.map((quote) => (
              <div key={quote.id} className="rounded-[22px] border border-slate-200 p-4">
                <p className="font-semibold">{quote.title}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {quote.status} • ${quote.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Member watchlist</p>
              <p className="mt-2 text-sm text-slate-500">Who needs follow-up, quote conversion, or scheduling attention.</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              {snapshot.customers.length} tracked households
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {snapshot.customers.slice(0, 4).map((customer) => (
              <div key={customer.id} className="grid gap-3 rounded-[24px] border border-slate-200 p-4 lg:grid-cols-[1.1fr,0.9fr,0.6fr]">
                <div>
                  <p className="font-semibold text-slate-950">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.propertyLabel}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>{customer.planName} • {customer.revenueLabel}</p>
                  <p className="mt-1">{customer.openRequestCount} open requests • {customer.visitsLabel}</p>
                </div>
                <div className="flex items-start lg:justify-end">
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
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Today&apos;s dispatch readiness</p>
          <div className="mt-6 space-y-4">
            {snapshot.requests
              .filter((request) => request.scheduledFor || request.status === "technician assigned")
              .slice(0, 4)
              .map((request) => (
                <div key={request.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{request.title}</p>
                    <StatusPill status={request.status as never} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{request.customerName}</p>
                  <p className="mt-1 text-sm text-slate-500">{request.scheduledFor ?? request.preferredWindow}</p>
                  <p className="mt-3 text-sm text-slate-700">{request.assignedTechnicianName ?? "Technician still needs assignment"}</p>
                </div>
              ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
