# FIXPASS Web Platform

Premium Next.js operations platform for Fixpass, the membership for home repairs in Katy, Texas.

## Current state

This project now supports two modes:

- `live mode`: real Supabase-backed auth, role protection, repositories, server actions, and Stripe webhook syncing when production env values are present
- `preview mode`: seeded demo data and fallback role entry for local exploration when live env values are missing

## What is implemented

- Premium public marketing site for `home`, `how-it-works`, `plans`, `coverage`, `faq`, and `join`
- Real Supabase-backed sign-in, sign-out, and role-aware route protection when env is configured
- Fallback preview/demo sign-in for local non-configured review
- Live-capable customer portal for membership, requests, property, and billing
- Live-capable admin portal for requests, schedule, analytics, quotes, plans, and settings
- Live-capable technician portal for assignments, route details, visit notes, and status updates
- Stripe billing portal entry point and webhook sync path
- Supabase-ready relational schema, seed data, and security-hardening migration
- Responsive operational UI across desktop and mobile web

## What still needs hardening before public launch

- Full production review of all RLS policies after applying `003_security_hardening.sql`
- Customer-facing web photo upload flow
- Background analytics aggregation and alerting
- Final legal/support/public-site production content

## Key files

```text
src/
  app/
    (portals)/
      admin/
      customer/
      technician/
    api/
      auth/
      billing/
      service-requests/
      stripe/
    sign-in/
  lib/
    auth.ts
    integrations/
      stripe/
      supabase/
    repositories/
      admin-config.ts
      admin-operations.ts
      customer-operations.ts
      technician-operations.ts
supabase/
  migrations/
    001_init_fixpass.sql
    003_security_hardening.sql
  seed.sql
docs/
  app-blueprint.md
  architecture.md
  production-runbook.md
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Verify the project:

```bash
npm run verify
```

## Environment setup

For local live-mode development, copy `.env.example` to `.env.local` and provide:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_SILVER_MONTHLY=...
STRIPE_PRICE_SILVER_ANNUAL=...
STRIPE_PRICE_GOLD_MONTHLY=...
STRIPE_PRICE_GOLD_ANNUAL=...
STRIPE_PRICE_PLATINUM_MONTHLY=...
STRIPE_PRICE_PLATINUM_ANNUAL=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

For production, use:

- [`/Users/josehernandez/Documents/fixpass-site/.env.production.example`](/Users/josehernandez/Documents/fixpass-site/.env.production.example)

## Database setup

Apply these in order:

1. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql)
2. [`/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql)
3. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql)
4. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql)

## Deployment and launch

Use the runbooks:

- [`/Users/josehernandez/Documents/fixpass-site/docs/production-runbook.md`](/Users/josehernandez/Documents/fixpass-site/docs/production-runbook.md)
- [`/Users/josehernandez/Documents/fixpass-site/docs/vercel-deployment.md`](/Users/josehernandez/Documents/fixpass-site/docs/vercel-deployment.md)
- [`/Users/josehernandez/Documents/FIXPASS_LAUNCH_BOX.md`](/Users/josehernandez/Documents/FIXPASS_LAUNCH_BOX.md)

## Current verification

- `npm run lint` passes
- `npm run build` passes
