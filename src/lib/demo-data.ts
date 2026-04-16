import {
  BillingRecord,
  FairUseFlag,
  KPI,
  Notification,
  Plan,
  Property,
  Quote,
  ServiceRequest,
  Subscription,
  TechnicianAssignment,
  User,
} from "@/lib/types";

export const plans: Plan[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "For lighter home upkeep and peace of mind.",
    monthlyPrice: 24.99,
    annualPrice: 249.99,
    includedVisits: 2,
    maxRelatedTasks: 3,
    maxLaborMinutes: 90,
    materialsAllowance: 0,
    priority: "Standard",
    outOfScopeDiscount: 5,
    active: true,
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "The core Fixpass plan for active households.",
    monthlyPrice: 49.99,
    annualPrice: 499.99,
    includedVisits: 5,
    maxRelatedTasks: 3,
    maxLaborMinutes: 90,
    materialsAllowance: 0,
    priority: "Priority",
    outOfScopeDiscount: 10,
    active: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Highest priority support with fair-use guardrails.",
    monthlyPrice: 99.99,
    annualPrice: 999.99,
    includedVisits: "Unlimited",
    maxRelatedTasks: 3,
    maxLaborMinutes: 90,
    materialsAllowance: 40,
    priority: "Fastest",
    outOfScopeDiscount: 15,
    fairUseNotes:
      "Unlimited covered visits does not include unlimited labor, project size, materials, turnover work, or excluded root-cause repeat requests.",
    active: true,
  },
];

export const users: User[] = [
  {
    id: "cust_1",
    name: "Maya Thompson",
    email: "maya@fixpass.demo",
    phone: "(713) 555-0148",
    role: "customer",
    avatar: "MT",
    location: "Katy, TX",
  },
  {
    id: "cust_2",
    name: "Daniel Ortiz",
    email: "daniel@fixpass.demo",
    phone: "(281) 555-0184",
    role: "customer",
    avatar: "DO",
    location: "Cinco Ranch, TX",
  },
  {
    id: "tech_1",
    name: "Marcus Reed",
    email: "marcus@fixpass.demo",
    phone: "(713) 555-0102",
    role: "technician",
    avatar: "MR",
    location: "West Houston Route",
  },
  {
    id: "tech_2",
    name: "Chris Alvarez",
    email: "chris@fixpass.demo",
    phone: "(713) 555-0119",
    role: "technician",
    avatar: "CA",
    location: "Katy Core Route",
  },
  {
    id: "admin_1",
    name: "Elena Brooks",
    email: "ops@fixpass.demo",
    phone: "(713) 555-0100",
    role: "admin",
    avatar: "EB",
    location: "Operations HQ",
  },
];

export const properties: Property[] = [
  {
    id: "prop_1",
    customerId: "cust_1",
    nickname: "Family Home",
    address: "2714 Mason Bend Drive",
    city: "Katy",
    state: "TX",
    zip: "77450",
    accessNotes: "Gate code 4419. Please text on arrival.",
    homeType: "Single-family",
  },
  {
    id: "prop_2",
    customerId: "cust_2",
    nickname: "Townhome",
    address: "5207 Avalon Landing Lane",
    city: "Katy",
    state: "TX",
    zip: "77494",
    accessNotes: "Garage access. Small dog inside.",
    homeType: "Townhome",
  },
];

export const subscriptions: Subscription[] = [
  {
    id: "sub_1",
    customerId: "cust_1",
    planId: "gold",
    status: "active",
    billingCycle: "monthly",
    renewalDate: "2026-03-29",
    visitsUsed: 3,
    visitsRemaining: 2,
    materialsUsed: 0,
  },
  {
    id: "sub_2",
    customerId: "cust_2",
    planId: "platinum",
    status: "active",
    billingCycle: "annual",
    renewalDate: "2026-10-03",
    visitsUsed: 7,
    visitsRemaining: "Unlimited",
    materialsUsed: 24,
  },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "req_101",
    customerId: "cust_1",
    propertyId: "prop_1",
    planId: "gold",
    title: "Nursery wall patch and shelf reset",
    description:
      "Patch two small anchor holes, touch up paint, and rehang one floating shelf in the nursery.",
    status: "scheduled",
    category: "covered",
    preferredWindow: "Mar 14, 9:00 AM to 12:00 PM",
    createdAt: "2026-03-11T09:30:00Z",
    scheduledFor: "2026-03-14T10:00:00Z",
    laborCapMinutes: 90,
    estimatedMinutes: 75,
    taskCount: 3,
    area: "Nursery",
    notes: "Customer will be home. Paint is already on site.",
    photos: ["/repair-photo-1.svg", "/repair-photo-2.svg"],
    assignedTechnicianId: "tech_2",
  },
  {
    id: "req_102",
    customerId: "cust_1",
    propertyId: "prop_1",
    planId: "gold",
    title: "Bathroom caulk refresh",
    description: "Touch up failed caulk line behind guest vanity and along one tub edge.",
    status: "completed",
    category: "covered",
    preferredWindow: "Completed Mar 3",
    createdAt: "2026-03-01T16:40:00Z",
    scheduledFor: "2026-03-03T15:00:00Z",
    laborCapMinutes: 90,
    estimatedMinutes: 60,
    taskCount: 2,
    area: "Guest bath",
    notes: "Resolved same visit. No material charge.",
    photos: ["/repair-photo-3.svg"],
    assignedTechnicianId: "tech_1",
  },
  {
    id: "req_201",
    customerId: "cust_2",
    propertyId: "prop_2",
    planId: "platinum",
    title: "Exterior trim touch-up and loose shutter",
    description:
      "One loose shutter and minor trim touch-up visible from the driveway. Request reviewed for safe ladder height.",
    status: "under review",
    category: "quote",
    preferredWindow: "Mar 15, afternoon",
    createdAt: "2026-03-12T13:15:00Z",
    laborCapMinutes: 90,
    estimatedMinutes: 120,
    taskCount: 2,
    area: "Front elevation",
    notes: "May require separate quote if height exceeds safe service policy.",
    photos: ["/repair-photo-4.svg"],
    fairUseFlag: true,
  },
  {
    id: "req_301",
    customerId: "cust_2",
    propertyId: "prop_2",
    planId: "platinum",
    title: "Loose cabinet pulls and closet door drag",
    description: "Reset four cabinet pulls and adjust one dragging closet door upstairs.",
    status: "technician assigned",
    category: "covered",
    preferredWindow: "Mar 13, 1:00 PM to 4:00 PM",
    createdAt: "2026-03-10T08:00:00Z",
    scheduledFor: "2026-03-13T14:00:00Z",
    laborCapMinutes: 90,
    estimatedMinutes: 55,
    taskCount: 3,
    area: "Kitchen + upstairs hall",
    notes: "Customer prefers text before entry.",
    photos: [],
    assignedTechnicianId: "tech_1",
  },
];

export const assignments: TechnicianAssignment[] = [
  {
    id: "asg_1",
    requestId: "req_101",
    technicianId: "tech_2",
    status: "assigned",
    routeOrder: 2,
  },
  {
    id: "asg_2",
    requestId: "req_301",
    technicianId: "tech_1",
    status: "assigned",
    routeOrder: 1,
  },
];

export const quotes: Quote[] = [
  {
    id: "quote_1",
    requestId: "req_201",
    customerId: "cust_2",
    status: "draft",
    title: "Exterior ladder-height trim repair",
    amount: 185,
    discountPercent: 15,
    scope:
      "Re-secure one shutter, prep and touch up front trim, and perform a safe access review. Priced separately due to exterior height and time.",
    createdAt: "2026-03-12T15:10:00Z",
  },
];

export const notifications: Notification[] = [
  {
    id: "note_1",
    userId: "cust_1",
    title: "Visit confirmed",
    body: "Marcus will arrive Friday between 10:00 AM and 12:00 PM for your nursery request.",
    read: false,
    createdAt: "2026-03-12T16:00:00Z",
  },
  {
    id: "note_2",
    userId: "tech_1",
    title: "Route updated",
    body: "Your 2:00 PM visit includes cabinet pull hardware already staged by the customer.",
    read: true,
    createdAt: "2026-03-12T18:40:00Z",
  },
];

export const billingRecords: BillingRecord[] = [
  {
    id: "bill_1",
    customerId: "cust_1",
    planId: "gold",
    amount: 49.99,
    status: "paid",
    date: "2026-02-28",
    method: "Visa •••• 4242",
  },
  {
    id: "bill_2",
    customerId: "cust_1",
    planId: "gold",
    amount: 49.99,
    status: "upcoming",
    date: "2026-03-29",
    method: "Visa •••• 4242",
  },
  {
    id: "bill_3",
    customerId: "cust_2",
    planId: "platinum",
    amount: 999.99,
    status: "paid",
    date: "2025-10-03",
    method: "Amex •••• 1808",
  },
];

export const fairUseFlags: FairUseFlag[] = [
  {
    id: "flag_1",
    customerId: "cust_2",
    requestId: "req_201",
    reason: "Exterior request may exceed safe ladder height and standard labor window.",
    severity: "medium",
    status: "open",
  },
];

export const adminKpis: KPI[] = [
  { label: "Active Members", value: "128", change: "+14% MoM", tone: "positive" },
  { label: "MRR", value: "$7,482", change: "+9.3% vs last month", tone: "positive" },
  { label: "Requests This Week", value: "43", change: "8 pending review", tone: "neutral" },
  { label: "Quote Opportunities", value: "$3,140", change: "11 open drafts", tone: "alert" },
];

export const growthSeries = [
  { month: "Oct", members: 42, revenue: 2190 },
  { month: "Nov", members: 59, revenue: 2985 },
  { month: "Dec", members: 74, revenue: 3910 },
  { month: "Jan", members: 92, revenue: 5145 },
  { month: "Feb", members: 111, revenue: 6420 },
  { month: "Mar", members: 128, revenue: 7482 },
];

export const coveredServices = [
  "Adjust sticking interior doors",
  "Patch small drywall holes and anchor marks",
  "Touch up caulking in kitchens and bathrooms",
  "Hang shelves, mirrors, curtain rods, and wall decor",
  "Assemble small furniture and household items",
  "Replace cabinet hardware and drawer pulls",
  "Minor paint touch-ups in one area",
  "Install blinds or simple window coverings",
  "Low-risk exterior touch-up tasks",
];

export const excludedServices = [
  "Electrical work",
  "Plumbing beyond very minor non-invasive adjustments",
  "Roofing, gas, HVAC, foundation, and structural work",
  "Water damage remediation and mold removal",
  "Hazardous work or unsafe exterior ladder work",
  "Licensed-trade jobs and oversized projects",
  "Commercial workloads unless separately approved",
];

export const defaultRules = [
  "One registered property per membership",
  "All requests receive a response within 24 hours",
  "Covered visits target scheduling within 1 to 3 business days",
  "Higher plans may receive faster scheduling priority",
  "Excluded work may be quoted separately or declined",
  "Fair-use review can be triggered for excessive volume or repeat excluded root causes",
];

export function getUser(id: string) {
  return users.find((user) => user.id === id);
}

export function getPlan(id: string) {
  return plans.find((plan) => plan.id === id);
}

export function getProperty(id: string) {
  return properties.find((property) => property.id === id);
}
