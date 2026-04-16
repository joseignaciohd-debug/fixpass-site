import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { getAdminOperationsSnapshot } from "@/lib/repositories/admin-operations";

export default async function AdminSchedulePage() {
  const snapshot = await getAdminOperationsSnapshot();
  const scheduled = snapshot.requests
    .filter((request) => request.scheduledFor || request.status === "scheduled" || request.status === "technician assigned")
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Schedule board</p>
      <div className="mt-6 grid gap-4">
        {scheduled.map((request) => (
          <div key={request.id} className="grid gap-4 rounded-[24px] border border-slate-200 p-5 lg:grid-cols-[1.1fr,0.85fr,0.55fr]">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{request.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{request.customerName}</p>
              <p className="mt-1 text-sm text-slate-500">{request.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Scheduled</p>
              <p className="mt-2 text-sm text-slate-950">{request.scheduledFor ?? request.preferredWindow}</p>
            </div>
            <div className="flex items-start lg:justify-end">
              <StatusPill status={request.status as never} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
