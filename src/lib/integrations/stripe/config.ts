export const stripePriceMap = {
  silver: {
    monthly: process.env.STRIPE_PRICE_SILVER_MONTHLY,
    annual: process.env.STRIPE_PRICE_SILVER_ANNUAL,
  },
  gold: {
    monthly: process.env.STRIPE_PRICE_GOLD_MONTHLY,
    annual: process.env.STRIPE_PRICE_GOLD_ANNUAL,
  },
  platinum: {
    monthly: process.env.STRIPE_PRICE_PLATINUM_MONTHLY,
    annual: process.env.STRIPE_PRICE_PLATINUM_ANNUAL,
  },
};
