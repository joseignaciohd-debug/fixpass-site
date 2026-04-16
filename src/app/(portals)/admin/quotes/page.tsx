import { Card } from "@/components/ui/card";
import { updateAdminQuoteAction } from "@/app/(portals)/admin/actions";
import { getAdminQuotesSnapshot } from "@/lib/repositories/admin-config";
import { currency } from "@/lib/utils";

export default async function AdminQuotesPage() {
  const snapshot = await getAdminQuotesSnapshot();

  return (
    <div className="grid gap-6">
      {snapshot.quotes.map((quote) => (
        <Card key={quote.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Quote opportunity</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{quote.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{quote.customerName}</p>
              <p className="mt-1 text-sm text-slate-500">{quote.requestTitle}</p>
            </div>
            <div className="rounded-[22px] bg-[#edf2ff] px-4 py-3 text-sm font-semibold text-[#0c2348]">
              {currency(quote.amount)} • {quote.discountPercent}% member discount
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">{quote.scope}</p>
          <form action={updateAdminQuoteAction} className="mt-6 flex flex-wrap items-center gap-3">
            <input type="hidden" name="quoteId" value={quote.id} />
            <select name="status" defaultValue={quote.status} className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
            <button className="rounded-full bg-[#0c2348] px-5 py-3 text-sm font-semibold text-white">Update quote</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
