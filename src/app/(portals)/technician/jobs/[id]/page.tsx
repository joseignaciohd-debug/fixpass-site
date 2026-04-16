import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { updateTechnicianJobAction } from "@/app/(portals)/technician/actions";
import { requireDemoRole } from "@/lib/auth";
import { getTechnicianJobDetail } from "@/lib/repositories/technician-operations";

export default async function TechnicianJobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDemoRole("technician");
  const { id } = await params;
  const request = await getTechnicianJobDetail(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">{request.title}</h2>
          <StatusPill status={request.status} />
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{request.description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Customer</p>
            <p className="mt-2 font-semibold">{request.customerName}</p>
            <p className="mt-1 text-sm text-slate-600">{request.customerPhone}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Address</p>
            <p className="mt-2 font-semibold">{request.address}</p>
            <p className="mt-1 text-sm text-slate-600">{request.accessNotes}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Execution workflow</p>
        <form action={updateTechnicianJobAction} className="mt-6 grid gap-4">
          <input type="hidden" name="requestId" value={request.id} />
          <textarea
            name="notes"
            className="min-h-36 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Add completion notes, access notes, materials used, or out-of-scope findings."
            defaultValue={request.internalNotes}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <button name="mode" value="check_in" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Check in
            </button>
            <button name="mode" value="quote" className="rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900">
              Flag as quote
            </button>
            <button name="mode" value="complete" className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
              Complete visit
            </button>
          </div>
        </form>
        {request.fairUseReason ? (
          <div className="mt-6 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            Fair-use / scope review: {request.fairUseReason}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
