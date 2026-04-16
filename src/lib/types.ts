export type Role = "customer" | "technician" | "admin";

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  includedVisits: number | "Unlimited";
  maxRelatedTasks: number;
  maxLaborMinutes: number;
  materialsAllowance: number;
  priority: "Standard" | "Priority" | "Fastest";
  outOfScopeDiscount: number;
  fairUseNotes?: string;
  active: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  location: string;
};

export type Property = {
  id: string;
  customerId: string;
  nickname: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  accessNotes: string;
  homeType: string;
};

export type Subscription = {
  id: string;
  customerId: string;
  planId: string;
  status: "active" | "paused" | "cancelled";
  billingCycle: "monthly" | "annual";
  renewalDate: string;
  visitsUsed: number;
  visitsRemaining: number | "Unlimited";
  materialsUsed: number;
};

export type ServiceStatus =
  | "pending"
  | "under review"
  | "scheduled"
  | "technician assigned"
  | "in progress"
  | "completed"
  | "quoted separately"
  | "declined"
  | "cancelled";

export type ServiceRequest = {
  id: string;
  customerId: string;
  propertyId: string;
  planId: string;
  title: string;
  description: string;
  status: ServiceStatus;
  category: "covered" | "quote" | "excluded";
  preferredWindow: string;
  createdAt: string;
  scheduledFor?: string;
  laborCapMinutes: number;
  estimatedMinutes: number;
  taskCount: number;
  area: string;
  notes: string;
  photos: string[];
  assignedTechnicianId?: string;
  fairUseFlag?: boolean;
};

export type TechnicianAssignment = {
  id: string;
  requestId: string;
  technicianId: string;
  status: "assigned" | "checked_in" | "complete";
  checkInAt?: string;
  checkOutAt?: string;
  routeOrder: number;
};

export type Quote = {
  id: string;
  requestId: string;
  customerId: string;
  status: "draft" | "sent" | "approved" | "declined";
  title: string;
  amount: number;
  discountPercent: number;
  scope: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type BillingRecord = {
  id: string;
  customerId: string;
  planId: string;
  amount: number;
  status: "paid" | "upcoming" | "failed";
  date: string;
  method: string;
};

export type FairUseFlag = {
  id: string;
  customerId: string;
  requestId: string;
  reason: string;
  severity: "low" | "medium" | "high";
  status: "open" | "reviewed" | "resolved";
};

export type KPI = {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "neutral" | "alert";
};
