import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ivory" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
};

const variants = {
  primary:
    "bg-ink text-parchment hover:bg-navy shadow-[0_20px_50px_-24px_rgba(11,27,54,0.6)] hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-26px_rgba(30,58,138,0.65)]",
  secondary:
    "bg-parchment text-ink border border-ink/12 hover:border-ink/30 hover:bg-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
  outline:
    "bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink/5",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5",
  ivory:
    "bg-ivory text-ink border border-ink/8 hover:bg-stone hover:border-ink/20",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  type,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/60 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes}>
      {children}
    </button>
  );
}
