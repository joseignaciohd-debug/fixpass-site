import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "ink" | "ivory" | "sage" | "terracotta" | "honey" | "success" | "warning" | "danger";
  className?: string;
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-parchment text-ink border border-ink/10",
  ink: "bg-ink text-parchment border border-ink",
  ivory: "bg-ivory text-ink border border-ink/10",
  sage: "bg-sage-soft text-[#3f5139] border border-sage/30",
  terracotta: "bg-terracotta-soft text-[#86382a] border border-terracotta/30",
  honey: "bg-honey-soft text-[#805626] border border-honey/30",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-rose-50 text-rose-700 border border-rose-200",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
