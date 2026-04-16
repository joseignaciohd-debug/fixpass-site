import { Card } from "@/components/ui/card";
import { getAdminOperationsSnapshot } from "@/lib/repositories/admin-operations";

export default async function AdminAnalyticsPage() {
  const { metrics, source } = await getAdminOperationsSnapshot();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Growth trend</p>
        <div className="mt-8 flex h-72 items-end gap-4">
          {metrics.growthSeries.map((item) => (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
              <div className="chart-bar w-full rounded-t-[18px]" style={{ height: `${item.members * 1.5}px` }} />
              <div className="text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-950">{item.month}</p>
                <p>{item.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Analytics layer</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            {source === "live"
              ? "This dashboard is reading operational data from Supabase and can be promoted into SQL views or materialized analytics later."
              : "This dashboard is using the current configured data source for analytics and reporting."}
          </p>
          <p>Current MRR estimate: ${metrics.mrr.toFixed(2)}</p>
          <p>Open fair-use reviews: {metrics.fairUseCount}</p>
          <p>For production scale, promote these calculations into SQL views or materialized views and chart them here with Recharts.</p>
        </div>
      </Card>
    </div>
  );
}
