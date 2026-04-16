import Link from "next/link";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Membership scope",
    body:
      "Fixpass is a membership for small, defined home repair and maintenance visits. Coverage is limited by plan allowances, fair-use rules, labor caps, materials allowances, exclusions, and one registered property per active membership.",
  },
  {
    title: "Scheduling and availability",
    body:
      "Fixpass reviews each request before scheduling. Response targets and visit timing depend on availability, service area coverage, and whether the request is covered, excluded, or requires a separate quote.",
  },
  {
    title: "Excluded work",
    body:
      "Electrical, plumbing beyond minor non-invasive adjustments, HVAC, roofing, structural work, hazardous work, licensed-trade work, oversized work, and commercial workloads may be declined or quoted separately.",
  },
  {
    title: "Billing and renewals",
    body:
      "Memberships renew on the cadence selected during checkout unless canceled. Billing, invoices, payment methods, and plan updates are managed through Fixpass billing systems and secure payment providers.",
  },
  {
    title: "Account closure",
    body:
      "Customers can request account deletion through the mobile app. Active memberships should be canceled before deletion to avoid billing or service interruptions during processing.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Terms</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-slate-950">Fixpass Terms of Service</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          These terms describe the operating rules for using Fixpass memberships, submitting requests, receiving
          technician service, and managing billing.
        </p>
      </div>

      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <Card key={section.title} className="bg-white/88">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fe_100%)]">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Need help?</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Visit <Link className="font-medium text-slate-950" href="/support">Support</Link> for response expectations, contact options,
          and next steps for billing or account questions.
        </p>
      </Card>
    </main>
  );
}
