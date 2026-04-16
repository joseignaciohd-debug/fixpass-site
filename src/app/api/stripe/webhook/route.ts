import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/server";
import { createSupabaseServerClient } from "@/lib/integrations/supabase/server";
import { stripePriceMap } from "@/lib/integrations/stripe/config";

export async function POST(request: Request) {
  const stripe = getStripeServerClient();
  const supabase = createSupabaseServerClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !supabase || !webhookSecret) {
    return NextResponse.json({ received: false, error: "Missing Stripe or Supabase webhook configuration." }, { status: 500 });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ received: false, error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { received: false, error: error instanceof Error ? error.message : "Unable to verify webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoiceUpdated(supabase, event.data.object as Stripe.Invoice);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { received: false, error: error instanceof Error ? error.message : "Webhook processing failed." },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>, session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") {
    return;
  }

  const customerId = typeof session.metadata?.customer_id === "string" ? session.metadata.customer_id : null;
  const planCode = typeof session.metadata?.plan_code === "string" ? session.metadata.plan_code : null;
  const billingCycle = session.metadata?.billing_cycle === "annual" ? "annual" : "monthly";

  if (!customerId || !planCode) {
    return;
  }

  const { data: customerSubscriptions } = await supabase
    .from("subscriptions")
    .select("id,property_id")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1);

  const currentSubscription = customerSubscriptions?.[0];
  if (!currentSubscription) {
    return;
  }

  const { data: plan } = await supabase.from("membership_plans").select("id").eq("code", planCode).maybeSingle();
  if (!plan?.id) {
    return;
  }

  await supabase
    .from("subscriptions")
    .update({
      membership_plan_id: plan.id,
      billing_cycle: billingCycle,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      status: "active",
    })
    .eq("id", currentSubscription.id);
}

async function handleSubscriptionUpdated(supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>, subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;
  const priceId = subscription.items.data[0]?.price?.id;
  const planMatch = matchPlanCode(priceId);

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, membership_plan_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (!existingSubscription?.id) {
    return;
  }

  const updatePayload: Record<string, string | boolean | null> = {
    stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : null,
    stripe_subscription_id: stripeSubscriptionId,
    billing_cycle: subscription.items.data[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly",
    status: subscription.status === "active" ? "active" : subscription.cancel_at_period_end ? "paused" : "cancelled",
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  };

  if (planMatch) {
    const { data: plan } = await supabase.from("membership_plans").select("id").eq("code", planMatch).maybeSingle();
    if (plan?.id) {
      updatePayload.membership_plan_id = plan.id;
    }
  }

  await supabase.from("subscriptions").update(updatePayload).eq("id", existingSubscription.id);
}

async function handleInvoiceUpdated(supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>, invoice: Stripe.Invoice) {
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subscriptionId) {
    return;
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (!subscription?.id) {
    return;
  }

  const amount = (invoice.amount_due ?? invoice.amount_paid ?? 0) / 100;

  const { data: existingRecord } = await supabase
    .from("billing_records")
    .select("id")
    .eq("stripe_invoice_id", invoice.id)
    .maybeSingle();

  const payload = {
    subscription_id: subscription.id,
    amount,
    status: invoice.status === "paid" ? "paid" : invoice.status === "open" ? "upcoming" : "failed",
    method: invoice.collection_method ?? "card",
    billed_at: new Date((invoice.status_transitions.paid_at ?? invoice.created) * 1000).toISOString(),
    stripe_invoice_id: invoice.id,
  };

  if (existingRecord?.id) {
    await supabase.from("billing_records").update(payload).eq("id", existingRecord.id);
  } else {
    await supabase.from("billing_records").insert(payload);
  }
}

function matchPlanCode(priceId?: string | null) {
  if (!priceId) {
    return null;
  }

  for (const [planCode, cycles] of Object.entries(stripePriceMap)) {
    if (cycles.monthly === priceId || cycles.annual === priceId) {
      return planCode;
    }
  }

  return null;
}
