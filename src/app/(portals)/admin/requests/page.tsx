import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { updateAdminRequestAction } from "@/app/(portals)/admin/actions";
import { getAdminOperationsSnapshot } from "@/lib/repositories/admin-operations";

export default async function AdminRequestsPage() {
  const snapshot = await getAdminOperationsSnapshot();
  const queue = snapshot.queueSummary;
  const statusOptions = [
    "pending",
    "under review",
    "scheduled",
    "technician assigned",
    "in progress",
    "completed",
    "quoted separately",
    "declined",
    "cancelled",
  ];
  const categoryOptions = ["covered", "quote", "excluded"];

  return (
    <Card className="rounded-[32px] p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-heading">Service request board</p>
          <h2 className="mt-3 panel-title">Live intake, triage, and assignment visibility</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
          {snapshot.requests.length} active records
        </div>
      </div>
      <div className="mt-6 hidden lg:block">
        <div className="data-grid">
          <div className="grid grid-cols-[1.45fr,0.95fr,0.7fr,0.9fr] bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <p>Request</p>
            <p>Customer</p>
            <p>Plan</p>
            <p>Status</p>
          </div>
          {snapshot.requests.map((request) => (
            <div key={request.id} className="grid grid-cols-[1.45fr,0.95fr,0.7fr,0.9fr] px-6 py-5 text-sm text-slate-700 transition hover:bg-[#f8fbff]">
              <div>
                <p className="font-semibold text-slate-950">{request.title}</p>
                <p className="mt-1 text-slate-500">{request.area} • {request.category}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">{request.customerName}</p>
                <p className="mt-1 text-slate-500">{request.preferredWindow}</p>
              </div>
              <p className="font-medium text-slate-800">{request.planName}</p>
              <div>
                <StatusPill status={request.status as never} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:hidden">
        {snapshot.requests.map((request) => (
          <div key={request.id} className="surface-muted rounded-[26px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{request.title}</p>
                <p className="mt-1 text-sm text-slate-500">{request.area}</p>
              </div>
              <StatusPill status={request.status as never} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <p>Customer: {request.customerName}</p>
              <p>Plan: {request.planName}</p>
              <p>Preferred window: {request.preferredWindow}</p>
              <p>Category: {request.category}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["New intake", queue.newIntake],
          ["Needs scheduling", queue.needsScheduling],
          ["Quote review", queue.quoteReview],
          ["Fair-use", queue.fairUseReview],
          ["Unassigned", queue.unassigned],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        <p className="section-heading">Update intake and assignment</p>
        {snapshot.requests.map((request) => (
          <form key={`${request.id}-actions`} action={updateAdminRequestAction} className="grid gap-4 rounded-[26px] border border-slate-200 bg-slate-50/70 p-5 xl:grid-cols-[1.15fr,0.7fr,0.75fr,0.8fr,0.95fr]">
            <input type="hidden" name="requestId" value={request.id} />
            <div>
              <p className="text-base font-semibold text-slate-950">{request.title}</p>
              <p className="mt-1 text-sm text-slate-500">{request.customerName} • {request.address}</p>
              <p className="mt-2 text-sm text-slate-600">{request.assignedTechnicianName ?? "No technician assigned yet."}</p>
            </div>
            <label className="grid gap-2 text-sm text-slate-600">
              <span>Status</span>
              <select name="status" defaultValue={request.status} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              <span>Assign technician</span>
              <select name="technicianId" defaultValue="unassigned" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                <option value="unassigned">Leave unchanged</option>
                {snapshot.technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name} • {technician.region}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              <span>Coverage track</span>
              <select name="category" defaultValue={request.category} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                {categoryOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-2 text-sm text-slate-600">
              <span>Schedule</span>
              <input
                name="scheduledFor"
                type="datetime-local"
                defaultValue={request.scheduledFor ? request.scheduledFor.slice(0, 16) : ""}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              />
              <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
                Save
              </button>
            </div>
            <label className="grid gap-2 text-sm text-slate-600 xl:col-span-5">
              <span>Internal review notes</span>
              <textarea
                name="internalNotes"
                defaultValue={request.notes === "No internal notes yet." ? "" : request.notes}
                rows={3}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                placeholder="Add scheduling notes, scope review, or owner follow-up guidance."
              />
            </label>
          </form>
        ))}
      </div>
    </Card>
  );
}
