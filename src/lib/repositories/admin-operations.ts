import { billingRecords, fairUseFlags, getPlan, getProperty, getUser, plans, properties, quotes, serviceRequests, subscriptions, users } from "@/lib/demo-data";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

type AdminMetric = {
  activeMembers: number;
  mrr: number;
  coveredRequests: number;
  outstandingRevenue: number;
  quoteOpportunities: number;
  averageLaborMinutes: number;
  fairUseCount: number;
  growthSeries: Array<{ month: string; members: number }>;
};

type AdminRequestRow = {
  id: string;
  title: string;
  area: string;
  status: string;
  category: string;
  preferredWindow: string;
  customerName: string;
  planName: string;
  notes: string;
  address: string;
  scheduledFor: string | null;
  createdAt: string;
  assignedTechnicianName: string | null;
  fairUseOpen: boolean;
};

type AdminOpsSnapshot = {
  source: "live" | "demo";
  metrics: AdminMetric;
  queueSummary: {
    newIntake: number;
    needsScheduling: number;
    quoteReview: number;
    fairUseReview: number;
    unassigned: number;
  };
  requests: AdminRequestRow[];
  technicians: Array<{ id: string; name: string; region: string }>;
  fairUse: Array<{ id: string; reason: string; severity: string; status: string }>;
  quotes: Array<{ id: string; title: string; amount: number; status: string }>;
  customers: Array<{
    id: string;
    name: string;
    email: string;
    propertyLabel: string;
    planName: string;
    billingCycle: string;
    status: string;
    requestCount: number;
    openRequestCount: number;
    lastRequestAt: string | null;
    attention: string;
    revenueLabel: string;
    visitsLabel: string;
    fairUseOpen: number;
  }>;
};

type SubscriptionRow = {
  id: string;
  status: string;
  billing_cycle: "monthly" | "annual";
  created_at: string;
  current_period_end: string;
  membership_plan_id: string;
  customer_id: string;
  property_id: string;
  membership_plans: {
    id: string;
    name: string;
    monthly_price: number;
    annual_price: number | null;
  } | null;
};

type ServiceRequestRow = {
  id: string;
  title: string;
  area: string | null;
  request_status: string;
  preferred_window: string | null;
  internal_notes: string | null;
  created_at: string;
  scheduled_for: string | null;
  estimated_minutes: number | null;
  category: string | null;
  customers: {
    id: string;
    users: {
      full_name: string;
    } | null;
  } | null;
  properties: {
    address_line_1: string;
    city: string;
    state: string;
  } | null;
  subscriptions: {
    membership_plans: {
      name: string;
    } | null;
  } | null;
};

type FairUseRow = {
  id: string;
  customer_id?: string;
  service_request_id?: string | null;
  reason: string;
  severity: string;
  status: string;
};

type QuoteRow = {
  id: string;
  title: string;
  amount: number | string;
  status: string;
};

type BillingRow = {
  amount: number | string;
  status: string;
  billed_at: string;
};

type TechnicianDirectoryRow = {
  id: string;
  service_region: string | null;
  users: Array<{
    full_name: string;
  }> | null;
};

type CustomerDirectoryRow = {
  id: string;
  household_type: string | null;
  users:
    | {
        full_name: string | null;
        email: string | null;
      }
    | null;
  properties:
    | Array<{
        address_line_1: string;
        city: string;
        state: string;
      }>
    | null;
};

type PlanUsageRow = {
  subscription_id: string;
  visits_used: number;
  labor_minutes_used: number;
  materials_used: number | string;
  fair_use_review_required: boolean;
};

type AssignmentRow = {
  service_request_id: string;
  assignment_status: string;
  technicians:
    | {
        users: Array<{
          full_name: string;
        }> | null;
      }
    | null;
};

export async function getAdminOperationsSnapshot(): Promise<AdminOpsSnapshot> {
  if (!isSupabaseServerConfigured()) {
    return getDemoSnapshot();
  }

  const client = createSupabaseServerClient();

  if (!client) {
    return getDemoSnapshot();
  }

  try {
    const [subscriptionsResult, requestsResult, flagsResult, quotesResult, billingResult, techniciansResult, customersResult, usageResult, assignmentsResult] = await Promise.all([
      client
        .from("subscriptions")
        .select("id,status,billing_cycle,created_at,current_period_end,membership_plan_id,customer_id,property_id,membership_plans(id,name,monthly_price,annual_price)")
        .order("created_at", { ascending: false }),
      client
        .from("service_requests")
        .select("id,title,area,request_status,preferred_window,internal_notes,created_at,scheduled_for,estimated_minutes,category,customers(id,users(full_name)),properties(address_line_1,city,state),subscriptions(membership_plans(name))")
        .order("created_at", { ascending: false }),
      client.from("fair_use_flags").select("id,customer_id,service_request_id,reason,severity,status,created_at").order("created_at", { ascending: false }),
      client.from("quotes").select("id,title,amount,status,created_at").order("created_at", { ascending: false }),
      client.from("billing_records").select("id,amount,status,billed_at").order("billed_at", { ascending: false }),
      client.from("technicians").select("id,service_region,users(full_name)").eq("active", true).order("created_at", { ascending: true }),
      client.from("customers").select("id,household_type,users(full_name,email),properties(address_line_1,city,state)").order("created_at", { ascending: false }),
      client.from("plan_usage").select("subscription_id,visits_used,labor_minutes_used,materials_used,fair_use_review_required").order("usage_month", { ascending: false }),
      client.from("technician_assignments").select("service_request_id,assignment_status,technicians(users(full_name))").order("created_at", { ascending: false }),
    ]);

    if (
      subscriptionsResult.error ||
      requestsResult.error ||
      flagsResult.error ||
      quotesResult.error ||
      billingResult.error ||
      techniciansResult.error ||
      customersResult.error ||
      usageResult.error ||
      assignmentsResult.error
    ) {
      return getDemoSnapshot();
    }

    const liveSubscriptions = (subscriptionsResult.data ?? []) as unknown as SubscriptionRow[];
    const liveRequests = (requestsResult.data ?? []) as unknown as ServiceRequestRow[];
    const liveFlags = (flagsResult.data ?? []) as FairUseRow[];
    const liveQuotes = (quotesResult.data ?? []) as QuoteRow[];
    const liveBilling = (billingResult.data ?? []) as BillingRow[];
    const liveTechnicians = (techniciansResult.data ?? []) as unknown as TechnicianDirectoryRow[];
    const liveCustomers = (customersResult.data ?? []) as unknown as CustomerDirectoryRow[];
    const liveUsage = (usageResult.data ?? []) as PlanUsageRow[];
    const liveAssignments = (assignmentsResult.data ?? []) as unknown as AssignmentRow[];
    const assignmentMap = new Map(liveAssignments.map((assignment) => [assignment.service_request_id, assignment]));
    const fairUseRequestMap = new Set(
      liveFlags.filter((flag) => flag.status === "open" && flag.service_request_id).map((flag) => flag.service_request_id as string),
    );

    return {
      source: "live",
      metrics: buildMetrics(liveSubscriptions, liveRequests, liveFlags, liveBilling),
      queueSummary: buildQueueSummary(
        liveRequests.map((request) => ({
          status: request.request_status,
          category: request.category,
          scheduledFor: request.scheduled_for,
          assigned: Boolean(assignmentMap.get(request.id)),
          fairUseOpen: fairUseRequestMap.has(request.id),
        })),
      ),
      requests: liveRequests.map((request) => ({
        id: request.id,
        title: request.title,
        area: request.area ?? "General",
        status: request.request_status,
        category: request.category ?? "covered",
        preferredWindow: request.preferred_window ?? "Needs scheduling",
        customerName: request.customers?.users?.full_name ?? "Unknown customer",
        planName: request.subscriptions?.membership_plans?.name ?? "No plan",
        notes: request.internal_notes ?? "No internal notes yet.",
        address: request.properties
          ? `${request.properties.address_line_1}, ${request.properties.city}, ${request.properties.state}`
          : "Address pending",
        scheduledFor: request.scheduled_for,
        createdAt: request.created_at,
        assignedTechnicianName: assignmentMap.get(request.id)?.technicians?.users?.[0]?.full_name ?? null,
        fairUseOpen: fairUseRequestMap.has(request.id),
      })),
      technicians: liveTechnicians.map((technician) => ({
        id: technician.id,
        name: technician.users?.[0]?.full_name ?? "Technician",
        region: technician.service_region ?? "Unassigned region",
      })),
      fairUse: liveFlags.map((flag) => ({
        id: flag.id,
        reason: flag.reason,
        severity: flag.severity,
        status: flag.status,
      })),
      quotes: liveQuotes.map((quote) => ({
        id: quote.id,
        title: quote.title,
        amount: Number(quote.amount),
        status: quote.status,
      })),
      customers: buildCustomerRows(liveCustomers, liveSubscriptions, liveRequests, liveFlags, liveUsage),
    };
  } catch {
    return getDemoSnapshot();
  }
}

function buildMetrics(
  liveSubscriptions: SubscriptionRow[],
  liveRequests: ServiceRequestRow[],
  liveFlags: Array<{ status: string }>,
  liveBilling: Array<{ amount: number | string; status: string; billed_at: string }>,
): AdminMetric {
  const activeSubscriptions = liveSubscriptions.filter((subscription) => subscription.status === "active");
  const mrr = activeSubscriptions.reduce((sum, subscription) => {
    const plan = subscription.membership_plans;
    if (!plan) {
      return sum;
    }

    if (subscription.billing_cycle === "annual") {
      const annualPrice = Number(plan.annual_price ?? plan.monthly_price * 12);
      return sum + annualPrice / 12;
    }

    return sum + Number(plan.monthly_price);
  }, 0);

  const growthSeries = buildGrowthSeries(activeSubscriptions.map((subscription) => subscription.created_at));
  const outstandingRevenue = liveBilling
    .filter((record) => record.status === "upcoming")
    .reduce((sum, record) => sum + Number(record.amount), 0);
  const averageLaborMinutes = liveRequests.length
    ? Math.round(
        liveRequests.reduce((sum, request) => sum + (request.estimated_minutes ?? 0), 0) / liveRequests.length,
      )
    : 0;

  return {
    activeMembers: activeSubscriptions.length,
    mrr,
    coveredRequests: liveRequests.filter((request) => request.category === "covered").length,
    outstandingRevenue,
    quoteOpportunities: liveRequests.filter((request) => request.category === "quote" || request.request_status === "quoted separately").length,
    averageLaborMinutes,
    fairUseCount: liveFlags.filter((flag) => flag.status === "open").length,
    growthSeries,
  };
}

function buildGrowthSeries(createdAtValues: string[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleString("en-US", { month: "short" }),
      members: 0,
    };
  });

  for (const createdAt of createdAtValues) {
    const date = new Date(createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = months.find((item) => item.key === key);
    if (bucket) {
      bucket.members += 1;
    }
  }

  let runningTotal = 0;
  return months.map((month) => {
    runningTotal += month.members;
    return { month: month.month, members: runningTotal };
  });
}

function buildQueueSummary(
  requests: Array<{ status: string; category: string | null; scheduledFor: string | null; assigned: boolean; fairUseOpen: boolean }>,
) {
  return {
    newIntake: requests.filter((request) => request.status === "pending" || request.status === "under review").length,
    needsScheduling: requests.filter(
      (request) =>
        ["pending", "under review", "scheduled"].includes(request.status) &&
        !request.scheduledFor,
    ).length,
    quoteReview: requests.filter((request) => request.category === "quote" || request.status === "quoted separately").length,
    fairUseReview: requests.filter((request) => request.fairUseOpen).length,
    unassigned: requests.filter(
      (request) =>
        ["scheduled", "technician assigned", "in progress"].includes(request.status) &&
        !request.assigned,
    ).length,
  };
}

function buildCustomerRows(
  customers: CustomerDirectoryRow[],
  liveSubscriptions: SubscriptionRow[],
  liveRequests: ServiceRequestRow[],
  liveFlags: FairUseRow[],
  liveUsage: PlanUsageRow[],
) {
  const latestUsageBySubscription = new Map<string, PlanUsageRow>();
  for (const usage of liveUsage) {
    if (!latestUsageBySubscription.has(usage.subscription_id)) {
      latestUsageBySubscription.set(usage.subscription_id, usage);
    }
  }

  return customers.map((customer) => {
    const subscription = liveSubscriptions.find((entry) => entry.customer_id === customer.id);
    const customerRequests = liveRequests.filter((request) => request.customers?.id === customer.id);
    const openRequestCount = customerRequests.filter((request) => !["completed", "declined", "cancelled"].includes(request.request_status)).length;
    const fairUseOpen = liveFlags.filter((flag) => flag.customer_id === customer.id && flag.status === "open").length;
    const latestUsage = subscription ? latestUsageBySubscription.get(subscription.id) : null;
    const property = customer.properties?.[0];
    const attention = fairUseOpen
      ? "Fair-use follow-up"
      : openRequestCount > 2
        ? "High open volume"
        : customerRequests.some((request) => request.category === "quote")
          ? "Quote opportunity"
          : "Healthy";

    return {
      id: customer.id,
      name: customer.users?.full_name ?? "Unknown customer",
      email: customer.users?.email ?? "No email",
      propertyLabel: property ? `${property.address_line_1}, ${property.city}` : customer.household_type ?? "Property pending",
      planName: subscription?.membership_plans?.name ?? "No plan",
      billingCycle: subscription?.billing_cycle ?? "n/a",
      status: subscription?.status ?? "inactive",
      requestCount: customerRequests.length,
      openRequestCount,
      lastRequestAt: customerRequests[0]?.created_at ?? null,
      attention,
      revenueLabel: subscription
        ? subscription.billing_cycle === "annual"
          ? `$${Number(subscription.membership_plans?.annual_price ?? 0).toFixed(0)}/yr`
          : `$${Number(subscription.membership_plans?.monthly_price ?? 0).toFixed(0)}/mo`
        : "No subscription",
      visitsLabel: latestUsage
        ? `${latestUsage.visits_used} visits • ${latestUsage.labor_minutes_used} min`
        : "No usage yet",
      fairUseOpen,
    };
  });
}

function getDemoSnapshot(): AdminOpsSnapshot {
  const demoRequests = serviceRequests.map((request) => ({
    id: request.id,
    title: request.title,
    area: request.area,
    status: request.status,
    category: request.category,
    preferredWindow: request.preferredWindow,
    customerName: getUser(request.customerId)?.name ?? "Unknown customer",
    planName: getPlan(request.planId)?.name ?? "No plan",
    notes: request.notes,
    address: getProperty(request.propertyId)?.address ?? "Address pending",
    scheduledFor: request.scheduledFor ?? null,
    createdAt: request.createdAt,
    assignedTechnicianName: request.assignedTechnicianId ? getUser(request.assignedTechnicianId)?.name ?? null : null,
    fairUseOpen: Boolean(request.fairUseFlag),
  }));

  return {
    source: "demo",
    metrics: {
      activeMembers: subscriptions.filter((subscription) => subscription.status === "active").length,
      mrr: subscriptions.reduce((sum, subscription) => {
        const plan = plans.find((entry) => entry.id === subscription.planId);
        if (!plan) {
          return sum;
        }
        return sum + (subscription.billingCycle === "annual" ? plan.annualPrice / 12 : plan.monthlyPrice);
      }, 0),
      coveredRequests: serviceRequests.filter((request) => request.category === "covered").length,
      outstandingRevenue: billingRecords.filter((record) => record.status === "upcoming").reduce((sum, record) => sum + record.amount, 0),
      quoteOpportunities: quotes.length,
      averageLaborMinutes: Math.round(serviceRequests.reduce((sum, request) => sum + request.estimatedMinutes, 0) / serviceRequests.length),
      fairUseCount: fairUseFlags.filter((flag) => flag.status === "open").length,
      growthSeries: [
        { month: "Oct", members: 12 },
        { month: "Nov", members: 19 },
        { month: "Dec", members: 27 },
        { month: "Jan", members: 34 },
        { month: "Feb", members: 41 },
        { month: "Mar", members: 48 },
      ],
    },
    queueSummary: buildQueueSummary(
      demoRequests.map((request) => ({
        status: request.status,
        category: request.category,
        scheduledFor: request.scheduledFor,
        assigned: Boolean(request.assignedTechnicianName),
        fairUseOpen: request.fairUseOpen,
      })),
    ),
    requests: demoRequests,
    technicians: users
      .filter((user) => user.role === "technician")
      .map((user) => ({
        id: user.id,
        name: user.name,
        region: user.location,
      })),
    fairUse: fairUseFlags.map((flag) => ({
      id: flag.id,
      reason: flag.reason,
      severity: flag.severity,
      status: flag.status,
    })),
    quotes: quotes.map((quote) => ({
      id: quote.id,
      title: quote.title,
      amount: quote.amount,
      status: quote.status,
    })),
    customers: subscriptions.map((subscription) => {
      const customer = getUser(subscription.customerId);
      const property = getProperty(properties.find((entry) => entry.customerId === subscription.customerId)?.id ?? "");
      const plan = getPlan(subscription.planId);
      const customerRequests = serviceRequests.filter((request) => request.customerId === subscription.customerId);
      const fairUseOpen = fairUseFlags.filter((flag) => flag.customerId === subscription.customerId && flag.status === "open").length;

      return {
        id: subscription.customerId,
        name: customer?.name ?? "Unknown customer",
        email: customer?.email ?? "No email",
        propertyLabel: property ? `${property.address}, ${property.city}` : "Property pending",
        planName: plan?.name ?? "No plan",
        billingCycle: subscription.billingCycle,
        status: subscription.status,
        requestCount: customerRequests.length,
        openRequestCount: customerRequests.filter((request) => !["completed", "declined", "cancelled"].includes(request.status)).length,
        lastRequestAt: customerRequests[0]?.createdAt ?? null,
        attention: fairUseOpen ? "Fair-use follow-up" : customerRequests.some((request) => request.category === "quote") ? "Quote opportunity" : "Healthy",
        revenueLabel: subscription.billingCycle === "annual" ? `$${plan?.annualPrice.toFixed(0) ?? 0}/yr` : `$${plan?.monthlyPrice.toFixed(0) ?? 0}/mo`,
        visitsLabel: `${subscription.visitsUsed} visits • $${subscription.materialsUsed} materials`,
        fairUseOpen,
      };
    }),
  };
}
