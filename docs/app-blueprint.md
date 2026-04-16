# Fixpass App Blueprint

## 1. Full app architecture

- `presentation layer`
  Public marketing site, customer portal, technician portal, and admin operations dashboard in Next.js App Router.
- `application layer`
  Route-specific loaders, role guards, request orchestration, plan usage logic, fair-use review, quote handling, and billing state presentation.
- `domain layer`
  Membership plans, subscriptions, properties, service requests, assignments, quotes, billing records, notifications, analytics, and settings.
- `integration layer`
  Supabase auth/database/storage, Stripe billing/webhooks, email/SMS notifications, and analytics views.
- `deployment layer`
  Vercel-hosted Next.js app with Supabase backend, Stripe billing, environment-separated config, and server-side route handlers.

## 2. Proposed folder structure

```text
src/
  app/
    (portals)/
      admin/
      customer/
      technician/
    api/
      demo-login/
      demo-logout/
      stripe/
      waitlist/
    coverage/
    faq/
    how-it-works/
    join/
    plans/
    sign-in/
  components/
    layout/
    ui/
  lib/
    auth.ts
    demo-data.ts
    types.ts
    config/
      navigation.ts
    domain/
      analytics.ts
      membership.ts
      service-requests.ts
    integrations/
      stripe/
      supabase/
    validations/
      service-request.ts
supabase/
  migrations/
  seed.sql
docs/
  app-blueprint.md
  architecture.md
```

## 3. Proposed database schema

- `users`
- `customers`
- `technicians`
- `admins`
- `properties`
- `membership_plans`
- `subscriptions`
- `service_requests`
- `service_request_photos`
- `technician_assignments`
- `quotes`
- `notes`
- `notifications`
- `billing_records`
- `plan_usage`
- `fair_use_flags`
- `settings`

Reference implementation: [`supabase/migrations/001_init_fixpass.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql)

## 4. Proposed route map

### Public

- `/`
- `/how-it-works`
- `/plans`
- `/coverage`
- `/faq`
- `/join`
- `/sign-in`

### Customer

- `/customer`
- `/customer/requests`
- `/customer/membership`
- `/customer/property`
- `/customer/billing`

### Technician

- `/technician`
- `/technician/jobs/[id]`

### Admin

- `/admin`
- `/admin/requests`
- `/admin/schedule`
- `/admin/quotes`
- `/admin/plans`
- `/admin/analytics`
- `/admin/settings`

### API / integrations

- `/api/demo-login`
- `/api/demo-logout`
- `/api/waitlist`
- `/api/stripe/webhook`

## 5. Proposed design system

- `brand`
  Premium navy core, off-white surfaces, refined grays, restrained blue accents.
- `typography`
  Plus Jakarta Sans for display hierarchy, Inter for dense operational reading.
- `surfaces`
  Rounded 20px to 32px cards, soft shadows, minimal borders, subtle glass or gradient treatment only where it improves emphasis.
- `components`
  Primary/secondary buttons, cards, badges, metric cards, status pills, progress meters, portal shell.
- `principles`
  Calm, premium, legible, mobile-first, operator-friendly, no construction-theme clichés.

## 6. MVP boundaries

### Fully implemented in this MVP

- Premium public marketing site
- Demo sign-in and role-protected portal routing
- Customer, technician, and admin product surfaces
- Seeded membership plans, requests, quotes, billing records, and analytics
- Plan usage presentation and fair-use review surfacing
- Quote and schedule views
- Supabase schema and seed scripts
- Stripe-ready webhook and billing environment contract

### Scaffolded for production

- Real Supabase authentication and row-level security
- Real Stripe checkout, subscriptions, invoices, and customer portal
- Persistent CRUD mutations and server actions
- Real file uploads to Supabase Storage
- Live notifications, email, SMS, and background jobs
- Production analytics aggregation and reporting pipelines
