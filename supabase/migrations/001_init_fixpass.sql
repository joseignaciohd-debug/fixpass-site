create extension if not exists "pgcrypto";

create type public.app_role as enum ('customer', 'technician', 'admin');
create type public.subscription_status as enum ('active', 'paused', 'cancelled');
create type public.billing_cycle as enum ('monthly', 'annual');
create type public.request_status as enum (
  'pending',
  'under review',
  'scheduled',
  'technician assigned',
  'in progress',
  'completed',
  'quoted separately',
  'declined',
  'cancelled'
);
create type public.quote_status as enum ('draft', 'sent', 'approved', 'declined');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  role public.app_role not null,
  full_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  household_type text,
  service_notes text,
  created_at timestamptz not null default now()
);

create table public.technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  service_region text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  team text,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  nickname text not null,
  address_line_1 text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  home_type text,
  access_notes text,
  created_at timestamptz not null default now()
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  monthly_price numeric(10,2) not null,
  annual_price numeric(10,2),
  included_visits integer,
  unlimited_visits boolean not null default false,
  max_related_tasks integer not null default 3,
  max_labor_minutes integer not null default 90,
  materials_allowance numeric(10,2) not null default 0,
  scheduling_priority integer not null default 1,
  out_of_scope_discount_percent integer not null default 0,
  fair_use_notes text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete restrict,
  membership_plan_id uuid not null references public.membership_plans(id) on delete restrict,
  status public.subscription_status not null default 'active',
  billing_cycle public.billing_cycle not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  unique (property_id)
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete restrict,
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  title text not null,
  description text not null,
  request_status public.request_status not null default 'pending',
  preferred_window text,
  area text,
  estimated_minutes integer,
  task_count integer default 1,
  coverage_decision text,
  category text,
  internal_notes text,
  created_at timestamptz not null default now(),
  scheduled_for timestamptz
);

create table public.service_request_photos (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  storage_path text not null,
  photo_kind text not null default 'issue',
  created_at timestamptz not null default now()
);

create table public.technician_assignments (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  technician_id uuid not null references public.technicians(id) on delete restrict,
  assignment_status text not null default 'assigned',
  route_order integer,
  check_in_at timestamptz,
  check_out_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  status public.quote_status not null default 'draft',
  title text not null,
  scope text not null,
  amount numeric(10,2) not null,
  discount_percent integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references public.users(id) on delete cascade,
  service_request_id uuid references public.service_requests(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  body text not null,
  visibility text not null default 'internal',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.billing_records (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null,
  method text,
  billed_at timestamptz not null default now(),
  stripe_invoice_id text
);

create table public.plan_usage (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  usage_month date not null,
  visits_used integer not null default 0,
  labor_minutes_used integer not null default 0,
  materials_used numeric(10,2) not null default 0,
  fair_use_review_required boolean not null default false,
  created_at timestamptz not null default now(),
  unique (subscription_id, usage_month)
);

create table public.fair_use_flags (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  service_request_id uuid references public.service_requests(id) on delete cascade,
  severity text not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  created_at timestamptz not null default now()
);
