# Fixpass Web Production Runbook

## 1. Install and verify locally

```bash
cd /Users/josehernandez/Documents/fixpass-site
npm install
npm run verify
```

## 2. Configure environment

Use:

- [`/Users/josehernandez/Documents/fixpass-site/.env.production.example`](/Users/josehernandez/Documents/fixpass-site/.env.production.example)

Required values:

```bash
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_SILVER_MONTHLY
STRIPE_PRICE_SILVER_ANNUAL
STRIPE_PRICE_GOLD_MONTHLY
STRIPE_PRICE_GOLD_ANNUAL
STRIPE_PRICE_PLATINUM_MONTHLY
STRIPE_PRICE_PLATINUM_ANNUAL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

## 3. Apply database schema

Apply in this order:

1. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql)
2. [`/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql)
3. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql)
4. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql)

If mobile launch support is using the same Supabase project, also ensure:

5. [`/Users/josehernandez/Documents/my-new-app/supabase/migrations/002_mobile_launch.sql`](/Users/josehernandez/Documents/my-new-app/supabase/migrations/002_mobile_launch.sql)

## 4. Deploy the web app

Recommended host:

- Vercel

Use the Vercel-specific deployment guide:

- [`/Users/josehernandez/Documents/fixpass-site/docs/vercel-deployment.md`](/Users/josehernandez/Documents/fixpass-site/docs/vercel-deployment.md)

Before promoting to production:

```bash
npm run build
```

## 5. Configure Stripe webhook

The web app expects Stripe webhook events for subscription syncing in:

- [`/Users/josehernandez/Documents/fixpass-site/src/app/api/stripe/webhook/route.ts`](/Users/josehernandez/Documents/fixpass-site/src/app/api/stripe/webhook/route.ts)

Set the deployed webhook endpoint in Stripe, then store:

```bash
STRIPE_WEBHOOK_SECRET
```

## 6. Auth and role verification

Verify these role paths in production:

- customer can access only customer routes
- technician can access only technician routes
- admin can access only admin routes
- unauthenticated users are redirected to sign-in

## 7. Operations verification

### Customer

- sign in
- open billing page
- view membership
- create a request
- update property

### Technician

- sign in
- view assigned jobs
- update job status
- add visit notes

### Admin

- sign in
- open live request board
- update request status
- assign technician
- edit quotes
- edit plans
- edit service rules
- verify analytics load

## 8. Before public launch

- confirm `003_security_hardening.sql` is applied and tested
- review RLS behavior with real customer, technician, and admin accounts
- add Privacy Policy URL
- add Terms URL
- add Support URL and support email
- verify Stripe live keys and live prices
- run final smoke test on production domain
