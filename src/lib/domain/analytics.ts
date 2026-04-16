import { billingRecords, fairUseFlags, growthSeries, plans, serviceRequests, subscriptions } from "@/lib/demo-data";

export function getAdminMetrics() {
  const activeMembers = subscriptions.filter((item) => item.status === "active").length;
  const mrr = subscriptions.reduce((total, subscription) => {
    const plan = plans.find((entry) => entry.id === subscription.planId);
    if (!plan) {
      return total;
    }

    return total + (subscription.billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12);
  }, 0);

  const coveredRequests = serviceRequests.filter((item) => item.category === "covered").length;
  const quoteOpportunities = serviceRequests.filter((item) => item.category === "quote").length;
  const averageLaborMinutes = Math.round(
    serviceRequests.reduce((total, request) => total + request.estimatedMinutes, 0) / serviceRequests.length,
  );

  const outstandingRevenue = billingRecords
    .filter((record) => record.status === "upcoming")
    .reduce((sum, record) => sum + record.amount, 0);

  return {
    activeMembers,
    mrr,
    coveredRequests,
    quoteOpportunities,
    fairUseCount: fairUseFlags.filter((item) => item.status !== "resolved").length,
    averageLaborMinutes,
    outstandingRevenue,
    growthSeries,
  };
}
