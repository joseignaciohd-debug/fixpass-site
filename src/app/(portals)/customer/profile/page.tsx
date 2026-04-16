import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireDemoRole } from "@/lib/auth";
import { getCustomerPortalSnapshot, getPropertyAddress } from "@/lib/repositories/customer-operations";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerProfilePage() {
  const session = await requireDemoRole("customer");
  const snapshot = await getCustomerPortalSnapshot(session.userId);

  if (!snapshot) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.2)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Profile</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Profile details are not ready yet.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">
          This account exists, but the live customer profile is missing some required property or subscription records for the web portal.
        </p>
        <div className="mt-6">
          <Link href="/support" className="inline-block rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2348] text-white shadow-[0_28px_80px_rgba(12,35,72,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Profile</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{snapshot.user.name}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/72">
              Keep your registered property, account details, and membership support in one place, just like the mobile app.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/14 bg-[rgba(255,255,255,0.10)] px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Membership status</p>
            <p className="mt-2 text-lg font-semibold">{snapshot.plan.name}</p>
            <p className="mt-2 text-sm text-white/65">{snapshot.subscription.status}</p>
          </div>
        </div>
        <div className="mt-8 rounded-[24px] border border-white/12 bg-[rgba(255,255,255,0.08)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">Account email</p>
          <p className="mt-3 text-lg font-semibold">{snapshot.user.email}</p>
          <p className="mt-2 text-sm text-white/68">{snapshot.user.phone}</p>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr,0.95fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Registered property</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{snapshot.property.nickname}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Address</p>
              <p className="mt-2 font-semibold text-slate-950">{getPropertyAddress(snapshot.property)}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Home type</p>
              <p className="mt-2 font-semibold text-slate-950">{snapshot.property.homeType}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[22px] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600">
            <span className="font-semibold text-slate-950">Access notes:</span> {snapshot.property.accessNotes || "No access notes yet."}
          </div>
          <div className="mt-6">
            <Link href="/customer/property" className="inline-block rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
              Edit property details
            </Link>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Billing history</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Recent charges</h2>
          <div className="mt-6 space-y-4">
            {snapshot.billing.length ? (
              snapshot.billing.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-slate-950">{currency(item.amount)}</p>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.billedAt} • {item.method}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No web billing records yet. Charges made through Fixpass will appear here.
              </div>
            )}
          </div>
          <div className="mt-6">
            <Link href="/customer/billing" className="inline-block rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
              Open billing details
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Support expectations</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Responses within 24 hours",
            "Most covered visits target 1 to 3 business days",
            "Excluded or oversized work may be quoted separately",
          ].map((item) => (
            <div key={item} className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/support" className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
            Open support
          </Link>
          <Link href="/privacy" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            Privacy
          </Link>
          <Link href="/terms" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            Terms
          </Link>
        </div>
      </Card>
    </div>
  );
}
