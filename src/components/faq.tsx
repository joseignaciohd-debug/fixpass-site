import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/components/site-data";

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Everything you need to know"
        description="Clear answers before you subscribe."
      />
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none text-base font-semibold text-ink">{faq.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-slate">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
