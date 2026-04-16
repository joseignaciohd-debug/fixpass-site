import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ivory" | "dark" | "flat";
  as?: "div" | "article" | "section";
};

const variantClasses = {
  default: "surface-card",
  ivory: "surface-ivory",
  dark: "surface-navy text-parchment",
  flat: "bg-white border border-ink/8",
};

export function Card({
  children,
  className,
  variant = "default",
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 sm:p-8",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
