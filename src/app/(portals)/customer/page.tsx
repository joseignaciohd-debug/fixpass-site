import Link from "next/link";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { StatusPill } from "@/components/ui/status-pill";
import { requireDemoRole } from "@/lib/auth";
import { getCustomerPortalSnapshot, getPropertyAddress } from "@/lib/repositories/customer-operations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerPage() {
  const session = await requireDemoRole("customer");
  const snapshot = await getCustomerPortalSnapshot(session.userId);

  if (!snapshot) {
    return (
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.2)]">
        <p className="section-heading">Customer app</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">We could not load this account yet.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">
          Your Fixpass sign-in worked, but this web account does not have a complete customer record available for the live portal yet.
          Please contact support or finish account setup in the app first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/support" className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">
            Contact support
          </Link>
          <Link href="/customer/requests" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            Open requests
          </Link>
        </div>
      </section>
    );
  }

  const nextRequest = snapshot.requests.find((request) => request.status.toLowerCase() !== "completed") ?? snapshot.requests[0];
  const activeCount = snapshot.requests.filter((request) => request.status.toLowerCase() !== "completed").length;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[34px] border border-[#173766] bg-[linear-gradient(180deg,rgba(12,35,72,0.98),rgba(21,55,107,0.96))] p-6 text-white shadow-[0_28px_80px_rgba(12,35,72,0.22)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/68">Membership</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] lg:text-4xl">{snapshot.user.name}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/76">
                Small home repairs, one clean membership. You always know what is covered, what is scheduled, and what needs your attention next.
              </p>
            </div>
            <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white/84">Member account</div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-white/68">Visits</p>
              <p className="mt-2 text-2xl font-semibold">
                {typeof snapshot.subscription.visitsRemaining === "string" ? snapshot.subscription.visitsRemaining : snapshot.subscription.visitsRemaining}
              </p>
              <p className="mt-1 text-sm text-white/68">
                {typeof snapshot.subscription.visitsRemaining === "string"
                  ? "Fair use applies this cycle"
                  : `${snapshot.subscription.visitsUsed} used this cycle`}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-white/68">Renewal</p>
              <p className="mt-2 text-2xl font-semibold">{snapshot.subscription.renewalDate}</p>
              <p className="mt-1 text-sm text-white/68">{snapshot.plan.name}</p>
            </div>
          </div>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
            <ProgressMeter label="Visit usage this cycle" value={snapshot.usagePercent} />
            <div className="mt-4 text-sm text-white/72">Materials remaining this month: ${snapshot.materialsRemaining.toFixed(2)}</div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.2)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-heading">Next step</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">What needs attention now</h2>
            </div>
            <div className="rounded-full bg-[#edf2ff] px-4 py-2 text-sm font-semibold text-[#0c2348]">{activeCount} active</div>
          </div>
          {nextRequest ? (
            <Link href="/customer/requests" className="mt-6 block rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#fbfcff_0%,#f5f8fd_100%)] p-5 transition hover:border-slate-300">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{nextRequest.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {nextRequest.area} • {nextRequest.preferredWindow}
                  </p>
                </div>
                <StatusPill status={nextRequest.status} />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{nextRequest.description}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-[#0c2348]">{nextRequest.coverageSummary}</span>
                <span className="font-semibold text-slate-950">Open requests</span>
              </div>
            </Link>
          ) : (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No requests yet. When you submit your first repair request, Fixpass will keep the status and next steps here.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Link href="/customer/requests" className="surface-card rounded-[30px] p-6 transition hover:border-slate-300">
          <div>
            <p className="section-heading">Quick action</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Request help</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Submit a covered task or small repair and keep review, scheduling, and status updates in one place.</p>
          </div>
        </Link>
        <Link href="/customer/profile" className="surface-card rounded-[30px] p-6 transition hover:border-slate-300">
          <div>
            <p className="section-heading">Quick action</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Property</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Update access notes, address details, and the registered home tied to your membership.</p>
          </div>
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.2)] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Recent updates</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Communication without clutter</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">{snapshot.notifications.length} updates</div>
        </div>
        <div className="mt-6 grid gap-4">
          {snapshot.notifications.length ? (
            snapshot.notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="surface-muted rounded-[26px] p-5">
                <p className="text-base font-semibold text-slate-950">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            ))
          ) : (
            <div className="surface-muted rounded-[26px] p-5 text-sm text-slate-500">
              No notifications yet. Scheduling confirmations and service notes will appear here as your requests move forward.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.2)] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Membership details</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{snapshot.plan.name}</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">{snapshot.subscription.billingCycle} billing</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="surface-muted rounded-[24px] p-5">
            <p className="text-sm text-slate-500">Registered property</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{snapshot.property.nickname}</p>
            <p className="mt-1 text-sm text-slate-600">{getPropertyAddress(snapshot.property)}</p>
          </div>
          <div className="surface-muted rounded-[24px] p-5">
            <p className="text-sm text-slate-500">Coverage guardrails</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Up to {snapshot.plan.maxRelatedTasks} small related tasks in one area or one moderately sized covered job, with a {snapshot.plan.maxLaborMinutes}-minute labor cap.
            </p>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
