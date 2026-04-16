import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  change,
  tone = "neutral",
}: {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "neutral" | "alert";
}) {
  return (
    <Card className="space-y-4 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,249,253,0.92))]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="h-2.5 w-2.5 rounded-full bg-[#d6e5ff]" />
      </div>
      <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
      <p
        className={cn("text-sm", {
          positive: "text-emerald-600",
          neutral: "text-slate-500",
          alert: "text-amber-600",
        }[tone])}
      >
        {change}
      </p>
    </Card>
  );
}
