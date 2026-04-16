import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });

  return stripeClient;
}
