import { getPlan, subscriptions } from "@/lib/demo-data";

export function getSubscriptionByCustomer(customerId: string) {
  return subscriptions.find((item) => item.customerId === customerId);
}

export function getMembershipSnapshot(customerId: string) {
  const subscription = getSubscriptionByCustomer(customerId);

  if (!subscription) {
    return null;
  }

  const plan = getPlan(subscription.planId);

  if (!plan) {
    return null;
  }

  const visitsLabel =
    subscription.visitsRemaining === "Unlimited"
      ? "Unlimited covered visits"
      : `${subscription.visitsRemaining} visits remaining`;

  const materialsRemaining = Math.max(plan.materialsAllowance - subscription.materialsUsed, 0);

  return {
    subscription,
    plan,
    visitsLabel,
    materialsRemaining,
    usagePercent:
      subscription.visitsRemaining === "Unlimited"
        ? 0
        : Math.min(
            Math.round(
              (subscription.visitsUsed /
                ((typeof plan.includedVisits === "number" ? plan.includedVisits : subscription.visitsUsed) || 1)) *
                100,
            ),
            100,
          ),
  };
}

export function getPlanGuardrails(planId: string) {
  const plan = getPlan(planId);

  if (!plan) {
    return [];
  }

  return [
    `Up to ${plan.maxRelatedTasks} small related tasks per covered visit`,
    `Up to ${plan.maxLaborMinutes} labor minutes per covered visit`,
    `${plan.priority} scheduling priority`,
    `${plan.outOfScopeDiscount}% discount on quoted separate work`,
    plan.materialsAllowance > 0
      ? `$${plan.materialsAllowance} monthly materials allowance`
      : "Materials billed separately unless specifically included",
  ];
}
