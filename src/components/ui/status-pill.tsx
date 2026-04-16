import { cn, titleCase } from "@/lib/utils";

const toneMap: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  "under review": "bg-amber-50 text-amber-700",
  scheduled: "bg-sky-50 text-sky-700",
  "technician assigned": "bg-indigo-50 text-indigo-700",
  "in progress": "bg-violet-50 text-violet-700",
  completed: "bg-emerald-50 text-emerald-700",
  "quoted separately": "bg-orange-50 text-orange-700",
  declined: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase",
        toneMap[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {titleCase(status)}
    </span>
  );
}
