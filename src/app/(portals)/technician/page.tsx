import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { requireDemoRole } from "@/lib/auth";
import { getTechnicianSnapshot } from "@/lib/repositories/technician-operations";

export default async function TechnicianPage() {
  await requireDemoRole("technician");
  const snapshot = await getTechnicianSnapshot();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Today&apos;s route</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {snapshot.jobs.length} assigned jobs on the {snapshot.regionLabel}
            </h2>
            <p className="mt-2 text-sm text-slate-500">Assigned route for {snapshot.technicianName}</p>
          </div>
          <div className="rounded-[22px] bg-[#edf2ff] px-4 py-3 text-sm font-semibold text-[#0c2348]">Completion rate: {snapshot.completionRate}</div>
        </div>
      </Card>

      <div className="grid gap-4">
        {snapshot.jobs.map((job) => (
          <Card key={job.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm text-slate-500">{job.scheduledFor ?? "Schedule pending"}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{job.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{job.description}</p>
                <p className="mt-4 text-sm text-slate-500">{job.address}</p>
                <p className="mt-1 text-sm text-slate-500">{job.customerName} • {job.customerPhone}</p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <StatusPill status={job.status} />
                <Link href={`/technician/jobs/${job.id}`} className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
                  Open job
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
