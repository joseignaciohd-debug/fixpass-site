import { Card } from "@/components/ui/card";
import { requireDemoRole } from "@/lib/auth";
import { getCustomerPortalSnapshot } from "@/lib/repositories/customer-operations";

export default async function CustomerInboxPage() {
  const session = await requireDemoRole("customer");
  const snapshot = await getCustomerPortalSnapshot(session.userId);

  if (!snapshot) {
    return null;
  }

  return (
    <Card className="rounded-[32px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-heading">Inbox</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Service updates, without noise.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Fixpass keeps communication simple so you can see what changed, what is scheduled, and what needs your attention next.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
          {snapshot.notifications.length} updates
        </div>
      </div>

      <div className="mt-8">
        {snapshot.notifications.length ? (
          <div className="space-y-0">
            {snapshot.notifications.map((item, index) => (
              <div key={item.id} className="grid gap-0 md:grid-cols-[28px,1fr]">
                <div className="hidden md:flex flex-col items-center">
                  <span className="mt-6 h-3 w-3 rounded-full bg-[#2d67c8]" />
                  {index < snapshot.notifications.length - 1 ? <span className="mt-3 h-full w-px bg-slate-200" /> : null}
                </div>
                <div className="mb-4 rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
                  <p className="text-base font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No updates yet. Scheduling confirmations and service notes will appear here as soon as requests are active.
          </div>
        )}
      </div>
    </Card>
  );
}

