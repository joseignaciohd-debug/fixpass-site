import { defaultRules, getPlan, getUser, plans, quotes, serviceRequests } from "@/lib/demo-data";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

export type AdminQuoteRow = {
  id: string;
  requestId: string;
  customerId: string;
  title: string;
  scope: string;
  amount: number;
  discountPercent: number;
  status: string;
  customerName: string;
  requestTitle: string;
};

export type AdminPlanRow = {
  id: string;
  code: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number | null;
  includedVisits: number | "Unlimited";
  maxLaborMinutes: number;
  maxRelatedTasks: number;
  outOfScopeDiscountPercent: number;
  schedulingPriority: number;
  status: string;
  fairUseNotes: string | null;
};

export type AdminServiceRuleSnapshot = {
  source: "live" | "demo";
  rules: string[];
  values: {
    oneRegisteredPropertyPerMembership: boolean;
    responseSlaHours: number;
    coveredVisitTargetBusinessDays: string;
    scheduleDependsOnAvailability: boolean;
    excludedWorkQuoteOrDecline: boolean;
  };
};

type QuoteRow = {
  id: string;
  service_request_id: string;
  customer_id: string;
  title: string;
  scope: string;
  amount: number | string;
  discount_percent: number;
  status: string;
  customers: {
    users: {
      full_name: string;
    } | null;
  } | null;
  service_requests: {
    title: string;
  } | null;
};

type PlanRow = {
  id: string;
  code: string;
  name: string;
  monthly_price: number | string;
  annual_price: number | string | null;
  included_visits: number | null;
  unlimited_visits: boolean;
  max_related_tasks: number;
  max_labor_minutes: number;
  out_of_scope_discount_percent: number;
  scheduling_priority: number;
  status: string;
  fair_use_notes: string | null;
};

type SettingRow = {
  value: {
    one_registered_property_per_membership?: boolean;
    response_sla_hours?: number;
    covered_visit_target_business_days?: string;
    schedule_depends_on_availability?: boolean;
    excluded_work_quote_or_decline?: boolean;
  } | null;
};

function numberValue(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

export async function getAdminQuotesSnapshot(): Promise<{ source: "live" | "demo"; quotes: AdminQuoteRow[] }> {
  if (!isSupabaseServerConfigured()) {
    return {
      source: "demo",
      quotes: quotes.map((quote) => ({
        id: quote.id,
        requestId: quote.requestId,
        customerId: quote.customerId,
        title: quote.title,
        scope: quote.scope,
        amount: quote.amount,
        discountPercent: quote.discountPercent,
        status: quote.status,
        customerName: getUser(quote.customerId)?.name ?? "Unknown customer",
        requestTitle: serviceRequests.find((request) => request.id === quote.requestId)?.title ?? "Service request",
      })),
    };
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return getAdminQuotesSnapshot();
  }

  try {
    const { data, error } = await client
      .from("quotes")
      .select("id,service_request_id,customer_id,title,scope,amount,discount_percent,status,customers(users(full_name)),service_requests(title)")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const liveQuotes = (data ?? []) as unknown as QuoteRow[];
    return {
      source: "live",
      quotes: liveQuotes.map((quote) => ({
        id: quote.id,
        requestId: quote.service_request_id,
        customerId: quote.customer_id,
        title: quote.title,
        scope: quote.scope,
        amount: numberValue(quote.amount),
        discountPercent: quote.discount_percent,
        status: quote.status,
        customerName: quote.customers?.users?.full_name ?? "Unknown customer",
        requestTitle: quote.service_requests?.title ?? "Service request",
      })),
    };
  } catch {
    return {
      source: "demo",
      quotes: quotes.map((quote) => ({
        id: quote.id,
        requestId: quote.requestId,
        customerId: quote.customerId,
        title: quote.title,
        scope: quote.scope,
        amount: quote.amount,
        discountPercent: quote.discountPercent,
        status: quote.status,
        customerName: getUser(quote.customerId)?.name ?? "Unknown customer",
        requestTitle: serviceRequests.find((request) => request.id === quote.requestId)?.title ?? "Service request",
      })),
    };
  }
}

export async function getAdminPlansSnapshot(): Promise<{ source: "live" | "demo"; plans: AdminPlanRow[] }> {
  if (!isSupabaseServerConfigured()) {
    return {
      source: "demo",
      plans: plans.map((plan) => ({
        id: plan.id,
        code: plan.id,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        includedVisits: plan.includedVisits,
        maxLaborMinutes: plan.maxLaborMinutes,
        maxRelatedTasks: plan.maxRelatedTasks,
        outOfScopeDiscountPercent: plan.outOfScopeDiscount,
        schedulingPriority: plan.priority === "Fastest" ? 3 : plan.priority === "Priority" ? 2 : 1,
        status: plan.active ? "active" : "inactive",
        fairUseNotes: plan.fairUseNotes ?? null,
      })),
    };
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return getAdminPlansSnapshot();
  }

  try {
    const { data, error } = await client
      .from("membership_plans")
      .select("id,code,name,monthly_price,annual_price,included_visits,unlimited_visits,max_related_tasks,max_labor_minutes,out_of_scope_discount_percent,scheduling_priority,status,fair_use_notes")
      .order("scheduling_priority", { ascending: true });

    if (error) {
      throw error;
    }

    const livePlans = (data ?? []) as PlanRow[];
    return {
      source: "live",
      plans: livePlans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        monthlyPrice: numberValue(plan.monthly_price),
        annualPrice: plan.annual_price ? numberValue(plan.annual_price) : null,
        includedVisits: plan.unlimited_visits ? "Unlimited" : Number(plan.included_visits ?? 0),
        maxLaborMinutes: plan.max_labor_minutes,
        maxRelatedTasks: plan.max_related_tasks,
        outOfScopeDiscountPercent: plan.out_of_scope_discount_percent,
        schedulingPriority: plan.scheduling_priority,
        status: plan.status,
        fairUseNotes: plan.fair_use_notes,
      })),
    };
  } catch {
    return {
      source: "demo",
      plans: plans.map((plan) => ({
        id: plan.id,
        code: plan.id,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        includedVisits: plan.includedVisits,
        maxLaborMinutes: plan.maxLaborMinutes,
        maxRelatedTasks: plan.maxRelatedTasks,
        outOfScopeDiscountPercent: plan.outOfScopeDiscount,
        schedulingPriority: plan.priority === "Fastest" ? 3 : plan.priority === "Priority" ? 2 : 1,
        status: plan.active ? "active" : "inactive",
        fairUseNotes: plan.fairUseNotes ?? null,
      })),
    };
  }
}

export async function getAdminServiceRulesSnapshot(): Promise<AdminServiceRuleSnapshot> {
  const demoValues = {
    oneRegisteredPropertyPerMembership: true,
    responseSlaHours: 24,
    coveredVisitTargetBusinessDays: "1-3",
    scheduleDependsOnAvailability: true,
    excludedWorkQuoteOrDecline: true,
  };

  if (!isSupabaseServerConfigured()) {
    return {
      source: "demo",
      rules: defaultRules,
      values: demoValues,
    };
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return {
      source: "demo",
      rules: defaultRules,
      values: demoValues,
    };
  }

  try {
    const { data, error } = await client.from("settings").select("value").eq("key", "service_rules").maybeSingle();
    if (error) {
      throw error;
    }

    const live = (data as SettingRow | null)?.value ?? null;
    if (!live) {
      return {
        source: "demo",
        rules: defaultRules,
        values: demoValues,
      };
    }

    const values = {
      oneRegisteredPropertyPerMembership: Boolean(live.one_registered_property_per_membership),
      responseSlaHours: Number(live.response_sla_hours ?? 24),
      coveredVisitTargetBusinessDays: live.covered_visit_target_business_days ?? "1-3",
      scheduleDependsOnAvailability: Boolean(live.schedule_depends_on_availability),
      excludedWorkQuoteOrDecline: Boolean(live.excluded_work_quote_or_decline),
    };

    const rules = [
      values.oneRegisteredPropertyPerMembership ? "One registered property per membership" : "Multiple properties allowed",
      `All requests receive a response within ${values.responseSlaHours} hours`,
      `Covered visits target scheduling within ${values.coveredVisitTargetBusinessDays} business days`,
      values.scheduleDependsOnAvailability ? "Scheduling depends on technician availability" : "Scheduling is fixed regardless of availability",
      values.excludedWorkQuoteOrDecline ? "Excluded work may be quoted separately or declined" : "Excluded work is automatically declined",
    ];

    return {
      source: "live",
      rules,
      values,
    };
  } catch {
    return {
      source: "demo",
      rules: defaultRules,
      values: demoValues,
    };
  }
}
