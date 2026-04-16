import { Role } from "@/lib/types";

export const publicRoutes = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/plans", label: "Plans" },
  { href: "/coverage", label: "Coverage" },
  { href: "/faq", label: "FAQ" },
  { href: "/join", label: "Join" },
];

export const portalNavigation: Record<Role, Array<{ href: string; label: string }>> = {
  customer: [
    { href: "/customer", label: "Home" },
    { href: "/customer/requests", label: "Requests" },
    { href: "/customer/plan", label: "Plan" },
    { href: "/customer/inbox", label: "Inbox" },
    { href: "/customer/profile", label: "Profile" },
  ],
  technician: [
    { href: "/technician", label: "Today" },
    { href: "/technician/jobs/req_301", label: "Job detail" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/requests", label: "Requests" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/schedule", label: "Schedule" },
    { href: "/admin/quotes", label: "Quotes" },
    { href: "/admin/plans", label: "Plans" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/settings", label: "Settings" },
  ],
};
