export type Plan = {
  name: "Silver" | "Gold" | "Platinum";
  price: string;
  subtitle: string;
  fixes: string;
  featured?: boolean;
  perks: string[];
};

export const plans: Plan[] = [
  {
    name: "Silver",
    price: "$24.99",
    subtitle: "For quick monthly upkeep",
    fixes: "2 fixes per month",
    perks: [
      "Two on-demand fix requests each month",
      "48-hour priority scheduling",
      "Skilled vetted handymen",
      "Live request tracking",
    ],
  },
  {
    name: "Gold",
    price: "$49.99",
    subtitle: "Best for active households",
    fixes: "5 fixes per month",
    featured: true,
    perks: [
      "Five fixes per month",
      "Faster scheduling windows",
      "Dedicated support line",
      "Household maintenance reminders",
    ],
  },
  {
    name: "Platinum",
    price: "$99.99",
    subtitle: "Maximum peace of mind",
    fixes: "Unlimited fixes per month",
    perks: [
      "Unlimited small fixes",
      "Materials coverage up to $40/month",
      "Top-priority dispatch",
      "VIP support and annual home check-in",
    ],
  },
];

export const fixExamples = [
  "Tightening loose hinges and handles",
  "Patching small drywall holes",
  "Replacing light fixtures and hardware",
  "Mounting shelves and TVs",
  "Minor interior home repairs",
  "Door alignment and simple weatherproofing",
];

export const faqs = [
  {
    q: "What counts as a fix?",
    a: "A fix is a small-to-medium handyman task that can be handled in a standard visit, like fixture swaps, wall patching, mounting, and minor repairs.",
  },
  {
    q: "Are materials included?",
    a: "Platinum includes materials coverage up to $40 per month. Silver and Gold can include materials as an add-on or reimbursable expense.",
  },
  {
    q: "How fast can someone come?",
    a: "Most requests are scheduled within 24-48 hours based on plan tier and local availability.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Fixpass is month-to-month. You can cancel anytime before your next billing cycle.",
  },
  {
    q: "What if I need a bigger project?",
    a: "For remodels or large-scale work, we can provide a partner referral and estimate guidance. These projects are outside subscription scope.",
  },
];

export const testimonials = [
  {
    quote:
      "Fixpass saved me hours every month. I stopped chasing random contractors and finally have reliable help on demand.",
    name: "Alicia R.",
    role: "Homeowner, Houston",
  },
  {
    quote:
      "As a landlord, predictable monthly maintenance is a game changer. Response times are fast and communication is excellent.",
    name: "Marcus T.",
    role: "Property Owner",
  },
  {
    quote:
      "It feels like having a trusted handyman team in my back pocket. Super smooth experience.",
    name: "Janelle K.",
    role: "Busy Professional",
  },
];
