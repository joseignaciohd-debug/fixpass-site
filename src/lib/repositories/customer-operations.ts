import { billingRecords, fairUseFlags, notifications, properties, serviceRequests, subscriptions, users } from "@/lib/demo-data";
import { getPlan, plans } from "@/lib/demo-data";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";
import { getMembershipSnapshot } from "@/lib/domain/membership";
import { getCoverageSummary, getPropertyByCustomer, getRequestsByCustomer } from "@/lib/domain/service-requests";

type PortalRequest = {
  id: string;
  title: string;
  description: string;
  status: string;
  area: string;
  preferredWindow: string;
  taskCount: number;
  createdAt: string;
  scheduledFor: string | null;
  coverageSummary: string;
  photos: string[];
};

type PortalNotification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type PortalBillingRecord = {
  id: string;
  amount: number;
  status: string;
  method: string;
  billedAt: string;
};

type PortalFlag = {
  id: string;
  reason: string;
  severity: string;
  status: string;
};

type PortalPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number | null;
  maxRelatedTasks: number;
  maxLaborMinutes: number;
  materialsAllowance: number;
  outOfScopeDiscountPercent: number;
  fairUseNotes: string | null;
};

type PortalSubscription = {
  id: string;
  customerId: string;
  status: string;
  billingCycle: "monthly" | "annual";
  renewalDate: string;
  visitsUsed: number;
  visitsRemaining: number | "Unlimited";
  materialsUsed: number;
  stripeCustomerId: string | null;
};

type PortalProperty = {
  id: string;
  nickname: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  homeType: string;
  accessNotes: string;
};

type PortalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CustomerPortalSnapshot = {
  source: "live" | "demo";
  user: PortalUser;
  customerId: string;
  subscription: PortalSubscription;
  property: PortalProperty;
  plan: PortalPlan;
  requests: PortalRequest[];
  notifications: PortalNotification[];
  billing: PortalBillingRecord[];
  fairUseFlags: PortalFlag[];
  usagePercent: number;
  materialsRemaining: number;
};

type CustomerLookup = {
  userId: string;
  email: string;
  customerId: string;
  propertyId: string;
  subscriptionId: string;
  stripeCustomerId: string | null;
};

type LiveCustomerRow = {
  id: string;
  household_type: string | null;
  users:
    | Array<{
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
      }>
    | {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
      }
    | null;
};

type LiveUserRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
};

type LiveAppUserRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
};

type LivePlanIdRow = {
  id: string;
};

function firstRelationRow<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

async function ensureLiveCustomerBootstrap(sessionUserId: string) {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data: appUser, error: appUserError } = await client
    .from("users")
    .select("id,full_name,email,phone")
    .eq("id", sessionUserId)
    .maybeSingle();

  if (appUserError || !appUser?.id) {
    return null;
  }

  const liveAppUser = appUser as LiveAppUserRow;

  const { data: existingCustomer } = await client.from("customers").select("id").eq("user_id", liveAppUser.id).maybeSingle();

  let customerId = existingCustomer?.id ?? null;

  if (!customerId) {
    const { data: insertedCustomer, error: customerInsertError } = await client
      .from("customers")
      .insert({
        user_id: liveAppUser.id,
        household_type: "Homeowner",
        service_notes: "Created from Fixpass web sign-in",
      })
      .select("id")
      .single();

    if (customerInsertError || !insertedCustomer?.id) {
      return null;
    }

    customerId = insertedCustomer.id;
  }

  const { data: existingProperty } = await client
    .from("properties")
    .select("id")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let propertyId = existingProperty?.id ?? null;

  if (!propertyId) {
    const { data: insertedProperty, error: propertyInsertError } = await client
      .from("properties")
      .insert({
        customer_id: customerId,
        nickname: "Primary Home",
        address_line_1: "Add your address",
        city: "Katy",
        state: "TX",
        postal_code: "77450",
        home_type: "Single-family",
        access_notes: "Update property details from Fixpass web settings",
      })
      .select("id")
      .single();

    if (propertyInsertError || !insertedProperty?.id) {
      return null;
    }

    propertyId = insertedProperty.id;
  }

  const { data: existingSubscription } = await client
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let subscriptionId = existingSubscription?.id ?? null;
  let stripeCustomerId = existingSubscription?.stripe_customer_id ?? null;

  if (!subscriptionId && propertyId) {
    const { data: defaultPlan } = await client.from("membership_plans").select("id").eq("code", "gold").maybeSingle();

    const plan = defaultPlan as LivePlanIdRow | null;
    if (!plan?.id) {
      return null;
    }

    const periodStart = new Date();
    const periodEnd = new Date(periodStart.getTime() + 1000 * 60 * 60 * 24 * 30);

    const { data: insertedSubscription, error: subscriptionInsertError } = await client
      .from("subscriptions")
      .insert({
        customer_id: customerId,
        property_id: propertyId,
        membership_plan_id: plan.id,
        status: "active",
        billing_cycle: "monthly",
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
      })
      .select("id, stripe_customer_id")
      .single();

    if (subscriptionInsertError || !insertedSubscription?.id) {
      return null;
    }

    subscriptionId = insertedSubscription.id;
    stripeCustomerId = insertedSubscription.stripe_customer_id ?? null;
  }

  if (!customerId || !propertyId || !subscriptionId) {
    return null;
  }

  return {
    userId: liveAppUser.id,
    email: liveAppUser.email,
    customerId,
    propertyId,
    subscriptionId,
    stripeCustomerId,
  } satisfies CustomerLookup;
}

type LivePropertyRow = {
  id: string;
  nickname: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  home_type: string | null;
  access_notes: string | null;
};

type LiveSubscriptionRow = {
  id: string;
  customer_id: string;
  status: "active" | "paused" | "cancelled";
  billing_cycle: "monthly" | "annual";
  current_period_end: string;
  stripe_customer_id: string | null;
  membership_plan_id: string;
  membership_plans: {
    id: string;
    name: string;
    monthly_price: number | string;
    annual_price: number | string | null;
    max_related_tasks: number;
    max_labor_minutes: number;
    materials_allowance: number | string;
    out_of_scope_discount_percent: number;
    fair_use_notes: string | null;
    included_visits: number | null;
    unlimited_visits: boolean;
  } | null;
};

type LiveUsageRow = {
  visits_used: number;
  labor_minutes_used: number;
  materials_used: number | string;
};

type LiveRequestRow = {
  id: string;
  title: string;
  description: string;
  request_status: string;
  area: string | null;
  preferred_window: string | null;
  task_count: number | null;
  created_at: string;
  scheduled_for: string | null;
  service_request_photos: Array<{ storage_path: string }> | null;
};

type LiveNotificationRow = {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

type LiveBillingRow = {
  id: string;
  amount: number | string;
  status: string;
  method: string | null;
  billed_at: string;
};

type LiveFlagRow = {
  id: string;
  reason: string;
  severity: string;
  status: string;
};

function numberValue(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function formatAddress(property: PortalProperty) {
  return `${property.addressLine1}, ${property.city}, ${property.state} ${property.postalCode}`;
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function buildDemoSnapshot(sessionUserId: string): CustomerPortalSnapshot | null {
  const user = users.find((entry) => entry.id === sessionUserId && entry.role === "customer");
  const membership = getMembershipSnapshot(sessionUserId);
  const property = getPropertyByCustomer(sessionUserId);

  if (!user || !membership || !property) {
    return null;
  }

  const requests = getRequestsByCustomer(sessionUserId);
  const bills = billingRecords.filter((entry) => entry.customerId === sessionUserId);
  const inbox = notifications.filter((entry) => entry.userId === sessionUserId);
  const flags = fairUseFlags.filter((entry) => entry.customerId === sessionUserId);

  return {
    source: "demo",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    customerId: sessionUserId,
    subscription: {
      id: membership.subscription.id,
      customerId: membership.subscription.customerId,
      status: membership.subscription.status,
      billingCycle: membership.subscription.billingCycle,
      renewalDate: membership.subscription.renewalDate,
      visitsUsed: membership.subscription.visitsUsed,
      visitsRemaining: membership.subscription.visitsRemaining,
      materialsUsed: membership.subscription.materialsUsed,
      stripeCustomerId: null,
    },
    property: {
      id: property.id,
      nickname: property.nickname,
      addressLine1: property.address,
      city: property.city,
      state: property.state,
      postalCode: property.zip,
      homeType: property.homeType,
      accessNotes: property.accessNotes,
    },
    plan: {
      id: membership.plan.id,
      name: membership.plan.name,
      monthlyPrice: membership.plan.monthlyPrice,
      annualPrice: membership.plan.annualPrice,
      maxRelatedTasks: membership.plan.maxRelatedTasks,
      maxLaborMinutes: membership.plan.maxLaborMinutes,
      materialsAllowance: membership.plan.materialsAllowance,
      outOfScopeDiscountPercent: membership.plan.outOfScopeDiscount,
      fairUseNotes: membership.plan.fairUseNotes ?? null,
    },
    requests: requests.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status,
      area: request.area,
      preferredWindow: request.preferredWindow,
      taskCount: request.taskCount,
      createdAt: request.createdAt,
      scheduledFor: request.scheduledFor ?? null,
      coverageSummary: getCoverageSummary(request),
      photos: request.photos,
    })),
    notifications: inbox.map((entry) => ({
      id: entry.id,
      title: entry.title,
      body: entry.body,
      isRead: entry.read,
      createdAt: entry.createdAt,
    })),
    billing: bills.map((entry) => ({
      id: entry.id,
      amount: entry.amount,
      status: entry.status,
      method: entry.method,
      billedAt: entry.date,
    })),
    fairUseFlags: flags.map((entry) => ({
      id: entry.id,
      reason: entry.reason,
      severity: entry.severity,
      status: entry.status,
    })),
    usagePercent: membership.usagePercent,
    materialsRemaining: membership.materialsRemaining,
  };
}

function buildUnavailableSnapshot(sessionUserId: string): CustomerPortalSnapshot | null {
  if (process.env.NODE_ENV === "production" && isSupabaseServerConfigured()) {
    return null;
  }

  return buildDemoSnapshot(sessionUserId);
}

async function getLiveCustomerLookup(sessionUserId: string) {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return null;
  }

  const { data: customerRow, error: customerError } = await client
    .from("customers")
    .select("id,users!inner(id,full_name,email,phone)")
    .eq("users.id", sessionUserId)
    .maybeSingle();

  const customerUser = firstRelationRow(customerRow?.users as LiveUserRow[] | LiveUserRow | null | undefined);

  if (customerError || !customerRow?.id || !customerUser?.id) {
    return ensureLiveCustomerBootstrap(sessionUserId);
  }

  const { data: propertyRow } = await client
    .from("properties")
    .select("id")
    .eq("customer_id", customerRow.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: subscriptionRow } = await client
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("customer_id", customerRow.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!propertyRow?.id || !subscriptionRow?.id) {
    return ensureLiveCustomerBootstrap(sessionUserId);
  }

  return {
    userId: customerUser.id,
    email: customerUser.email,
    customerId: customerRow.id,
    propertyId: propertyRow.id,
    subscriptionId: subscriptionRow.id,
    stripeCustomerId: subscriptionRow.stripe_customer_id ?? null,
  } satisfies CustomerLookup;
}

export async function getCustomerBillingLookup(sessionUserId: string) {
  return getLiveCustomerLookup(sessionUserId);
}

export async function getCustomerPortalSnapshot(sessionUserId: string) : Promise<CustomerPortalSnapshot | null> {
  if (!isSupabaseServerConfigured()) {
    return buildDemoSnapshot(sessionUserId);
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return buildUnavailableSnapshot(sessionUserId);
  }

  try {
    const lookup = await getLiveCustomerLookup(sessionUserId);
    if (!lookup) {
      return buildUnavailableSnapshot(sessionUserId);
    }

    const [customerResult, propertyResult, subscriptionResult, usageResult, requestsResult, notificationsResult, billingResult, flagsResult] =
      await Promise.all([
        client.from("customers").select("id,household_type,users(id,full_name,email,phone)").eq("id", lookup.customerId).maybeSingle(),
        client.from("properties").select("id,nickname,address_line_1,city,state,postal_code,home_type,access_notes").eq("id", lookup.propertyId).maybeSingle(),
        client
          .from("subscriptions")
          .select("id,customer_id,status,billing_cycle,current_period_end,stripe_customer_id,membership_plan_id,membership_plans(id,name,monthly_price,annual_price,max_related_tasks,max_labor_minutes,materials_allowance,out_of_scope_discount_percent,fair_use_notes,included_visits,unlimited_visits)")
          .eq("id", lookup.subscriptionId)
          .maybeSingle(),
        client.from("plan_usage").select("visits_used,labor_minutes_used,materials_used").eq("subscription_id", lookup.subscriptionId).order("usage_month", { ascending: false }).limit(1).maybeSingle(),
        client
          .from("service_requests")
          .select("id,title,description,request_status,area,preferred_window,task_count,created_at,scheduled_for,service_request_photos(storage_path)")
          .eq("customer_id", lookup.customerId)
          .order("created_at", { ascending: false }),
        client.from("notifications").select("id,title,body,is_read,created_at").eq("user_id", lookup.userId).order("created_at", { ascending: false }).limit(6),
        client.from("billing_records").select("id,amount,status,method,billed_at").eq("subscription_id", lookup.subscriptionId).order("billed_at", { ascending: false }),
        client.from("fair_use_flags").select("id,reason,severity,status").eq("customer_id", lookup.customerId).order("created_at", { ascending: false }),
      ]);

    if (
      customerResult.error ||
      propertyResult.error ||
      subscriptionResult.error ||
      requestsResult.error ||
      notificationsResult.error ||
      billingResult.error ||
      flagsResult.error ||
      !firstRelationRow(customerResult.data?.users as LiveUserRow[] | LiveUserRow | null | undefined) ||
      !propertyResult.data ||
      !subscriptionResult.data?.membership_plans
    ) {
      return buildUnavailableSnapshot(sessionUserId);
    }

    const customer = customerResult.data as unknown as LiveCustomerRow;
    const property = propertyResult.data as LivePropertyRow;
    const subscription = subscriptionResult.data as unknown as LiveSubscriptionRow;
    const usage = usageResult.data as LiveUsageRow | null;
    const requests = (requestsResult.data ?? []) as unknown as LiveRequestRow[];
    const inbox = (notificationsResult.data ?? []) as LiveNotificationRow[];
    const bills = (billingResult.data ?? []) as LiveBillingRow[];
    const flags = (flagsResult.data ?? []) as LiveFlagRow[];
    const plan = subscription.membership_plans!;
    const liveUser = firstRelationRow(customer.users);

    if (!liveUser) {
      return buildUnavailableSnapshot(sessionUserId);
    }

    const includedVisits = plan.unlimited_visits ? "Unlimited" : Number(plan.included_visits ?? 0);
    const usedVisits = usage?.visits_used ?? 0;
    const visitsRemaining = includedVisits === "Unlimited" ? "Unlimited" : Math.max(includedVisits - usedVisits, 0);
    const usagePercent =
      includedVisits === "Unlimited" ? Math.min(Math.round((numberValue(usage?.materials_used) / Math.max(numberValue(plan.materials_allowance), 1)) * 100), 100) : Math.min(Math.round((usedVisits / Math.max(includedVisits, 1)) * 100), 100);
    const materialsRemaining = Math.max(numberValue(plan.materials_allowance) - numberValue(usage?.materials_used), 0);

    return {
      source: "live",
      user: {
        id: liveUser.id,
        name: liveUser.full_name,
        email: liveUser.email,
        phone: liveUser.phone ?? "Phone pending",
      },
      customerId: customer.id,
      subscription: {
        id: subscription.id,
        customerId: subscription.customer_id,
        status: subscription.status,
        billingCycle: subscription.billing_cycle,
        renewalDate: formatDateLabel(subscription.current_period_end),
        visitsUsed: usedVisits,
        visitsRemaining,
        materialsUsed: numberValue(usage?.materials_used),
        stripeCustomerId: subscription.stripe_customer_id,
      },
      property: {
        id: property.id,
        nickname: property.nickname,
        addressLine1: property.address_line_1,
        city: property.city,
        state: property.state,
        postalCode: property.postal_code,
        homeType: property.home_type ?? "Home",
        accessNotes: property.access_notes ?? "No access notes on file.",
      },
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyPrice: numberValue(plan.monthly_price),
        annualPrice: plan.annual_price ? numberValue(plan.annual_price) : null,
        maxRelatedTasks: plan.max_related_tasks,
        maxLaborMinutes: plan.max_labor_minutes,
        materialsAllowance: numberValue(plan.materials_allowance),
        outOfScopeDiscountPercent: plan.out_of_scope_discount_percent,
        fairUseNotes: plan.fair_use_notes,
      },
      requests: requests.map((request) => ({
        id: request.id,
        title: request.title,
        description: request.description,
        status: request.request_status,
        area: request.area ?? "General",
        preferredWindow: request.preferred_window ?? "Needs scheduling",
        taskCount: request.task_count ?? 1,
        createdAt: request.created_at,
        scheduledFor: request.scheduled_for,
        coverageSummary: `${request.task_count ?? 1} related task${request.task_count === 1 ? "" : "s"} requested in ${request.area ?? "the home"}.`,
        photos: (request.service_request_photos ?? []).map((photo) => photo.storage_path),
      })),
      notifications: inbox.map((entry) => ({
        id: entry.id,
        title: entry.title,
        body: entry.body,
        isRead: entry.is_read,
        createdAt: entry.created_at,
      })),
      billing: bills.map((entry) => ({
        id: entry.id,
        amount: numberValue(entry.amount),
        status: entry.status,
        method: entry.method ?? "Card",
        billedAt: formatDateLabel(entry.billed_at),
      })),
      fairUseFlags: flags.map((entry) => ({
        id: entry.id,
        reason: entry.reason,
        severity: entry.severity,
        status: entry.status,
      })),
      usagePercent,
      materialsRemaining,
    };
  } catch {
    return buildUnavailableSnapshot(sessionUserId);
  }
}

export function getCustomerPlanGuardrails(planId: string) {
  const plan = plans.find((entry) => entry.id === planId) ?? getPlan(planId);
  if (!plan) {
    return [];
  }

  return [
    `Up to ${plan.maxRelatedTasks} related small tasks per covered visit.`,
    `${plan.maxLaborMinutes} minute labor cap on covered work.`,
    `$${plan.materialsAllowance} monthly materials allowance.`,
    `${plan.outOfScopeDiscount}% discount on out-of-scope quotes.`,
    plan.fairUseNotes ?? `${plan.name} requests remain subject to fair-use review and service exclusions.`,
  ];
}

export function getPropertyAddress(property: PortalProperty) {
  return formatAddress(property);
}
