# Fixpass Web Vercel Deployment

This web app should run against the same production `Supabase` project and `Stripe` account as the Fixpass mobile app.

## 1. Verify locally before deployment

```bash
cd /Users/josehernandez/Documents/fixpass-site
npm install
npm run verify
```

## 2. Link the project to Vercel

```bash
npm install -g vercel
vercel link
```

If you want Vercel-managed env values locally:

```bash
vercel env pull .env.local
```

## 3. Production environment variables

Add these to the Vercel project in the `Production` environment:

```bash
NEXT_PUBLIC_APP_URL=https://app.fixpass.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_SILVER_MONTHLY=price_live_silver_monthly
STRIPE_PRICE_SILVER_ANNUAL=price_live_silver_annual
STRIPE_PRICE_GOLD_MONTHLY=price_live_gold_monthly
STRIPE_PRICE_GOLD_ANNUAL=price_live_gold_annual
STRIPE_PRICE_PLATINUM_MONTHLY=price_live_platinum_monthly
STRIPE_PRICE_PLATINUM_ANNUAL=price_live_platinum_annual
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

Sensitive values should be stored as protected Vercel env vars:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 4. Shared backend requirements

Before the website is promoted to production, make sure the shared Supabase project already has:

1. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/001_init_fixpass.sql)
2. [`/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/seed.sql)
3. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/003_security_hardening.sql)
4. [`/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql`](/Users/josehernandez/Documents/fixpass-site/supabase/migrations/004_waitlist_leads.sql)
5. [`/Users/josehernandez/Documents/my-new-app/supabase/migrations/002_mobile_launch.sql`](/Users/josehernandez/Documents/my-new-app/supabase/migrations/002_mobile_launch.sql)

The mobile app and web app should share:

- the same customer accounts
- the same subscription records
- the same Stripe products and price IDs
- the same Stripe customer records

## 5. Stripe webhook target

Create the Stripe production webhook endpoint at:

```text
https://app.fixpass.com/api/stripe/webhook
```

If you choose a different production domain, use that domain instead and set `NEXT_PUBLIC_APP_URL` to match.

Recommended events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

## 6. Deploy to Vercel

For the first deploy:

```bash
cd /Users/josehernandez/Documents/fixpass-site
vercel
```

For production:

```bash
vercel --prod
```

If the project is Git-connected, production deploys should come from the production branch after env values are configured.

## 7. Domain setup

Recommended production domain:

- `app.fixpass.com`

After deployment, add the domain in Vercel and point DNS there. Once attached, production deploys will serve from that domain automatically.

## 8. Production smoke test

### Public site

- homepage loads
- plans page loads
- join form writes to waitlist leads
- privacy, terms, and support pages load

### Customer web app

- sign in works
- membership page loads live data
- billing page opens Stripe billing portal
- request creation works
- property update works

### Admin

- admin sign in works
- requests board loads live data
- analytics loads
- plan edits persist

### Technician

- assigned jobs load
- job detail opens
- status updates persist

## 9. Preview deployment safety

If you do not want branch previews touching live customer data:

- leave production secrets off `Preview`
- or use a separate staging Supabase project and Stripe test account for preview deployments

That keeps preview builds safe while production stays fully live.
