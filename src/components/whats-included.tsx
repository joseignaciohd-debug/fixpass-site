import { SectionHeading } from "@/components/section-heading";
import { fixExamples } from "@/components/site-data";

export function WhatsIncluded() {
  return (
    <section className="bg-fog py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What Counts As A Fix"
          title="The tasks that quietly break your week"
          description="Fixpass is made for the everyday home issues you want solved fast and professionally."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fixExamples.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-ink">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Major remodels, structural work, and large-scale renovations are not included in subscription fixes.
        </p>
      </div>
    </section>
  );
}
