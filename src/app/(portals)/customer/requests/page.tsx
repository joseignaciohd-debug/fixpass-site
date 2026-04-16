import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { requireDemoRole } from "@/lib/auth";
import { createCustomerServiceRequestAction } from "@/app/(portals)/customer/actions";
import { getCustomerPortalSnapshot } from "@/lib/repositories/customer-operations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerRequestsPage() {
  const session = await requireDemoRole("customer");
  const snapshot = await getCustomerPortalSnapshot(session.userId);

  if (!snapshot) {
    return null;
  }

  const quickCategories = ["Drywall patch", "Door adjust", "Caulk touch-up", "Shelves or decor"];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">New request</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Ask for help without the usual back-and-forth.</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Covered visits work best for up to 3 related small tasks in one area or 1 moderately sized covered job.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {quickCategories.map((item) => (
            <div key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0c2348]">
              {item}
            </div>
          ))}
        </div>
        <form action={createCustomerServiceRequestAction} className="mt-6 grid gap-4">
          <input name="title" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="What do you need help with?" />
          <textarea
            name="description"
            className="min-h-36 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            placeholder="Describe the issue, where it is, and what would help the technician arrive ready."
          />
          <input name="area" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Which room or area is affected?" />
          <input name="preferredWindow" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Preferred date or time window" />
          <textarea
            name="notes"
            className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            placeholder="Optional access notes, parking instructions, or anything operations should know."
          />
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Photo upload is fully supported in the mobile app today. This web intake flow writes the request directly to Fixpass so operations can review it quickly.
          </div>
          <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">Submit request</button>
        </form>

        <div className="mt-8 space-y-3 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#fbfcff_0%,#f5f8fd_100%)] p-5">
          {[
            "We review every request within 24 hours.",
            "Most covered visits target scheduling in 1 to 3 business days.",
            "If work is excluded or oversized, we may provide a separate quote instead.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#2d67c8]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Request tracking</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Current and recent requests</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">{snapshot.requests.length} requests on file</div>
        </div>
        <div className="mt-6 space-y-4">
          {snapshot.requests.map((request) => (
            <div key={request.id} className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">{request.title}</h2>
                <StatusPill status={request.status} />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{request.description}</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-500 md:grid-cols-3">
                <p>Area: {request.area}</p>
                <p>Preferred: {request.preferredWindow}</p>
                <p>Tasks: {request.taskCount}</p>
              </div>
              <p className="mt-4 text-sm font-medium text-[#0c2348]">{request.coverageSummary}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
