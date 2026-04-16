# Fixpass MVP Architecture

## Product surfaces

- Public marketing site for acquisition and education
- Customer portal for membership, property, service requests, billing, and notifications
- Technician portal for assigned jobs, execution workflow, notes, and out-of-scope escalation
- Admin operations dashboard for request triage, scheduling, plans, fair-use review, quotes, and analytics

## Stack

- Next.js App Router with TypeScript and Tailwind CSS
- Demo auth guard and protected routing via cookie-backed middleware
- Demo-first UI rendered from typed domain seed data in `src/lib/demo-data.ts`
- Supabase-ready schema under `supabase/migrations/001_init_fixpass.sql`
- Stripe-ready environment contract in `.env.example`

## Architecture notes

- Current UI is built as a realistic investor-ready MVP using local demo data so it can run without external services.
- Portal access is protected in demo mode through `src/middleware.ts` and `src/app/api/demo-login/route.ts`.
- Supabase auth, storage, and live queries are intentionally scaffold-ready rather than wired in this workspace.
- Stripe billing, checkout sessions, customer portal links, and webhook processing are also scaffold-ready but mocked in the UI.
- Route groups under `src/app/(portals)` separate customer, technician, and admin experiences.
- Shared business rules, seeded plans, service requests, billing records, analytics series, and domain helper logic live in `src/lib`.

## Next production integrations

- Replace demo data with typed Supabase queries and server actions.
- Add Supabase row-level security by role.
- Add Stripe checkout, subscription lifecycle sync, and webhook handlers.
- Add file uploads to Supabase Storage for issue photos and before/after completion media.
- Replace static analytics with SQL views or materialized aggregates.
