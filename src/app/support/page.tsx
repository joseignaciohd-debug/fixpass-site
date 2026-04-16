import Link from "next/link";
import { Card } from "@/components/ui/card";

const supportItems = [
  ["Response standard", "All inbound requests receive an operator response within 24 hours."],
  ["Covered visit target", "Most covered visits target scheduling within 1 to 3 business days based on availability."],
  ["Billing help", "Customers can manage billing through the customer app and contact Fixpass for exceptions or account review."],
  ["Out-of-scope work", "Requests outside plan scope may be quoted separately or declined depending on safety, licensing, or workload."],
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Support</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-slate-950">Customer support and launch contact</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Use this page as the public support destination for customers, App Store review, and launch operations.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr,0.9fr]">
        <Card className="bg-white/88">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Support channels</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Email: <a className="font-medium text-slate-950" href="mailto:support@fixpass.com">support@fixpass.com</a>
            </p>
            <p>
              Privacy: <a className="font-medium text-slate-950" href="mailto:privacy@fixpass.com">privacy@fixpass.com</a>
            </p>
            <p>
              Phone: <span className="font-medium text-slate-950">(713) 555-0188</span>
            </p>
            <p>
              Service area: <span className="font-medium text-slate-950">Katy, Texas launch market</span>
            </p>
          </div>
        </Card>

        <Card className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fe_100%)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Operational expectations</h2>
          <div className="mt-6 space-y-4">
            {supportItems.map(([title, body]) => (
              <div key={title} className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-8 bg-white/88">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Launch references</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Public legal and support pages now exist at{" "}
          <Link className="font-medium text-slate-950" href="/privacy">
            Privacy
          </Link>{" "}
          and{" "}
          <Link className="font-medium text-slate-950" href="/terms">
            Terms
          </Link>
          . Use these URLs in App Store Connect, support workflows, and launch documentation.
        </p>
      </Card>
    </main>
  );
}
