type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${light ? "text-gold/90" : "text-navy/70"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-semibold tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/80" : "text-slate"}`}>{description}</p>
    </div>
  );
}
