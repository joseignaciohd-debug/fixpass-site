import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/server";
import { getDemoSession } from "@/lib/auth";
import { getCustomerBillingLookup } from "@/lib/repositories/customer-operations";

export async function POST(request: Request) {
  const stripe = getStripeServerClient();
  const authSession = await getDemoSession();
  const lookup = authSession ? await getCustomerBillingLookup(authSession.userId) : null;

  if (!stripe || !lookup?.stripeCustomerId) {
    return NextResponse.json(
      {
        error: "Billing portal is not available until Stripe customer records are linked.",
      },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: lookup.stripeCustomerId,
    return_url: `${url.origin}/customer/billing`,
  });

  return NextResponse.redirect(portalSession.url, { status: 303 });
}
