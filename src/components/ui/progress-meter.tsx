export function ProgressMeter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-950">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-[linear-gradient(90deg,#0c2348_0%,#2563eb_100%)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
