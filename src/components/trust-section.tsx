import { SectionHeading } from "@/components/section-heading";
import { testimonials } from "@/components/site-data";

export function TrustSection() {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trusted Service"
          title="What customers say about Fixpass"
          description="Reliable response times, consistent quality, and a hassle-free experience."
          light
        />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="rounded-3xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm leading-relaxed text-white/90">“{t.quote}”</p>
              <footer className="mt-5">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-white/70">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-8 grid gap-4 rounded-3xl border border-white/15 bg-white/5 p-5 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold text-gold">98%</p>
            <p className="text-xs text-white/80">Customer satisfaction</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gold">24-48h</p>
            <p className="text-xs text-white/80">Typical response window</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gold">Vetted</p>
            <p className="text-xs text-white/80">Professional handyman network</p>
          </div>
        </div>
      </div>
    </section>
  );
}
