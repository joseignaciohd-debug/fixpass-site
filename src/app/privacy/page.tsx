import Link from "next/link";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Information we collect",
    body:
      "Fixpass collects the information needed to operate a home repair membership, including your name, contact details, registered property address, request descriptions, uploaded photos, billing records, and account preferences.",
  },
  {
    title: "How we use it",
    body:
      "We use your information to manage memberships, review service requests, schedule technicians, provide billing support, communicate about visits, and improve service reliability and operations.",
  },
  {
    title: "Who can access it",
    body:
      "Customer data is limited to the customer, authorized Fixpass operations staff, and assigned technicians when needed to complete service. Billing is handled through secure providers such as Stripe.",
  },
  {
    title: "Storage and retention",
    body:
      "Request photos, notes, and billing records are stored in Fixpass systems and service providers that support the platform. Records may be retained for operational, billing, legal, and customer support reasons.",
  },
  {
    title: "Your choices",
    body:
      "You can request account deletion from the mobile app, update your property and profile information, and contact Fixpass for privacy-related questions or support needs.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Privacy</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-slate-950">Fixpass Privacy Policy</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          This policy describes how Fixpass handles customer information across the Fixpass website, customer app,
          technician tools, and internal operations platform.
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
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Questions</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Contact Fixpass at <a className="font-medium text-slate-950" href="mailto:privacy@fixpass.com">privacy@fixpass.com</a> or visit{" "}
          <Link className="font-medium text-slate-950" href="/support">
            Support
          </Link>{" "}
          for operational or account help.
        </p>
      </Card>
    </main>
  );
}
